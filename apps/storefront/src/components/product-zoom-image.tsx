"use client";

import Image from "next/image";
import { useState, type CSSProperties, type MouseEvent } from "react";

type PointerState = {
  xPercent: number;
  yPercent: number;
};

type ProductZoomImageProps = {
  alt: string;
  className: string;
  height: number;
  priority?: boolean;
  sizes?: string;
  src: string;
  width: number;
};

const DEFAULT_POINTER: PointerState = {
  xPercent: 50,
  yPercent: 50,
};

const ZOOM_SCALE = 2.2;

export function ProductZoomImage({
  alt,
  className,
  height,
  priority = false,
  sizes,
  src,
  width,
}: ProductZoomImageProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [pointer, setPointer] = useState<PointerState>(DEFAULT_POINTER);

  const updatePointer = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const xPercent = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
    const yPercent = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));

    setPointer({ xPercent, yPercent });
  };

  const zoomStyle = {
    transformOrigin: `${pointer.xPercent}% ${pointer.yPercent}%`,
    transform: isHovering ? `scale(${ZOOM_SCALE})` : "scale(1)",
  } satisfies CSSProperties;

  return (
    <div
      className="product-zoom-image"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setPointer(DEFAULT_POINTER);
      }}
      onMouseMove={updatePointer}
      aria-label={alt}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        unoptimized
        className={className}
        style={zoomStyle}
      />
    </div>
  );
}
