"use client";

import Link from "next/link";
import { createContext, useContext, useSyncExternalStore, useState, type ReactNode } from "react";
import { departments, findProduct, fresh, isMedusaProduct, money, restoreCart, setQuantity, type Cart, type Product, type ProductSlug, type StoreProduct } from "@/lib/catalog";
import { photos } from "@/lib/photos";
import { Photo } from "./photo";

const storageKey = "general-edit-preview-v1";
const empty = { cart: {} as Cart, favorites: [] as ProductSlug[] };
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cached = empty;

function snapshot() {
  let raw: string | null;
  try { raw = window.localStorage.getItem(storageKey); } catch { return cached; }
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const value = raw ? JSON.parse(raw) : {};
    cached = {
      cart: restoreCart(value?.cart),
      favorites: Array.isArray(value?.favorites)
        ? [...new Set<ProductSlug>(value.favorites.filter((slug: unknown) => typeof slug === "string" && findProduct(slug)))]
        : [],
    };
  } catch { cached = empty; }
  return cached;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => { listeners.delete(listener); window.removeEventListener("storage", listener); };
}

function update(value: typeof empty) {
  try {
    cachedRaw = JSON.stringify(value);
    window.localStorage.setItem(storageKey, cachedRaw);
  } catch { /* Retain the current tab's state when browser storage is unavailable. */ }
  cached = value;
  listeners.forEach((listener) => listener());
}

type Filter = "all" | "staff" | "one" | "under";
const StoreContext = createContext<{ filter: Filter; setFilter: (value: Filter) => void; announce: (message: string) => void } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [status, announce] = useState("");
  return <StoreContext.Provider value={{ filter, setFilter, announce }}>
    {children}
    <p className="sr-only" role="status">{status}</p>
  </StoreContext.Provider>;
}

function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("StoreProvider is required");
  return value;
}

function useBag() { return useSyncExternalStore(subscribe, snapshot, () => empty); }

export function BagCount() {
  const { cart } = useBag();
  return Object.values(cart).reduce((total, count) => total + count, 0);
}

export function AddButton({ slug, className, children }: { slug: ProductSlug; className: string; children: ReactNode }) {
  const { cart } = useBag();
  const { announce } = useStore();
  const product = findProduct(slug)!;
  const current = cart[slug] ?? 0;
  const full = current >= product.stock;
  return <button type="button" className={className + " disabled:cursor-default disabled:opacity-60"} disabled={full}
    onClick={() => {
      const state = snapshot();
      const next = setQuantity(state.cart, slug, (state.cart[slug] ?? 0) + 1);
      update({ ...state, cart: next });
      announce(product.title + " added to your bag.");
    }}>
    {product.stock === 0 ? "Sold out" : full ? "In your bag" : children}
  </button>;
}

function FavoriteButton({ slug }: { slug: ProductSlug }) {
  const { favorites } = useBag();
  const selected = favorites.includes(slug);
  return <button type="button" aria-label="Favorite" aria-pressed={selected}
    className="flex items-center justify-center border-2 border-ink p-2.5 hover:bg-canary aria-pressed:bg-canary"
    onClick={() => {
      const state = snapshot();
      update({ ...state, favorites: state.favorites.includes(slug) ? state.favorites.filter((item) => item !== slug) : [...state.favorites, slug] });
    }}>
    <span className="material-symbols-outlined text-base" aria-hidden="true">favorite</span>
  </button>;
}

const badges: Partial<Record<ProductSlug, [string, string, string, string]>> = {
  "bitossi-cobalt-vessel": ["ONE & ONLY", "ITALY · 1976", "bg-bubblegum", "sticker-rotate-2"],
  "marvis-cinnamon-mint": ["CULT CLASSIC", "RESTOCKED", "bg-canary", "sticker-rotate-1"],
  "brass-squiggle-taper": ["WE LOVE IT", "1.4 LBS SOLID BRASS", "bg-melon", "sticker-rotate-3"],
  "furstenberg-espresso-pair": ["ONE SET ONLY", "GERMANY · 1968", "bg-bubblegum", "sticker-rotate-2"],
  "redecker-book-duster": ["CHIC CHORES", "BEECHWOOD & HAIR", "bg-butter", "sticker-rotate-1"],
  "amber-fine-mister": ["PLANT PARENT STAPLE", "500ML BOROSILICATE", "bg-lilac", "sticker-rotate-2"],
};

export function ProductCard({ item }: { item: StoreProduct }) {
  const medusa = isMedusaProduct(item);
  const badge = medusa ? undefined : badges[item.slug];
  const photo = medusa ? item.photo : photos[item.slug];
  return <article className="group flex flex-col justify-between border-2 border-ink bg-white p-4 hard-shadow transition-all">
    <div>
      <Link href={`/products/${item.slug}`} className="relative mb-4 block aspect-[4/5] w-full overflow-hidden border-2 border-ink bg-cream">
        {photo ? <Photo photo={photo} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <span className="grid h-full place-items-center text-sm text-ink/70">Photo unavailable</span>}
        {(badge || item.stock === 0) && <span className={`absolute left-3 top-3 border-2 border-ink px-2.5 py-0.5 font-mono-display text-[10px] font-bold uppercase tracking-wider hard-shadow-sm ${badge?.[2] ?? "bg-cream"} ${badge?.[3] ?? ""}`}>{item.stock === 0 ? "Sold out" : badge?.[0]}</span>}
        {badge && <span className="absolute bottom-3 right-3 border border-ink bg-white/90 px-2 py-0.5 font-mono-display text-[10px] font-bold">{badge[1]}</span>}
      </Link>
      <div className="space-y-1">
        <div className="flex items-baseline justify-between">
          <h3 className="font-serif text-xl font-medium group-hover:text-cobalt"><Link href={`/products/${item.slug}`}>{item.title}</Link></h3>
          <span className="ml-2 shrink-0 font-mono-display text-sm font-bold sm:text-lg">{item.priceCents === null ? "Price unavailable" : `${medusa && item.priceFrom ? "From " : ""}${money(item.priceCents)}`}</span>
        </div>
        <p className="text-xs text-ink/70">{item.description}</p>
      </div>
    </div>
    {!medusa && <div className="flex items-center gap-2 pt-5">
      <AddButton slug={item.slug} className="flex flex-1 items-center justify-center gap-2 border-2 border-ink bg-ink px-4 py-2.5 font-mono-display text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-tangerine">
        <span className="material-symbols-outlined text-sm" aria-hidden="true">add_shopping_cart</span> Add to bag
      </AddButton>
      <FavoriteButton slug={item.slug} />
    </div>}
  </article>;
}

const filters: { key: Filter; name: string; hover: string; matches: (product: Product) => boolean }[] = [
  { key: "all", name: "All New", hover: "hover:bg-canary", matches: () => true },
  { key: "staff", name: "★ Staff Faves", hover: "hover:bg-canary", matches: (item) => item.staffPick },
  { key: "one", name: "Only One Left", hover: "hover:bg-melon", matches: (item) => item.stock === 1 },
  { key: "under", name: "Under $35", hover: "hover:bg-lilac", matches: (item) => item.priceCents < 3500 },
];

export function FreshFilters() {
  const { filter, setFilter } = useStore();
  return <div aria-label="Filter recent arrivals" className="flex flex-wrap gap-2 font-mono-display text-xs font-bold uppercase">
    {filters.map(({ key, name, hover, matches }) => <button key={key} type="button" aria-pressed={key === filter} onClick={() => setFilter(key)}
      className={`border-2 border-ink px-4 py-2 uppercase hard-shadow-sm transition-colors ${key === filter ? "bg-ink text-white" : "bg-white " + hover}`}>
      {name}{key !== "staff" && ` (${fresh.filter(matches).length})`}
    </button>)}
  </div>;
}

export function FreshGrid() {
  const { filter } = useStore();
  const active = filters.find(({ key }) => key === filter)!;
  return <ProductGrid items={fresh.filter(active.matches)} />;
}

export function ProductGrid({ items }: { items: readonly StoreProduct[] }) {
  if (!items.length) return <p className="border-2 border-ink bg-white p-6 font-serif text-2xl">No objects match this selection.</p>;
  return <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item) => <ProductCard item={item} key={item.slug} />)}
  </div>;
}

export function SearchForm({ mobile = false }: { mobile?: boolean }) {
  return <form action="/shop" role="search" className={mobile ? "relative flex" : "relative hidden items-center md:flex"}>
    <input name="q" type="search" maxLength={100} aria-label="Search products" placeholder="Search strange candles, soaps, oddities..."
      className="w-full rounded-full border-2 border-ink bg-cream-muted py-1.5 pl-9 pr-3 font-mono-display text-base md:text-xs shadow-[2px_2px_0px_#1E1A17] placeholder:text-ink/50 focus:bg-white md:w-52" />
    <button type="submit" aria-label="Submit search" className="absolute inset-y-0 left-2.5 grid place-items-center"><span className="material-symbols-outlined text-base" aria-hidden="true">search</span></button>
  </form>;
}

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  return <div className="px-6 pb-3 xl:hidden">
    <button type="button" aria-expanded={open} aria-controls="mobile-navigation" className="min-h-11 px-2 -ml-2 font-mono-display text-xs font-bold uppercase" onClick={() => setOpen(!open)}>{open ? "Close menu" : "Menu"}</button>
    {open && <nav id="mobile-navigation" className="mt-3 grid gap-3 border-t-2 border-ink pt-3 font-mono-display text-xs font-bold uppercase" onClick={(event) => {
      if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
    }}>
      <div className="md:hidden"><SearchForm mobile /></div>
      <Link href="/shop">Shop All</Link>
      {Object.entries(departments).map(([key, label]) => <Link key={key} href={`/collections/${key}`}>{label}</Link>)}
      <Link href="/favorites">Favorites</Link>
      <Link href="/#the-drop">The Next Drop</Link>
    </nav>}
  </div>;
}

export function PreviewForm({ kind, className, children }: { kind: "email" | "tel"; className: string; children: ReactNode }) {
  const [submitted, setSubmitted] = useState(false);
  return <form className={className} onSubmit={(event) => {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
  }}>
    {children}
    {submitted && <p role="status" className="font-mono-display text-xs">Preview only. {kind === "tel" ? "Phone number" : "Email address"} was discarded.</p>}
  </form>;
}

export function Favorites() {
  const { favorites } = useBag();
  const items = favorites.flatMap((slug) => { const product = findProduct(slug); return product ? [product] : []; });
  return items.length ? <ProductGrid items={items} /> : <p>Your favorites are empty. <Link className="underline" href="/shop">Browse the shop</Link>.</p>;
}

export function Bag() {
  const { cart } = useBag();
  const lines = Object.entries(cart).flatMap(([slug, quantity]) => {
    const item = findProduct(slug);
    return item && quantity ? [{ item, quantity }] : [];
  });
  if (!lines.length) return <p>Your bag is empty. <Link href="/shop" className="underline">Browse the shop</Link>.</p>;
  const subtotal = lines.reduce((sum, { item, quantity }) => sum + item.priceCents * quantity, 0);
  return <div className="space-y-6">
    <ul className="divide-y-2 divide-ink border-2 border-ink bg-white hard-shadow">
      {lines.map(({ item, quantity }) => <li key={item.sku} className="flex flex-wrap items-center justify-between gap-4 p-4">
        <Link href={`/products/${item.slug}`} className="font-serif text-2xl hover:underline">{item.title}</Link>
        <div className="flex flex-wrap items-center gap-4">
          <label className="font-mono-display text-sm">Quantity <select value={quantity} className="border-2 border-ink py-1" onChange={(event) => {
            const state = snapshot();
            update({ ...state, cart: setQuantity(state.cart, item.slug, Number(event.target.value)) });
          }}>{Array.from({ length: item.stock }, (_, index) => <option key={index + 1}>{index + 1}</option>)}</select></label>
          <span>{money(item.priceCents * quantity)}</span>
          <button type="button" className="underline" onClick={() => {
            const state = snapshot();
            update({ ...state, cart: setQuantity(state.cart, item.slug, 0) });
          }} aria-label={`Remove ${item.title}`}>Remove</button>
        </div>
      </li>)}
    </ul>
    <p className="font-mono-display font-bold">Subtotal {money(subtotal)}</p>
    <Link href="/checkout" className="inline-block border-2 border-ink bg-ink px-5 py-3 font-mono-display text-sm font-bold uppercase text-white hard-shadow-sm">Preview checkout</Link>
  </div>;
}
