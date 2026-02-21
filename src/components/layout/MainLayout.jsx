import React from "react";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";

/**
 * MainLayout - Layout com conteúdo principal + sidebar opcional
 * Breakpoints:
 * - Mobile (< 640px): 1 coluna, sidebar oculta
 * - Tablet (640px - 1023px): 1 coluna, sidebar oculta  
 * - Desktop (>= 1024px): 2 colunas com sidebar
 */
export default function MainLayout({
  children,
  sidebar,
  sidebarPosition = "right",
  className,
  containerSize = "wide",
  gap = "default",
  showSidebarOnMobile = false,
  ...props
}) {
  const gapSizes = {
    sm: "gap-4 lg:gap-6",
    default: "gap-4 sm:gap-6 lg:gap-8",
    lg: "gap-6 lg:gap-10",
  };

  const gridCols = sidebar
    ? sidebarPosition === "right"
      ? "grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px]"
      : "grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]"
    : "grid-cols-1";

  return (
    <Container size={containerSize} className={cn("py-4 sm:py-6 lg:py-8", className)} {...props}>
      <div className={cn("grid", gridCols, gapSizes[gap])}>
        {/* Sidebar à esquerda */}
        {sidebar && sidebarPosition === "left" && (
          <aside className={cn(
            "flex flex-col gap-4 sm:gap-6",
            showSidebarOnMobile ? "flex" : "hidden lg:flex"
          )}>
            {sidebar}
          </aside>
        )}

        {/* Conteúdo principal */}
        <section className="flex flex-col gap-4 sm:gap-6 lg:gap-8 min-w-0">
          {children}
        </section>

        {/* Sidebar à direita */}
        {sidebar && sidebarPosition === "right" && (
          <aside className={cn(
            "flex flex-col gap-4 sm:gap-6",
            showSidebarOnMobile ? "flex" : "hidden lg:flex"
          )}>
            {sidebar}
          </aside>
        )}
      </div>
    </Container>
  );
}

/**
 * TwoColumnLayout - Layout com duas colunas
 * - Mobile/Tablet: 1 coluna empilhada
 * - Desktop: 2 colunas lado a lado
 */
MainLayout.TwoColumn = function TwoColumnLayout({
  left,
  right,
  className,
  containerSize = "wide",
  reverseOnMobile = false,
  ...props
}) {
  return (
    <Container size={containerSize} className={cn("py-4 sm:py-6 lg:py-8", className)} {...props}>
      <div className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8",
        reverseOnMobile && "flex flex-col-reverse lg:grid"
      )}>
        <section className="flex flex-col gap-4 sm:gap-6">{left}</section>
        <section className="flex flex-col gap-4 sm:gap-6">{right}</section>
      </div>
    </Container>
  );
};

/**
 * ThreeColumnLayout - Layout com 3 colunas
 * - Mobile: 1 coluna (sidebars ocultas)
 * - Tablet: 1 coluna (sidebars ocultas)
 * - Desktop: 3 colunas
 */
MainLayout.ThreeColumn = function ThreeColumnLayout({
  leftSidebar,
  children,
  rightSidebar,
  className,
  containerSize = "wide",
  ...props
}) {
  return (
    <Container size={containerSize} className={cn("py-4 sm:py-6 lg:py-8", className)} {...props}>
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] xl:grid-cols-[280px_1fr_280px] gap-4 sm:gap-6 lg:gap-8">
        {/* Sidebar esquerda - oculta em mobile/tablet */}
        <aside className="hidden lg:flex flex-col gap-4 sm:gap-6">
          {leftSidebar}
        </aside>

        {/* Conteúdo central */}
        <section className="flex flex-col gap-4 sm:gap-6 min-w-0">
          {children}
        </section>

        {/* Sidebar direita - oculta em mobile/tablet */}
        <aside className="hidden lg:flex flex-col gap-4 sm:gap-6">
          {rightSidebar}
        </aside>
      </div>
    </Container>
  );
};

/**
 * CenteredLayout - Layout centralizado para páginas simples
 */
MainLayout.Centered = function CenteredLayout({
  children,
  className,
  maxWidth = "narrow",
  ...props
}) {
  return (
    <Container size={maxWidth} className={cn("py-4 sm:py-6 lg:py-8", className)} {...props}>
      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
        {children}
      </div>
    </Container>
  );
};

/**
 * FullWidthLayout - Layout de largura total
 */
MainLayout.FullWidth = function FullWidthLayout({
  children,
  className,
  padded = true,
  ...props
}) {
  return (
    <div className={cn(
      "w-full py-4 sm:py-6 lg:py-8",
      padded && "px-4 sm:px-6 lg:px-8",
      className
    )} {...props}>
      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 max-w-[1920px] mx-auto">
        {children}
      </div>
    </div>
  );
};
