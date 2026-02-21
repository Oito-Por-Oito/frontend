import React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  // Títulos de xadrez
  gm: "bg-badge-gm text-white",
  im: "bg-badge-im text-white", 
  fm: "bg-badge-fm text-surface-primary",
  nm: "bg-badge-nm text-white",
  cm: "bg-badge-cm text-white",
  
  // Variantes genéricas
  default: "bg-surface-tertiary text-foreground border border-gold/20",
  primary: "bg-gold text-surface-primary",
  secondary: "bg-surface-secondary text-foreground border border-gold/20",
  outline: "border border-gold/40 text-gold bg-transparent",
  success: "bg-green-600 text-white",
  warning: "bg-amber-500 text-surface-primary",
  destructive: "bg-destructive text-destructive-foreground",
};

const badgeSizes = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2 py-0.5 text-sm",
  lg: "px-3 py-1 text-base",
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded uppercase",
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

Badge.variants = badgeVariants;
Badge.sizes = badgeSizes;
