import React from 'react';
import { Card, Button } from '@/components/ui';
import MoveHistory from './MoveHistory';
import MaterialAdvantage from './MaterialAdvantage';
import GameTimer from './GameTimer';
import { getFlagUrl } from '@/data/botData';

export default function GameSidebar({ 
  bot,
  playerColor,
  moves,
  fen,
  whiteTime,
  blackTime,
  currentTurn,
  gameStarted,
  isGameOver,
  onResign,
  onOfferDraw,
  onNewGame
}) {
  const isPlayerWhite = playerColor === 'w';
  const playerTime = isPlayerWhite ? whiteTime : blackTime;
  const botTime = isPlayerWhite ? blackTime : whiteTime;
  const isPlayerTurn = (currentTurn === 'w' && isPlayerWhite) || (currentTurn === 'b' && !isPlayerWhite);

  const flagUrl = bot ? getFlagUrl(bot.country) : null;

  return (
    <Card 
      variant="gradient" 
      className="p-3 space-y-3 w-full lg:w-[300px] lg:max-h-[calc(100vh-96px)] flex flex-col"
    >
      {/* Info do Bot */}
      <div className="bg-surface-secondary/80 rounded-lg p-2.5 border border-surface-tertiary flex items-center gap-2.5 shrink-0">
        <div className="text-2xl">{bot?.avatar || '🤖'}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-foreground truncate">{bot?.name || 'Bot'}</span>
            {flagUrl && (
              <img 
                src={flagUrl} 
                alt={bot?.country} 
                className="w-4 h-3 object-cover rounded-sm"
              />
            )}
          </div>
          <span className="text-gold font-bold text-xs">{bot?.rating || 1200}</span>
        </div>
        <GameTimer 
          time={botTime} 
          isActive={!isPlayerTurn && gameStarted && !isGameOver}
          variant="compact"
        />
      </div>

      {/* Material */}
      <div className="px-1 shrink-0">
        <MaterialAdvantage fen={fen} playerColor={playerColor} />
      </div>

      {/* Histórico de Lances */}
      <div className="flex-1 bg-surface-secondary/50 rounded-lg border border-surface-tertiary overflow-hidden min-h-0">
        <div className="bg-surface-tertiary/50 px-3 py-1.5 border-b border-surface-tertiary">
          <span className="text-xs font-semibold text-muted-foreground">Lances</span>
        </div>
        <div className="h-[calc(100%-32px)] overflow-y-auto">
          <MoveHistory moves={moves} />
        </div>
      </div>

      {/* Info do Jogador */}
      <div className="bg-surface-secondary/80 rounded-lg p-2.5 border border-gold/30 flex items-center gap-2.5 shrink-0">
        <div className="text-2xl">👤</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-foreground">Você</div>
          <span className="text-gold font-bold text-xs">Guest</span>
        </div>
        <GameTimer 
          time={playerTime} 
          isActive={isPlayerTurn && gameStarted && !isGameOver}
          variant="compact"
        />
      </div>

      {/* Ações */}
      {gameStarted && !isGameOver && (
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="flex-1" onClick={onOfferDraw}>
            🤝 Empate
          </Button>
          <Button variant="destructive" size="sm" className="flex-1" onClick={onResign}>
            🏳️ Desistir
          </Button>
        </div>
      )}

      {isGameOver && (
        <Button variant="primary" size="lg" className="w-full shrink-0" onClick={onNewGame}>
          🎮 Novo Jogo
        </Button>
      )}
    </Card>
  );
}
