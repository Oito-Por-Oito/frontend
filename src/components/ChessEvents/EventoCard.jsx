import React from "react";
import { Card } from '../ui';

export default function EventoCard({ img, titulo, data }) {
  return (
    <Card 
      variant="bordered" 
      className="flex items-center p-3 gap-4 hover:bg-surface-tertiary cursor-pointer transition-colors"
    >
      <img src={img} alt={titulo} className="w-16 h-16 object-contain rounded" />
      <div>
        <h3 className="font-semibold">{titulo}</h3>
        <p className="text-sm text-text-muted">{data}</p>
      </div>
    </Card>
  );
}
