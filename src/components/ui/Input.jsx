import React from "react";
import { cn } from "@/lib/utils";

export default function Input({
  className,
  type = "text",
  icon,
  iconPosition = "left",
  error,
  ...props
}) {
  const hasIcon = !!icon;

  return (
    <div className="relative w-full">
      {hasIcon && iconPosition === "left" && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border bg-surface-tertiary px-3 py-2",
          "text-sm text-foreground placeholder:text-muted-foreground",
          "border-gold/20 focus:border-gold/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors",
          hasIcon && iconPosition === "left" && "pl-10",
          hasIcon && iconPosition === "right" && "pr-10",
          error && "border-destructive focus:border-destructive",
          className
        )}
        {...props}
      />
      {hasIcon && iconPosition === "right" && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

// Textarea variante
Input.Textarea = function Textarea({ className, error, ...props }) {
  return (
    <div className="w-full">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border bg-surface-tertiary px-3 py-2",
          "text-sm text-foreground placeholder:text-muted-foreground",
          "border-gold/20 focus:border-gold/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-none transition-colors",
          error && "border-destructive focus:border-destructive",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};
