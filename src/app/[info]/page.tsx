import { notFound } from "next/navigation";
import { ContentPage } from "@/components/content-page";

const infoPages = {
  contact: ["Contact", "Contact details will be published when the store opens."],
  shipping: ["Shipping", "Shipping destinations, rates, and dispatch times are pending owner approval."],
  returns: ["Returns & Exchanges", "The return window, condition requirements, and exchange process are pending owner approval."],
  privacy: ["Privacy Policy", "This preview stores bag and favorites data in your browser. Preview forms discard submitted details. The production privacy policy is pending approval."],
  terms: ["Terms of Sale", "The storefront preview uses sample products and accepts no orders. Production terms are pending approval."],
  accessibility: ["Accessibility", "The storefront is in development. Accessibility testing and contact information are pending."],
} as const;
type Params = Promise<{ info: string }>;
async function getPage(params: Params) {
  const { info } = await params;
  if (!Object.hasOwn(infoPages, info)) notFound();
  return infoPages[info as keyof typeof infoPages];
}
export function generateStaticParams() { return Object.keys(infoPages).map((info) => ({ info })); }
export async function generateMetadata({ params }: { params: Params }) { return { title: (await getPage(params))[0] }; }
export default async function InfoPage({ params }: { params: Params }) {
  const [title, copy] = await getPage(params);
  return <ContentPage title={title}><p>{copy}</p></ContentPage>;
}
