// Features: Game Components
// Componentes relacionados a partidas de xadrez

export { default as ChessBoardStatic } from './ChessBoardStatic';
export { default as PlayerInfo } from './PlayerInfo';
export { default as PlayModeMenu } from './PlayModeMenu';
export { default as GameStatusLog } from './GameStatusLog';
export { default as BotSelector } from './BotSelector';

// Re-export componentes existentes que ainda não foram migrados
// Estes serão atualizados gradualmente
export { default as ChessBoardInteractive } from '@/components/PlayComputer/ChessBoard';
