"use client";

import { useState } from "react";

import type { OperatorImageSlot } from "@/lib/operator-images";

type OperatorPhotoProps = {
  slot: OperatorImageSlot;
  className?: string;
  caption?: string;
};

export function OperatorPhoto({ slot, className = "", caption }: OperatorPhotoProps) {
  const [src, setSrc] = useState<string>(slot.preferredPath);
  const [usedFallback, setUsedFallback] = useState(false);

  return (
    <figure className={className}>
      <img
        src={src}
        alt={slot.alt}
        className="h-full w-full object-cover"
        onError={() => {
          if (!usedFallback) {
            setUsedFallback(true);
            setSrc(slot.src);
          }
        }}
      />
      {caption ? (
        <figcaption className="mt-2 text-sm leading-6 text-gray-600">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
