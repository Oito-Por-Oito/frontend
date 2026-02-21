import React, { useState, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

const TabsContext = createContext({});

const tabsVariants = {
  default: {
    list: "border-b border-gold/20",
    tab: "border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:text-gold",
  },
  pills: {
    list: "gap-2",
    tab: "rounded-xl data-[state=active]:bg-gold data-[state=active]:text-surface-primary",
  },
  bordered: {
    list: "border border-gold/20 rounded-xl p-1 bg-surface-card/50",
    tab: "rounded-lg data-[state=active]:bg-surface-tertiary data-[state=active]:text-gold",
  },
};

/**
 * Tabs - Sistema de tabs reutilizável
 * @param {string} value - Tab ativa (controlado)
 * @param {string} defaultValue - Tab inicial (não controlado)
 * @param {function} onValueChange - Callback quando muda a tab
 * @param {string} variant - Variante visual: default, pills, bordered
 * @param {string} orientation - horizontal ou vertical
 */
export default function Tabs({
  children,
  value,
  defaultValue,
  onValueChange,
  variant = "default",
  orientation = "horizontal",
  className,
  ...props
}) {
  const [activeTab, setActiveTab] = useState(value ?? defaultValue ?? "");

  const currentValue = value ?? activeTab;

  const handleChange = (newValue) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onChange: handleChange, variant, orientation }}>
      <div
        className={cn(
          "w-full",
          orientation === "vertical" && "flex gap-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// Lista de tabs
Tabs.List = function TabsList({ children, className, ...props }) {
  const { variant, orientation } = useContext(TabsContext);
  const variantStyles = tabsVariants[variant] || tabsVariants.default;

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        "flex",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        variantStyles.list,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Tab individual
Tabs.Tab = function TabsTab({ children, value: tabValue, disabled, className, ...props }) {
  const { value: activeValue, onChange, variant } = useContext(TabsContext);
  const isActive = activeValue === tabValue;
  const variantStyles = tabsVariants[variant] || tabsVariants.default;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      disabled={disabled}
      onClick={() => !disabled && onChange(tabValue)}
      className={cn(
        "px-4 py-2 font-medium text-sm transition-all",
        "text-muted-foreground hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        disabled && "opacity-50 cursor-not-allowed",
        variantStyles.tab,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Painel de conteúdo
Tabs.Panel = function TabsPanel({ children, value: panelValue, className, ...props }) {
  const { value: activeValue } = useContext(TabsContext);

  if (activeValue !== panelValue) return null;

  return (
    <div
      role="tabpanel"
      data-state="active"
      className={cn("mt-4 focus-visible:outline-none", className)}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
};

// Exportar variantes
Tabs.variants = tabsVariants;
