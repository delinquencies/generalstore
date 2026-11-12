import Link from "next/link";
import { ContentPage } from "@/components/content-page";
export const metadata = { title: "Checkout Preview" };
export default function CheckoutPage() {
  return <ContentPage title="Checkout Preview">
    <p>This preview uses sample inventory. Payments and orders are unavailable.</p>
    <Link href="/cart" className="font-mono-display text-sm font-bold uppercase underline">Back to your bag</Link>
  </ContentPage>;
}
