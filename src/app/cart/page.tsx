import { ContentPage } from "@/components/content-page";
import { Bag } from "@/components/store";
export const metadata = { title: "Your Bag" };
export default function CartPage() { return <ContentPage title="Your Bag"><Bag /></ContentPage>; }
