import { cache } from "react";
import { departments, findProduct, searchCatalog, type Department, type MedusaProduct } from "./catalog.ts";

type StoreProduct = {
  handle: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  collection?: { handle: string } | null;
  metadata?: Record<string, unknown> | null;
  variants?: {
    sku?: string | null;
    manage_inventory?: boolean;
    allow_backorder?: boolean;
    inventory_quantity?: number | null;
    calculated_price?: { calculated_amount?: number; currency_code?: string } | null;
  }[];
};

function config() {
  const base = process.env.MEDUSA_BACKEND_URL;
  const key = process.env.MEDUSA_PUBLISHABLE_KEY;
  const region = process.env.MEDUSA_REGION_ID;
  if (!base && !key && !region) return null;
  if (!base || !key || !region) throw new Error("Complete the Medusa catalog settings in .env.local.");
  return { base, key, region };
}

function project(product: StoreProduct): MedusaProduct {
  const variants = product.variants ?? [];
  const prices = variants.flatMap(({ calculated_price: price }) => {
    const amount = price?.calculated_amount;
    return price?.currency_code === "usd" && typeof amount === "number" && Number.isFinite(amount) && amount >= 0
      ? [Math.round(amount * 100)] : [];
  });
  const quantities = variants.map((variant) =>
    variant.manage_inventory === true && !variant.allow_backorder && Number.isFinite(variant.inventory_quantity)
      ? Math.max(0, variant.inventory_quantity ?? 0) : null);
  const stocked = quantities.reduce<number>((total, quantity) => total + (quantity ?? 0), 0);
  const department = product.collection?.handle;
  const condition = product.metadata?.condition;
  return {
    source: "medusa",
    slug: product.handle,
    title: product.title,
    description: product.description ?? "",
    sku: variants.length === 1 ? variants[0].sku ?? "" : "",
    department: department && Object.hasOwn(departments, department) ? department as Department : null,
    condition: condition === "Vintage" || condition === "New" ? condition : null,
    stock: quantities.length && quantities.every((value) => value !== null) ? stocked : null,
    priceCents: prices.length ? Math.min(...prices) : null,
    priceFrom: variants.length > 1 && prices.length > 0 && (prices.length !== variants.length || prices.some((price) => price !== prices[0])),
    photo: product.thumbnail ? { src: product.thumbnail, alt: product.title } : undefined,
  };
}

const getMedusaProducts = cache(async (handle?: string) => {
  const options = config();
  if (!options) return null;

  const products: MedusaProduct[] = [];
  const limit = handle ? 1 : 50;
  for (let offset = 0; ; offset += limit) {
    const url = new URL("/store/products", options.base);
    url.search = new URLSearchParams({
      region_id: options.region,
      fields: "*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,+variants.sku,+metadata,*collection",
      limit: String(limit),
      offset: String(offset),
    }).toString();
    if (handle) url.searchParams.set("handle", handle);
    const response = await fetch(url, {
      headers: { "x-publishable-api-key": options.key },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Medusa catalog returned HTTP ${response.status}.`);
    const page = await response.json() as { products: StoreProduct[]; count: number };
    products.push(...page.products.map(project));
    if (handle || page.products.length < limit || products.length >= page.count) return products;
  }
});

export async function listStoreProducts(filters: Parameters<typeof searchCatalog>[0]) {
  const items = await getMedusaProducts();
  if (!items) return { connected: false, items: searchCatalog(filters) };
  return { connected: true, items: searchCatalog(filters, items) };
}

export async function getStoreProduct(handle: string) {
  const items = await getMedusaProducts(handle);
  // The homepage still features editorial samples during this catalog milestone.
  return items?.find((item) => item.slug === handle) ?? findProduct(handle);
}
