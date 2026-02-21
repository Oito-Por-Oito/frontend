import React from "react";
import { cn } from "@/lib/utils";

const cardVariants = {
  default: "bg-surface-card border border-gold/20",
  gradient: "bg-gradient-to-br from-surface-secondary via-surface-tertiary to-surface-secondary border border-gold/20",
  elevated: "bg-surface-card border border-gold/20 shadow-xl",
  bordered: "bg-surface-card/90 border-2 border-gold/30",
  ghost: "bg-transparent",
};

export default function Card({
  children,
  variant = "default",
  className,
  padding = true,
  ...props
}) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        cardVariants[variant],
        padding && "p-5 md:p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Sub-componentes
Card.Header = function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ children, className, as: Tag = "h3", ...props }) {
  return (
    <Tag
      className={cn("text-xl md:text-2xl font-bold text-gold", className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

Card.Description = function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
};

Card.Content = function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-gold/10", className)} {...props}>
      {children}
    </div>
  );
};

// Exportar variantes
Card.variants = cardVariants;
