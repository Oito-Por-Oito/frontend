import React from "react";
import { Card } from "@/components/ui";

/**
 * EventCard - Card de evento
 */
export default function EventCard({ img, titulo, data }) {
  return (
    <div className="flex items-center bg-surface-tertiary rounded-lg p-3 gap-4 hover:bg-surface-secondary cursor-pointer transition-colors">
      <img 
        src={img} 
        alt={titulo} 
        className="w-16 h-16 object-contain rounded border border-gold/20" 
      />
      <div>
        <h3 className="font-semibold text-foreground">{titulo}</h3>
        <p className="text-sm text-muted-foreground">{data}</p>
      </div>
    </div>
  );
}
