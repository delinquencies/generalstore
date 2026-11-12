import type { ReactNode } from "react";
export function ContentPage({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mx-auto w-full max-w-5xl space-y-6 px-6 py-12 lg:py-16"><h1 className="font-serif text-5xl font-light">{title}</h1>{children}</section>;
}
