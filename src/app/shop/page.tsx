import type { Metadata } from "next";
import { CatalogPage, type SearchParams } from "@/components/catalog-page";
export const metadata: Metadata = { title: "Shop All", description: "Browse objects, everyday essentials, and vintage finds." };
export default function ShopPage({ searchParams }: { searchParams: SearchParams }) { return <CatalogPage searchParams={searchParams} />; }
