"use client";
import { ContentPage } from "@/components/content-page";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <ContentPage title="Something went wrong"><button type="button" onClick={reset} className="underline">Try again</button></ContentPage>;
}
