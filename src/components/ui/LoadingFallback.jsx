import React from 'react';

export default function LoadingFallback() {
  return (
    <div className="min-h-screen bg-surface-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent" />
        <span className="text-gold font-medium text-sm">Carregando...</span>
      </div>
    </div>
  );
}
