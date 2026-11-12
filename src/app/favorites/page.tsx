import { ContentPage } from "@/components/content-page";
import { Favorites } from "@/components/store";
export const metadata = { title: "Favorites" };
export default function FavoritesPage() { return <ContentPage title="Favorites"><Favorites /></ContentPage>; }
