import React from 'react';
import { motion } from 'framer-motion';
import { FiVolume2, FiVolumeX, FiMusic } from 'react-icons/fi';
import { useSettings } from '@/contexts/SettingsContext';

/**
 * Toggle switch customizado
 */
function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
        border-2 border-transparent transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-surface-primary
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${checked ? 'bg-gold' : 'bg-surface-secondary'}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full
          bg-white shadow ring-0 transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
}

/**
 * Slider de volume
 */
function VolumeSlider({ value, onChange, disabled = false }) {
  const percentage = Math.round(value * 100);
  
  return (
    <div className="flex items-center gap-3 flex-1">
      <FiVolumeX className="text-muted-foreground w-4 h-4" />
      <div className="relative flex-1">
        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onChange={(e) => onChange(parseInt(e.target.value) / 100)}
          disabled={disabled}
          className={`
            w-full h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-gold
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-md
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-gold
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-0
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            background: `linear-gradient(to right, hsl(var(--gold)) ${percentage}%, hsl(var(--surface-secondary)) ${percentage}%)`,
          }}
        />
      </div>
      <FiVolume2 className="text-muted-foreground w-4 h-4" />
      <span className="text-sm text-muted-foreground w-10 text-right">{percentage}%</span>
    </div>
  );
}

/**
 * Item de configuração de som individual
 */
function SoundItem({ label, description, checked, onChange, disabled = false }) {
  return (
    <div className={`flex items-center justify-between py-3 ${disabled ? 'opacity-50' : ''}`}>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/**
 * Componente principal de configurações de som
 */
export default function SoundSettings({ compact = false }) {
  const { soundSettings, setSoundEnabled, setSoundVolume, setSoundType } = useSettings();
  const { enabled, volume, sounds } = soundSettings;

  const soundTypes = [
    { key: 'move', label: 'Som de movimento', description: 'Ao mover uma peça' },
    { key: 'capture', label: 'Som de captura', description: 'Ao capturar uma peça adversária' },
    { key: 'check', label: 'Som de xeque', description: 'Ao dar xeque no rei' },
    { key: 'matchFound', label: 'Match encontrado', description: 'Ao encontrar um oponente online' },
    { key: 'gameEnd', label: 'Fim de jogo', description: 'Ao terminar uma partida' },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-4">
        <Toggle checked={enabled} onChange={setSoundEnabled} />
        <span className="text-sm text-foreground">
          {enabled ? 'Sons ativados' : 'Sons desativados'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <FiMusic className="text-gold" />
        Sons do Jogo
      </h3>

      {/* Toggle principal */}
      <motion.div 
        className="bg-surface-primary border border-surface-secondary rounded-xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {enabled ? (
              <FiVolume2 className="text-gold w-5 h-5" />
            ) : (
              <FiVolumeX className="text-muted-foreground w-5 h-5" />
            )}
            <div>
              <p className="font-medium text-foreground">Sons habilitados</p>
              <p className="text-xs text-muted-foreground">
                Ativar ou desativar todos os sons
              </p>
            </div>
          </div>
          <Toggle checked={enabled} onChange={setSoundEnabled} />
        </div>

        {/* Slider de volume */}
        <div className={`transition-opacity ${enabled ? 'opacity-100' : 'opacity-50'}`}>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Volume
          </label>
          <VolumeSlider value={volume} onChange={setSoundVolume} disabled={!enabled} />
        </div>
      </motion.div>

      {/* Configurações individuais */}
      <motion.div 
        className="bg-surface-primary border border-surface-secondary rounded-xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h4 className="text-sm font-semibold text-foreground mb-2">
          Configurações individuais
        </h4>
        
        <div className="divide-y divide-surface-secondary">
          {soundTypes.map(({ key, label, description }) => (
            <SoundItem
              key={key}
              label={label}
              description={description}
              checked={sounds[key]}
              onChange={(value) => setSoundType(key, value)}
              disabled={!enabled}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
