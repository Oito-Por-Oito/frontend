import React from "react";
import { cn } from "@/lib/utils";

const avatarSizes = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
  "2xl": "w-20 h-20 text-2xl",
};

export default function Avatar({
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  className,
  online,
  ...props
}) {
  const [hasError, setHasError] = React.useState(false);

  const initials = fallback || alt
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className={cn(
            "rounded-full object-cover border-2 border-gold/30",
            avatarSizes[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-full flex items-center justify-center",
            "bg-surface-tertiary border-2 border-gold/30",
            "font-semibold text-gold",
            avatarSizes[size]
          )}
        >
          {initials}
        </div>
      )}
      
      {/* Indicador online */}
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-surface-primary",
            online ? "bg-green-500" : "bg-gray-500",
            size === "xs" || size === "sm" ? "w-2 h-2" : "w-3 h-3"
          )}
        />
      )}
    </div>
  );
}

Avatar.sizes = avatarSizes;
