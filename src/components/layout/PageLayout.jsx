import React from "react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * PageLayout - Wrapper padrão para todas as páginas
 * Encapsula Navbar + main + Footer com o background padrão
 */
export default function PageLayout({
  children,
  className,
  showNavbar = true,
  showFooter = true,
  ...props
}) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        "bg-gradient-to-br from-surface-secondary via-surface-primary to-surface-secondary",
        "text-foreground"
      )}
      {...props}
    >
      {showNavbar && <Navbar />}
      
      <main className={cn("flex-1", className)}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}
