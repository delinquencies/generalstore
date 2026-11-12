import { notFound } from "next/navigation";
import { CatalogPage, type SearchParams } from "@/components/catalog-page";
import { departments } from "@/lib/catalog";
type Params = Promise<{ handle: string }>;
function getDepartment(handle: string) {
  if (!Object.hasOwn(departments, handle)) notFound();
  return handle as keyof typeof departments;
}
export async function generateMetadata({ params }: { params: Params }) {
  const key = getDepartment((await params).handle);
  return { title: departments[key], description: `Explore ${departments[key]} at The General Edit.` };
}
export default async function CollectionPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  return <CatalogPage collection={getDepartment((await params).handle)} searchParams={searchParams} />;
}
