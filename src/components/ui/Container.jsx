import React from "react";
import { cn } from "@/lib/utils";

/**
 * Container - Wrapper responsivo para conteúdo centralizado
 * 
 * Breakpoints usados:
 * - Mobile: < 640px (sm)
 * - Tablet: 640px - 1023px
 * - Desktop: >= 1024px (lg)
 */

const containerSizes = {
  narrow: "max-w-3xl", // 768px
  default: "max-w-5xl", // 1024px
  wide: "max-w-7xl", // 1280px
  full: "max-w-[1600px]", // 1600px
  screen: "max-w-[1920px]", // 1920px
};

export default function Container({
  children,
  size = "wide",
  className,
  as: Tag = "div",
  noPadding = false,
  ...props
}) {
  return (
    <Tag
      className={cn(
        "w-full mx-auto",
        containerSizes[size],
        !noPadding && "px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

Container.sizes = containerSizes;
