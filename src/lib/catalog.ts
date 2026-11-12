import { products } from "./fixtures.ts";

export type Product = (typeof products)[number];
export type ProductSlug = Product["slug"];
export type Cart = Partial<Record<ProductSlug, number>>;

export const departments = {
  objects: "Objects & Curiosities",
  home: "Home & Living",
  essentials: "Everyday Essentials",
  vintage: "Vintage & Found",
} as const;

export type Department = keyof typeof departments;
export type MedusaProduct = {
  source: "medusa";
  slug: string;
  title: string;
  description: string;
  sku: string;
  department: Department | null;
  condition: "New" | "Vintage" | null;
  stock: number | null;
  priceCents: number | null;
  priceFrom: boolean;
  photo?: { src: string; alt: string };
};
export type StoreProduct = Product | MedusaProduct;
export function isMedusaProduct(item: StoreProduct): item is MedusaProduct {
  return "source" in item;
}

export const fresh = products.slice(0, 6);
export const findProduct = (slug: string) => products.find((item) => item.slug === slug);
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);

export function searchCatalog(
  { query = "", department = "", condition = "" } = {},
  items: readonly StoreProduct[] = products,
) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    const searchable = [item.title, item.description, item.sku, item.department && departments[item.department]].join(" ").toLowerCase();
    return (!department || item.department === department) &&
      (!condition || item.condition === condition) &&
      terms.every((term) => searchable.includes(term));
  });
}

export function setQuantity(cart: Cart, slug: string, quantity: number): Cart {
  const product = findProduct(slug);
  if (!product || !Number.isSafeInteger(quantity)) return cart;
  const next = { ...cart };
  if (quantity <= 0 || product.stock === 0) delete next[product.slug];
  else next[product.slug] = Math.min(quantity, product.stock);
  return next;
}

export function restoreCart(value: unknown): Cart {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.entries(value).reduce<Cart>((cart, [slug, count]) =>
    typeof count === "number" ? setQuantity(cart, slug, count) : cart, {});
}
