import React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  variant: {
    primary: "bg-gold text-surface-primary hover:bg-gold-light font-semibold",
    secondary: "bg-surface-tertiary text-white hover:bg-surface-secondary border border-gold/30",
    outline: "border border-gold/40 text-gold hover:bg-gold/10 hover:text-gold-light",
    ghost: "text-gold hover:bg-gold/10 hover:text-gold-light",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  size: {
    sm: "h-8 px-3 text-sm rounded-md",
    md: "h-10 px-4 text-base rounded-lg",
    lg: "h-12 px-6 text-lg rounded-xl",
    icon: "h-10 w-10 rounded-lg",
  },
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        "disabled:pointer-events-none disabled:opacity-50",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// Exportar variantes para uso externo
Button.variants = buttonVariants;
