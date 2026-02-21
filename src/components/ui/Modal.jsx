import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const modalVariants = {
  default: "max-w-lg",
  sm: "max-w-sm",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  fullscreen: "max-w-none w-full h-full m-0 rounded-none",
};

/**
 * Modal - Componente de modal reutilizável
 * @param {boolean} open - Controla se o modal está aberto
 * @param {function} onClose - Callback para fechar o modal
 * @param {string} variant - Variante de tamanho: default, sm, lg, xl, fullscreen
 * @param {boolean} closeOnOverlay - Fechar ao clicar no overlay (default: true)
 * @param {boolean} closeOnEsc - Fechar ao pressionar ESC (default: true)
 */
export default function Modal({
  children,
  open = false,
  onClose,
  variant = "default",
  closeOnOverlay = true,
  closeOnEsc = true,
  className,
  ...props
}) {
  const handleEsc = useCallback(
    (e) => {
      if (closeOnEsc && e.key === "Escape") {
        onClose?.();
      }
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, handleEsc]);

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div
        className={cn(
          "relative w-full rounded-2xl bg-surface-secondary border border-gold/20 shadow-2xl animate-slide-up",
          modalVariants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

// Sub-componentes
Modal.Header = function ModalHeader({ children, className, onClose, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4 border-b border-gold/10",
        className
      )}
      {...props}
    >
      <div className="text-xl font-bold text-gold-light">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-tertiary transition-colors"
          aria-label="Fechar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

Modal.Body = function ModalBody({ children, className, ...props }) {
  return (
    <div
      className={cn("px-6 py-4 max-h-[60vh] overflow-y-auto text-foreground", className)}
      {...props}
    >
      {children}
    </div>
  );
};

Modal.Footer = function ModalFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 px-6 py-4 border-t border-gold/10 bg-surface-card/50 rounded-b-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Exportar variantes
Modal.variants = modalVariants;
