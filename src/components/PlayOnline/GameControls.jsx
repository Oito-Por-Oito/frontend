import React, { useState } from 'react';
import { Flag, Hand, X } from 'lucide-react';

export default function GameControls({ 
  onResign, 
  onOfferDraw, 
  onAcceptDraw,
  onDeclineDraw,
  onCancelDraw,
  drawOffer,
  isGameOver 
}) {
  const [confirmResign, setConfirmResign] = useState(false);

  if (isGameOver) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Oferta de empate recebida */}
      {drawOffer === 'received' && (
        <div className="bg-[#2a2a2a] p-4 rounded-xl border border-[#c29d5d]">
          <p className="text-white text-center mb-3">Seu oponente ofereceu empate</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={onAcceptDraw}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Aceitar
            </button>
            <button
              onClick={onDeclineDraw}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Recusar
            </button>
          </div>
        </div>
      )}

      {/* Oferta de empate enviada */}
      {drawOffer === 'pending' && (
        <div className="bg-[#2a2a2a] p-4 rounded-xl border border-[#c29d5d]/50">
          <p className="text-gray-300 text-center mb-2">Aguardando resposta do empate...</p>
          <button
            onClick={onCancelDraw}
            className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <X size={16} />
            Cancelar oferta
          </button>
        </div>
      )}

      {/* Botões de controle */}
      <div className="flex gap-2 justify-center">
        {/* Botão de empate */}
        <button
          onClick={onOfferDraw}
          disabled={drawOffer !== null}
          className="flex items-center gap-2 px-4 py-2 bg-[#333] hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Hand size={18} />
          <span className="hidden sm:inline">Empate</span>
        </button>

        {/* Botão de desistir */}
        {!confirmResign ? (
          <button
            onClick={() => setConfirmResign(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#333] hover:bg-red-900/50 text-white rounded-lg transition-colors"
          >
            <Flag size={18} />
            <span className="hidden sm:inline">Desistir</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-sm">Confirmar?</span>
            <button
              onClick={onResign}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
            >
              Sim
            </button>
            <button
              onClick={() => setConfirmResign(false)}
              className="px-3 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg transition-colors text-sm"
            >
              Não
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
