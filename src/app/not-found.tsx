import Link from "next/link";
import { ContentPage } from "@/components/content-page";
export default function NotFoundPage() {
  return <ContentPage title="We couldn’t find that page"><Link href="/shop" className="underline">Browse the shop</Link></ContentPage>;
}
