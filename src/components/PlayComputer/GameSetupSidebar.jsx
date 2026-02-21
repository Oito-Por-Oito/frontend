import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '@/components/ui';
import BotCatalog from './BotCatalog';
import TimeControlSelector from './TimeControlSelector';
import ColorSelector from './ColorSelector';
import { BOTS, TIME_CONTROLS, getFlagUrl } from '@/data/botData';

export default function GameSetupSidebar({ 
  onStartGame,
  disabled = false
}) {
  const [selectedBot, setSelectedBot] = useState(BOTS[1]);
  const [selectedTimeControl, setSelectedTimeControl] = useState(TIME_CONTROLS[5]);
  const [selectedColor, setSelectedColor] = useState('w');
  const [activeTab, setActiveTab] = useState('config'); // 'config' | 'bots'

  const handleStartGame = () => {
    const finalColor = selectedColor === 'random' 
      ? Math.random() > 0.5 ? 'w' : 'b' 
      : selectedColor;

    onStartGame({
      bot: selectedBot,
      timeControl: selectedTimeControl,
      playerColor: finalColor
    });
  };

  const flagUrl = getFlagUrl(selectedBot.country);

  return (
    <Card 
      variant="gradient" 
      className="p-3 w-full lg:w-[300px] lg:max-h-[calc(100vh-96px)] flex flex-col"
    >
      {/* Bot selecionado - compacto */}
      <div className="bg-surface-secondary/80 rounded-lg p-3 border border-gold/30 mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{selectedBot.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gold-light truncate">{selectedBot.name}</span>
              {flagUrl && (
                <img 
                  src={flagUrl} 
                  alt={selectedBot.country} 
                  className="w-5 h-3.5 object-cover rounded-sm border border-surface-tertiary"
                />
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="text-gold font-bold">{selectedBot.rating}</span>
              <span> • {selectedBot.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Config / Bots */}
      <div className="flex gap-1 mb-3 bg-surface-secondary/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('config')}
          className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all ${
            activeTab === 'config' 
              ? 'bg-gold text-background' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          ⚙️ Config
        </button>
        <button
          onClick={() => setActiveTab('bots')}
          className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all ${
            activeTab === 'bots' 
              ? 'bg-gold text-background' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          🤖 Bots
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent min-h-0">
        {activeTab === 'config' ? (
          <div className="space-y-3">
            {/* Cor */}
            <div>
              <label className="text-gold-light font-semibold text-xs mb-1.5 block">Jogar com</label>
              <ColorSelector 
                selectedColor={selectedColor} 
                onSelectColor={setSelectedColor} 
              />
            </div>

            {/* Tempo */}
            <div>
              <label className="text-gold-light font-semibold text-xs mb-1.5 block">Controle de Tempo</label>
              <TimeControlSelector
                selectedTimeControl={selectedTimeControl}
                onSelectTimeControl={setSelectedTimeControl}
              />
            </div>
          </div>
        ) : (
          <BotCatalog
            selectedBot={selectedBot}
            onSelectBot={(bot) => {
              setSelectedBot(bot);
              setActiveTab('config');
            }}
          />
        )}
      </div>

      {/* Botão Play */}
      <Button
        variant="primary"
        size="lg"
        className="w-full text-base mt-3 shrink-0"
        onClick={handleStartGame}
        disabled={disabled}
      >
        ▶ Jogar contra {selectedBot.name}
      </Button>
    </Card>
  );
}
