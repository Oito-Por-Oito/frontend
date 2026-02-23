import React, { useState } from 'react';
import { FaChess, FaTimes, FaClock, FaRandom, FaChessKing, FaChessKnight } from 'react-icons/fa';
import { TIME_CONTROL_OPTIONS } from '@/hooks/useChallenge';

const COLOR_OPTIONS = [
  { value: 'white', label: 'Brancas', icon: '♔', desc: 'Você joga com as peças brancas' },
  { value: 'black', label: 'Pretas', icon: '♚', desc: 'Você joga com as peças pretas' },
  { value: 'random', label: 'Aleatório', icon: '🎲', desc: 'Cor sorteada aleatoriamente' },
];

export default function ChallengeModal({ friend, onClose, onSend, loading }) {
  const [selectedTime, setSelectedTime] = useState(TIME_CONTROL_OPTIONS[6]); // Rápido 10+0
  const [colorPreference, setColorPreference] = useState('random');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    onSend({
      timeControl: selectedTime.timeControl,
      initialTime: selectedTime.initialTime,
      increment: selectedTime.increment,
      colorPreference,
      message: message.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-surface-primary border border-gold/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-surface-secondary to-surface-tertiary px-6 py-4 flex items-center justify-between border-b border-gold/20">
          <div className="flex items-center gap-3">
            <div className="bg-gold/20 p-2 rounded-full">
              <FaChess className="text-gold-light w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gold-light">Desafiar Amigo</h2>
              <p className="text-sm text-muted-foreground">
                {friend?.display_name || friend?.username || 'Amigo'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-surface-tertiary"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Time Control */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
              <FaClock className="text-gold-light" />
              Controle de Tempo
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
              {TIME_CONTROL_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedTime(opt)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    selectedTime.label === opt.label
                      ? 'bg-gold/20 border-gold text-gold-light shadow-md'
                      : 'bg-surface-secondary border-gold/20 text-foreground hover:border-gold/50 hover:bg-surface-tertiary'
                  }`}
                >
                  <span className="text-base">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Preference */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
              <FaChessKing className="text-gold-light" />
              Cor das Peças
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setColorPreference(opt.value)}
                  className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg border text-sm font-medium transition-all ${
                    colorPreference === opt.value
                      ? 'bg-gold/20 border-gold text-gold-light shadow-md'
                      : 'bg-surface-secondary border-gold/20 text-foreground hover:border-gold/50 hover:bg-surface-tertiary'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-xs">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Message */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Mensagem (opcional)
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: Vamos jogar uma partida rápida!"
              maxLength={100}
              className="w-full bg-surface-secondary border border-gold/20 rounded-lg px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
            />
          </div>

          {/* Summary */}
          <div className="bg-surface-secondary/60 border border-gold/10 rounded-xl px-4 py-3 text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Resumo: </span>
            {selectedTime.icon} {selectedTime.label} · Peças: {COLOR_OPTIONS.find(c => c.value === colorPreference)?.label}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gold/20 text-muted-foreground hover:text-foreground hover:border-gold/40 transition-colors font-medium text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-surface-primary font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <>
                <FaChess className="w-4 h-4" />
                Enviar Desafio
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
