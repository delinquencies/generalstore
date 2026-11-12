"use strict";

const form = document.querySelector("#product-form");
const list = document.querySelector("#products");
const message = document.querySelector("#message");
const endpoint = "/api/admin/products";
const shippingFields = ["weightOz", "lengthIn", "widthIn", "heightIn"];
const specificationFields = ["materials", "maker", "origin", "dimensions", "conditionNotes"];
const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const heading = document.querySelector("h1");
const cancelEdit = document.querySelector("#cancel-edit");
let editing = null;
let saving = false;

function editProduct(item) {
  if (saving) return;
  editing = item;
  form.reset();
  heading.textContent = item ? "Edit Product" : "Add Product";
  cancelEdit.hidden = !item;
  for (const button of form.querySelectorAll("button[type=submit]")) {
    button.hidden = item ? button.value !== "edit" : button.value === "edit";
  }
  if (!item) return;
  const fields = { title: item.title, description: item.description, department: item.department, condition: item.condition,
    stock: item.stock, price: (item.priceCents / 100).toFixed(2), salePrice: item.salePriceCents == null ? "" : (item.salePriceCents / 100).toFixed(2),
    searchKeywords: (item.searchKeywords ?? []).join(","), ...item.shipping, ...item.specifications };
  for (const [key, value] of Object.entries(fields)) form.elements[key].value = value;
  form.elements.spotlight.checked = item.spotlight;
  form.elements.oneOfOne.checked = item.oneOfOne;
  form.elements.title.focus();
  report("");
}

cancelEdit.addEventListener("click", () => editProduct(null));

function report(text, error = false) {
  message.textContent = text;
  message.toggleAttribute("data-error", error);
}

async function request(method, body) {
  const response = await fetch(endpoint, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (response.status === 401) throw new Error("Reload the portal to sign in.");
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
}

function showProducts(products) {
  list.replaceChildren();
  if (!products.length) {
    const empty = document.createElement("li");
    empty.textContent = "No products added yet.";
    list.append(empty);
    return;
  }
  for (const item of products) {
    const row = document.createElement("li");
    const summary = document.createElement("div");
    const name = document.createElement(item.status === "published" ? "a" : "strong");
    name.textContent = item.title;
    if (item.status === "published") name.href = "/index.html?view=product&item=" + encodeURIComponent(item.slug);
    const details = document.createElement("p");
    details.textContent = (item.status === "published" ? "Published" : "Draft") + " · " + price.format(item.priceCents / 100) + " · " + item.stock + " in stock";
    summary.append(name, details);
    if (item.salePriceCents != null || item.spotlight || item.oneOfOne) {
      const promotion = document.createElement("p");
      promotion.textContent = [
        item.salePriceCents == null ? "" : "Sale " + price.format(item.salePriceCents / 100),
        item.spotlight ? "Featured spotlight" : "",
        item.oneOfOne ? "One of one" : "",
      ].filter(Boolean).join(" · ");
      summary.append(promotion);
    }
    if (item.shipping) {
      const { weightOz, lengthIn, widthIn, heightIn } = item.shipping;
      const shipping = document.createElement("p");
      const dimensions = [lengthIn, widthIn, heightIn];
      const measurements = [];
      if (weightOz !== undefined) measurements.push(weightOz + " oz");
      if (dimensions.some((value) => value !== undefined)) {
        measurements.push(dimensions.map((value) => value ?? "–").join(" × ") + " in");
      }
      shipping.textContent = "Packed estimate · " + measurements.join(" · ");
      summary.append(shipping);
    }
    row.append(summary);
    const edit = document.createElement("button");
    edit.type = "button";
    edit.textContent = "Edit";
    edit.setAttribute("aria-label", "Edit " + item.title);
    edit.addEventListener("click", () => editProduct(item));
    row.append(edit);
    if (item.photoCount) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = item.status === "published" ? "Unpublish" : "Publish";
      button.addEventListener("click", async () => {
        button.disabled = true;
        try {
          const result = await request("PATCH", { id: item.id, status: item.status === "published" ? "draft" : "published" });
          await refresh();
          report(result.status === "published" ? "Product published." : "Product moved to drafts.");
        } catch (error) {
          report(error.message, true);
          button.disabled = false;
        }
      });
      row.append(button);
    } else {
      const label = document.createElement("label");
      label.textContent = "Add photos to publish this draft";
      const upload = document.createElement("input");
      upload.type = "file";
      upload.accept = "image/jpeg,image/png,image/webp";
      upload.multiple = true;
      upload.addEventListener("change", async () => {
        const files = [...upload.files];
        if (!files.length) return;
        if (files.length > 4 || files.some((file) => file.size > 2 * 1024 * 1024)) {
          report("Choose up to four photos, each no larger than 2 MB.", true);
          return;
        }
        upload.disabled = true;
        try {
          await request("PATCH", { id: item.id, status: "draft", photos: await Promise.all(files.map(readPhoto)) });
          await refresh();
          report("Photos saved. The draft is ready to publish.");
        } catch (error) {
          report(error.message, true);
          upload.disabled = false;
        }
      });
      label.append(upload);
      row.append(label);
    }
    list.append(row);
  }
}

async function refresh() {
  showProducts(await request("GET"));
}

function readPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read " + file.name));
    reader.readAsDataURL(file);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (saving) return;
  const values = new FormData(form);
  const photos = [...form.elements.photos.files];
  const status = event.submitter?.value || "draft";
  if (photos.length > 4 || photos.some((file) => file.size > 2 * 1024 * 1024)) {
    report("Choose up to four photos, each no larger than 2 MB.", true);
    return;
  }
  if (!editing && status === "published" && !photos.length) {
    report("Add at least one photo before publishing.", true);
    return;
  }
  const controls = form.querySelectorAll("button");
  saving = true;
  controls.forEach((button) => { button.disabled = true; });
  report("Saving product…");
  try {
    const shipping = {};
    for (const field of shippingFields) {
      const value = values.get(field);
      if (value) shipping[field] = Number(value);
    }
    const details = {
      title: values.get("title"), description: values.get("description"),
      searchKeywords: values.get("searchKeywords"),
      department: values.get("department"), condition: values.get("condition"),
      priceCents: Math.round(Number(values.get("price")) * 100), stock: Number(values.get("stock")),
      salePriceCents: values.get("salePrice") ? Math.round(Number(values.get("salePrice")) * 100) : null,
      spotlight: form.elements.spotlight.checked,
      oneOfOne: form.elements.oneOfOne.checked,
      specifications: Object.fromEntries(specificationFields.map((field) => [field, values.get(field)])),
      shipping,
    };
    const uploads = await Promise.all(photos.map(readPhoto));
    const wasEditing = Boolean(editing);
    if (editing) await request("PATCH", { id: editing.id, details, ...(uploads.length ? { photos: uploads } : {}) });
    else await request("POST", { ...details, status, photos: uploads });
    saving = false;
    editProduct(null);
    await refresh();
    report(wasEditing ? "Changes saved." : status === "published" ? "Product published to the local storefront." : "Draft saved.");
  } catch (error) {
    report(error.message, true);
  } finally {
    saving = false;
    controls.forEach((button) => { button.disabled = false; });
  }
});

refresh().catch((error) => report(error.message, true));
