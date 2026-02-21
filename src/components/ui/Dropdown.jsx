import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

const DropdownContext = createContext({});

const alignmentStyles = {
  left: "left-0",
  right: "right-0",
  center: "left-1/2 -translate-x-1/2",
};

const sideStyles = {
  bottom: "top-full mt-2",
  top: "bottom-full mb-2",
};

/**
 * Dropdown - Componente de menu dropdown reutilizável
 * @param {string} align - Alinhamento do menu: left, right, center
 * @param {string} side - Posição do menu: bottom, top
 * @param {boolean} closeOnSelect - Fechar ao selecionar item (default: true)
 */
export default function Dropdown({
  children,
  align = "left",
  side = "bottom",
  closeOnSelect = true,
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, close, toggle, closeOnSelect, align, side }}>
      <div ref={containerRef} className={cn("relative inline-block", className)} {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// Trigger que abre o dropdown
Dropdown.Trigger = function DropdownTrigger({ children, className, asChild, ...props }) {
  const { toggle, isOpen } = useContext(DropdownContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e);
        toggle();
      },
      "aria-expanded": isOpen,
      "aria-haspopup": true,
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={isOpen}
      aria-haspopup="true"
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg",
        "bg-surface-tertiary text-foreground border border-gold/20",
        "hover:bg-surface-secondary hover:border-gold/30 transition-colors",
        className
      )}
      {...props}
    >
      {children}
      <svg
        className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

// Menu que contém os itens
Dropdown.Menu = function DropdownMenu({ children, className, ...props }) {
  const { isOpen, align, side } = useContext(DropdownContext);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute z-50 min-w-[180px] py-2 rounded-xl",
        "bg-surface-secondary border border-gold/20 shadow-xl",
        "animate-fade-in",
        alignmentStyles[align],
        sideStyles[side],
        className
      )}
      role="menu"
      {...props}
    >
      {children}
    </div>
  );
};

// Item individual do dropdown
Dropdown.Item = function DropdownItem({ children, onClick, disabled, className, ...props }) {
  const { close, closeOnSelect } = useContext(DropdownContext);

  const handleClick = (e) => {
    if (disabled) return;
    onClick?.(e);
    if (closeOnSelect) close();
  };

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2 text-left text-sm",
        "text-foreground hover:bg-gold/10 hover:text-gold-light transition-colors",
        disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Separador entre itens
Dropdown.Divider = function DropdownDivider({ className, ...props }) {
  return (
    <div
      className={cn("my-2 h-px bg-gold/10", className)}
      role="separator"
      {...props}
    />
  );
};

// Label para agrupar itens
Dropdown.Label = function DropdownLabel({ children, className, ...props }) {
  return (
    <div
      className={cn("px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider", className)}
      {...props}
    >
      {children}
    </div>
  );
};
