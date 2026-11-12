import Link from "next/link";
import { departments } from "@/lib/catalog";
import { listStoreProducts } from "@/lib/store-catalog";
import { ProductGrid } from "./store";

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const read = (value: string | string[] | undefined) => (typeof value === "string" ? value : "").slice(0, 100);

export async function CatalogPage({ searchParams, collection }: {
  searchParams: SearchParams; collection?: keyof typeof departments;
}) {
  const params = await searchParams;
  const query = read(params.q);
  const requestedDepartment = read(params.department);
  const department = collection ?? (Object.hasOwn(departments, requestedDepartment) ? requestedDepartment : "");
  const requestedCondition = read(params.condition);
  const condition = ["New", "Vintage"].includes(requestedCondition) ? requestedCondition : "";
  const { connected, items } = await listStoreProducts({ query, department, condition });
  const path = collection ? `/collections/${collection}` : "/shop";
  return <section className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
    {collection && <Link href="/shop" className="font-mono-display text-xs font-bold uppercase underline">Shop All</Link>}
    <h1 className="mt-2 font-serif text-5xl font-light">{collection ? departments[collection] : "Shop All"}</h1>
    {connected && <p className="mt-3 text-sm text-ink/70">Medusa catalog preview. Ordering is unavailable for these products.</p>}
    <form action={path} className="my-8 flex flex-wrap items-end gap-4 border-y-2 border-ink py-5">
      <label className="grid gap-1 font-mono-display text-xs font-bold uppercase">Search
        <input name="q" defaultValue={query} maxLength={100} className="w-full border-2 border-ink bg-white sm:w-64" type="search" />
      </label>
      {!collection && <label className="grid gap-1 font-mono-display text-xs font-bold uppercase">Department
        <select name="department" defaultValue={department} className="border-2 border-ink bg-white">
          <option value="">All departments</option>
          {Object.entries(departments).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
        </select>
      </label>}
      <label className="grid gap-1 font-mono-display text-xs font-bold uppercase">Condition
        <select name="condition" defaultValue={condition} className="border-2 border-ink bg-white">
          <option value="">Any condition</option><option>New</option><option>Vintage</option>
        </select>
      </label>
      <button className="border-2 border-ink bg-ink px-4 py-2 font-mono-display text-xs font-bold uppercase text-white hard-shadow-sm">Apply</button>
      {(query || condition || (department && !collection)) && <Link href={path} className="self-center text-sm underline">Clear filters</Link>}
    </form>
    <p className="mb-5 font-mono-display text-xs uppercase">{items.length} {items.length === 1 ? "object" : "objects"}</p>
    <ProductGrid items={items} />
  </section>;
}
