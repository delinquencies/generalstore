import Link from "next/link";
import { notFound } from "next/navigation";
import { AddButton } from "@/components/store";
import { Photo } from "@/components/photo";
import { departments, isMedusaProduct, money } from "@/lib/catalog";
import { getStoreProduct } from "@/lib/store-catalog";
import { photos } from "@/lib/photos";
type Params = Promise<{ handle: string }>;
async function productFrom(params: Params) {
  const product = await getStoreProduct((await params).handle);
  if (!product) notFound();
  return product;
}
export async function generateMetadata({ params }: { params: Params }) {
  const product = await productFrom(params);
  return { title: product.title, description: product.description };
}
export default async function ProductPage({ params }: { params: Params }) {
  const item = await productFrom(params);
  const medusa = isMedusaProduct(item);
  const photo = medusa ? item.photo : photos[item.slug];
  return <article className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-2 lg:gap-12">
    <div className="aspect-[4/5] overflow-hidden border-2 border-ink bg-white hard-shadow">
      {photo ? <Photo key={item.slug} photo={photo} className="h-full w-full object-cover" eager /> : <span className="grid h-full place-items-center text-sm text-ink/70">Photo unavailable</span>}
    </div>
    <div className="space-y-6">
      <Link href={item.department ? `/collections/${item.department}` : "/shop"} className="font-mono-display text-xs font-bold uppercase underline">{item.department ? departments[item.department] : "Shop All"}</Link>
      <h1 className="font-serif text-5xl font-light">{item.title}</h1>
      <p className="font-mono-display text-xl font-bold">{item.priceCents === null ? "Price unavailable" : `${medusa && item.priceFrom ? "From " : ""}${money(item.priceCents)}`}</p>
      <p>{item.description}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-y-2 border-ink py-4 font-mono-display text-sm">
        {item.condition && <><dt>Condition</dt><dd>{item.condition}</dd></>}
        {item.sku && <><dt>SKU</dt><dd>{item.sku}</dd></>}
        <dt>Availability</dt><dd>{item.stock === null ? "Unconfirmed" : item.stock === 0 ? "Sold out" : item.stock === 1 ? "One available" : "In stock"}</dd>
      </dl>
      {medusa ? <p className="text-sm text-ink/70">Medusa catalog preview. Ordering is unavailable for this product.</p> :
        <AddButton slug={item.slug} className="border-2 border-ink bg-ink px-6 py-3 font-mono-display text-sm font-bold uppercase text-white hard-shadow-sm hover:bg-tangerine">Add to bag</AddButton>}
    </div>
  </article>;
}
