import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";

const directory = new URL("../.oddly-enough/", import.meta.url);
const catalogFile = new URL("catalog.json", directory);
const passcode = process.env.ODDLY_ENOUGH_ADMIN_PASSWORD || randomBytes(12).toString("base64url");
const expected = Buffer.from("owner:" + passcode);
const departments = new Set(["objects", "home", "essentials", "vintage"]);
const maxPhotoBytes = 2 * 1024 * 1024;
const maxRequestBytes = 12 * 1024 * 1024;
let pending = Promise.resolve();

export const adminPasscode = process.env.ODDLY_ENOUGH_ADMIN_PASSWORD ? null : passcode;

async function readCatalog() {
  try { return JSON.parse(await readFile(catalogFile, "utf8")); }
  catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

function changeCatalog(update) {
  const next = pending.then(async () => {
    const products = await readCatalog();
    const result = update(products);
    await mkdir(directory, { recursive: true });
    const temporary = new URL(randomUUID() + ".tmp", directory);
    await writeFile(temporary, JSON.stringify(products), { flag: "wx" });
    await rename(temporary, catalogFile);
    return result;
  });
  pending = next.catch(() => {});
  return next;
}

function invalid(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

async function jsonBody(request, limit = maxRequestBytes) {
  if (request.headers.origin !== "http://127.0.0.1:4173" && request.headers.origin !== "http://localhost:4173") {
    throw invalid("Open the portal on the local preview address.", 403);
  }
  if (request.headers["content-type"] !== "application/json") throw invalid("Expected a JSON request.");
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > limit) throw invalid("Request is too large.", 413);
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw invalid("The request could not be read."); }
}

function photoFrom(value) {
  if (typeof value !== "string" || value.length > Math.ceil(maxPhotoBytes / 3) * 4 + 64) throw invalid("Each photo must be 2 MB or smaller.");
  const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) throw invalid("Use JPG, PNG, or WebP photos.");
  const [, type, base64] = match;
  const bytes = Buffer.from(base64, "base64");
  const valid = type === "jpeg" ? bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255])) :
    type === "png" ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) :
      bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP";
  if (!valid || bytes.length > maxPhotoBytes) throw invalid("A photo is damaged or too large.");
  return { type, base64 };
}

function shippingFrom(value) {
  if (value == null) return null;
  if (typeof value !== "object" || Array.isArray(value)) throw invalid("Enter valid shipping measurements.");
  const shipping = {};
  const labels = { weightOz: "packed weight (oz)", lengthIn: "length (in)", widthIn: "width (in)", heightIn: "height (in)" };
  for (const [key, label] of Object.entries(labels)) {
    const measurement = value[key];
    if (measurement === undefined) continue;
    if (!Number.isFinite(measurement) || measurement < 0.01) {
      throw invalid("Enter a " + label + " of at least 0.01.");
    }
    shipping[key] = measurement;
  }
  return Object.keys(shipping).length ? shipping : null;
}

function specificationsFrom(value = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw invalid("Enter valid product specifications.");
  const limits = { materials: 200, maker: 120, origin: 120, dimensions: 120, conditionNotes: 500 };
  const specifications = {};
  for (const [field, limit] of Object.entries(limits)) {
    const entry = value[field] ?? "";
    if (typeof entry !== "string" || entry.length > limit) throw invalid("A product specification exceeds its allowed length or format.");
    if (entry.trim()) specifications[field] = entry.trim();
  }
  return specifications;
}

function productDetails(body) {
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  if (!title || title.length > 100) throw invalid("Enter a product name under 101 characters.");
  if (!description || description.length > 2000) throw invalid("Enter a description under 2,001 characters.");
  const keywordInput = body.searchKeywords ?? "";
  if (typeof keywordInput !== "string" || keywordInput.length > 300) throw invalid("Enter up to 300 characters of search keywords.");
  const searchKeywords = [...new Set(keywordInput.split(",").map((keyword) => keyword.trim().toLowerCase()).filter(Boolean))];
  if (!departments.has(body.department)) throw invalid("Choose a department.");
  if (!["New", "Vintage"].includes(body.condition)) throw invalid("Choose a condition.");
  if (!Number.isSafeInteger(body.priceCents) || body.priceCents < 1 || body.priceCents > 100_000_000) throw invalid("Enter a price from $0.01 to $1,000,000.");
  const salePriceCents = body.salePriceCents ?? null;
  if (salePriceCents !== null && (!Number.isSafeInteger(salePriceCents) || salePriceCents < 1 || salePriceCents >= body.priceCents)) {
    throw invalid("Enter a sale price below the regular price.");
  }
  if (body.spotlight !== undefined && typeof body.spotlight !== "boolean") throw invalid("Choose a valid spotlight setting.");
  if (body.oneOfOne !== undefined && typeof body.oneOfOne !== "boolean") throw invalid("Choose a valid one-of-one setting.");
  if (!Number.isSafeInteger(body.stock) || body.stock < 0 || body.stock > 9999) throw invalid("Enter a quantity from 0 to 9,999.");
  if (body.oneOfOne && body.stock > 1) throw invalid("A one-of-one product can have at most one in stock.");
  return {
    title, description, searchKeywords, department: body.department, condition: body.condition,
    priceCents: body.priceCents, salePriceCents, spotlight: body.spotlight ?? false, oneOfOne: body.oneOfOne ?? false,
    stock: body.stock, shipping: shippingFrom(body.shipping), specifications: specificationsFrom(body.specifications),
  };
}

function productFrom(body) {
  const details = productDetails(body);
  if (!["draft", "published"].includes(body.status)) throw invalid("Choose draft or publish.");
  if (!Array.isArray(body.photos) || body.photos.length > 4) throw invalid("Upload up to four photos.");
  if (body.status === "published" && !body.photos.length) throw invalid("Add a photo before publishing.");
  const id = randomUUID();
  const slug = details.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 65) || "product";
  return { id, slug: slug + "-" + id.slice(0, 8), sku: "OE-" + id.slice(0, 8).toUpperCase(), ...details, status: body.status, photos: body.photos.map(photoFrom) };
}

const adminSummary = ({ id, slug, title, description, department, condition, searchKeywords = [], status, stock, priceCents, salePriceCents = null, spotlight = false, oneOfOne = false, shipping = null, specifications = {}, photos }) =>
  ({ id, slug, title, description, department, condition, searchKeywords, status, stock, priceCents, salePriceCents, spotlight, oneOfOne, shipping, specifications, photoCount: photos.length });

export async function publishedProducts() {
  return (await readCatalog()).filter((item) => item.status === "published").map((item) => {
    const images = item.photos.map((_, index) => ({ src: "./product-photo/" + item.id + "/" + index, alt: item.title + (index ? " — photo " + (index + 1) : "") }));
    return { slug: item.slug, sku: item.sku, title: item.title, description: item.description, department: item.department,
      condition: item.condition, priceCents: item.priceCents, salePriceCents: item.salePriceCents ?? null, spotlight: item.spotlight ?? false,
      oneOfOne: item.oneOfOne ?? false, specifications: item.specifications ?? {},
      stock: item.stock, searchKeywords: item.searchKeywords ?? [], photo: images[0], images };
  });
}

const noCache = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
function sendJson(response, status, value) {
  response.writeHead(status, { ...noCache, "Content-Type": "application/json; charset=utf-8" }).end(JSON.stringify(value));
}

async function shippingEstimate(request) {
  const body = await jsonBody(request, 1024);
  if (typeof body?.zip !== "string" || !/^\d{5}$/.test(body.zip)) throw invalid("Enter a five-digit US ZIP code.");
  if (typeof body.slug !== "string" || body.slug.length > 100) throw invalid("Choose an item from the shop.");

  const item = (await readCatalog()).find(({ slug, status, stock }) => slug === body.slug && status === "published" && stock > 0);
  const { weightOz, lengthIn, widthIn, heightIn } = item?.shipping ?? {};
  if (![weightOz, lengthIn, widthIn, heightIn].every((value) => Number.isFinite(value) && value > 0)) {
    throw invalid("A shipping estimate isn’t available for this item yet.", 422);
  }

  const token = process.env.SHIPPO_API_TOKEN?.trim();
  const origin = {
    street1: process.env.SHIPPO_FROM_STREET?.trim(),
    city: process.env.SHIPPO_FROM_CITY?.trim(),
    state: process.env.SHIPPO_FROM_STATE?.trim(),
    zip: process.env.SHIPPO_FROM_ZIP?.trim() || "77521",
    country: "US",
  };
  if (!token || !origin.street1 || !origin.city || !/^[A-Z]{2}$/.test(origin.state ?? "") || !/^\d{5}$/.test(origin.zip ?? "")) {
    throw invalid("Shipping estimates are currently unavailable.", 503);
  }

  try {
    const response = await fetch("https://api.goshippo.com/shipments/", {
      method: "POST",
      headers: { Authorization: "ShippoToken " + token, "Content-Type": "application/json", "SHIPPO-API-VERSION": "2018-02-08" },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        address_from: origin,
        address_to: { zip: body.zip, country: "US" },
        parcels: [{
          length: String(lengthIn), width: String(widthIn), height: String(heightIn), distance_unit: "in",
          weight: String(weightOz / 16), mass_unit: "lb",
        }],
        async: false,
      }),
    });
    if (!response.ok) throw new Error("Carrier request failed.");
    const shipment = await response.json();
    const rates = [];
    for (const rate of Array.isArray(shipment.rates) ? shipment.rates : []) {
      const amountCents = Math.round(Number(rate?.amount) * 100);
      if (rate?.currency !== "USD" || !/^\d+(?:\.\d{1,2})?$/.test(rate.amount) || !Number.isSafeInteger(amountCents)) continue;
      if (typeof rate.provider !== "string" || typeof rate.servicelevel?.name !== "string") continue;
      rates.push({ carrier: rate.provider, service: rate.servicelevel.name, amountCents });
    }
    rates.sort((a, b) => a.amountCents - b.amountCents);
    return { test: shipment.test === true || token.startsWith("shippo_test_"), rates: rates.slice(0, 3) };
  } catch {
    throw invalid("Couldn’t get shipping estimates right now. Try again in a moment.", 502);
  }
}

export async function handleCatalogRoute(request, response, path) {
  if (path === "/api/newsletter-signup") {
    try {
      if (request.method !== "POST") throw invalid("Method not allowed.", 405);
      const body = await jsonBody(request, 1024);
      const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
      if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw invalid("Enter a valid email address.");
      }
      const subscribers = new URL("newsletter/", directory);
      await mkdir(subscribers, { recursive: true });
      const key = createHash("sha256").update(email).digest("hex");
      await writeFile(new URL(key + ".json", subscribers), JSON.stringify({ email }), { flag: "wx" }).catch((error) => {
        if (error.code !== "EEXIST") throw error;
      });
      sendJson(response, 200, { saved: true });
    } catch (error) {
      sendJson(response, error.status ?? 500, { error: error.status ? error.message : "Couldn’t save your signup. Try again in a moment." });
    }
    return true;
  }
  if (path === "/api/shipping-estimate") {
    try {
      if (request.method !== "POST") throw invalid("Method not allowed.", 405);
      sendJson(response, 200, await shippingEstimate(request));
    } catch (error) {
      sendJson(response, error.status ?? 500, { error: error.status ? error.message : "Shipping estimates are currently unavailable." });
    }
    return true;
  }
  const photo = /^\/product-photo\/([a-f0-9-]{36})\/([0-3])$/.exec(path);
  if (photo && request.method === "GET") {
    const item = (await readCatalog()).find(({ id, status }) => id === photo[1] && status === "published");
    const image = item?.photos[Number(photo[2])];
    if (!image) response.writeHead(404, noCache).end("Photo unavailable");
    else response.writeHead(200, { ...noCache, "Content-Type": "image/" + image.type }).end(Buffer.from(image.base64, "base64"));
    return true;
  }
  if (!["/admin", "/admin/", "/admin.js", "/api/admin/products"].includes(path)) return false;
  const auth = request.headers.authorization ?? "";
  const actual = Buffer.from(auth.startsWith("Basic ") ? auth.slice(6) : "", "base64");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    response.writeHead(401, { ...noCache, "WWW-Authenticate": 'Basic realm="Oddly Enough local portal", charset="UTF-8"' }).end("Sign in to manage products.");
    return true;
  }
  try {
    if (path === "/api/admin/products" && request.method === "GET") {
      sendJson(response, 200, (await readCatalog()).map(adminSummary));
    } else if (path === "/api/admin/products" && request.method === "POST") {
      const product = productFrom(await jsonBody(request));
      await changeCatalog((items) => items.unshift(product));
      sendJson(response, 201, adminSummary(product));
    } else if (path === "/api/admin/products" && request.method === "PATCH") {
      const body = await jsonBody(request);
      const item = await changeCatalog((items) => {
        const product = items.find(({ id }) => id === body?.id);
        if (!product) throw invalid("Product not found.", 404);
        const editing = body.details !== undefined;
        const status = editing ? product.status : body.status;
        if (status !== "draft" && status !== "published") throw invalid("Invalid status.");
        const details = editing ? productDetails({ specifications: product.specifications, ...body.details }) : {};
        let photos = product.photos;
        if (body.photos !== undefined) {
          if ((!editing && product.status !== "draft") || !Array.isArray(body.photos) || !body.photos.length || body.photos.length > 4) throw invalid("Choose one to four photos.");
          photos = body.photos.map(photoFrom);
        }
        if (status === "published" && !photos.length) throw invalid("Add a photo before publishing.");
        Object.assign(product, details, { status, photos });
        return product;
      });
      sendJson(response, 200, adminSummary(item));
    } else if (path !== "/api/admin/products" && request.method === "GET") {
      const filename = path === "/admin.js" ? "admin.js" : "admin.html";
      const contents = await readFile(new URL("./admin/" + filename, import.meta.url));
      response.writeHead(200, { ...noCache, "Content-Type": path === "/admin.js" ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8", "X-Frame-Options": "DENY" }).end(contents);
    } else {
      sendJson(response, 405, { error: "Method not allowed." });
    }
  } catch (error) {
    if (!error.status) console.error("Catalog operation failed:", error);
    sendJson(response, error.status ?? 500, { error: error.status ? error.message : "The catalog could not be saved or loaded." });
  }
  return true;
}
