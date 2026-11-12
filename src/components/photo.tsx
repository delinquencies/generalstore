"use client";

import { useState } from "react";

export function Photo({ photo, className, eager = false }: {
  photo: { src: string; alt: string }; className?: string; eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div role="img" aria-label={photo.alt} className={className + " grid place-items-center bg-cream-muted p-3 text-center font-serif text-ink/70"}>{photo.alt}</div>;
  return <img src={photo.src} alt={photo.alt} className={className} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} onError={() => setFailed(true)} />;
}
