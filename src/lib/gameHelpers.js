// Cálculo de Rating ELO
export function calculateNewRating(playerRating, opponentRating, result) {
  const K = 32; // Fator K para jogadores abaixo de 2100
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  return Math.round(playerRating + K * (result - expectedScore));
}

// Controles de tempo disponíveis
export const TIME_CONTROLS = [
  { name: 'Bullet 1+0', label: 'Bullet', time: 60, increment: 0, category: 'bullet' },
  { name: 'Bullet 2+1', label: 'Bullet', time: 120, increment: 1, category: 'bullet' },
  { name: 'Blitz 3+0', label: 'Blitz', time: 180, increment: 0, category: 'blitz' },
  { name: 'Blitz 3+2', label: 'Blitz', time: 180, increment: 2, category: 'blitz' },
  { name: 'Blitz 5+0', label: 'Blitz', time: 300, increment: 0, category: 'blitz' },
  { name: 'Blitz 5+3', label: 'Blitz', time: 300, increment: 3, category: 'blitz' },
  { name: 'Rapid 10+0', label: 'Rapid', time: 600, increment: 0, category: 'rapid' },
  { name: 'Rapid 15+10', label: 'Rapid', time: 900, increment: 10, category: 'rapid' },
  { name: 'Classical 30+0', label: 'Classical', time: 1800, increment: 0, category: 'classical' },
];

// Formatar tempo para exibição (mm:ss)
export function formatTime(milliseconds) {
  if (milliseconds <= 0) return '0:00';
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Formatar tempo com décimos de segundo quando < 20s
export function formatTimeWithTenths(milliseconds) {
  if (milliseconds <= 0) return '0:00.0';
  const totalSeconds = milliseconds / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((milliseconds % 1000) / 100);
  
  if (totalSeconds < 20) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Obter rating apropriado baseado no controle de tempo
export function getRatingForTimeControl(profile, timeControl) {
  if (!profile) return 800;
  
  const category = TIME_CONTROLS.find(tc => tc.name === timeControl)?.category || 'rapid';
  
  switch (category) {
    case 'bullet':
    case 'blitz':
      return profile.rating_blitz || 800;
    case 'rapid':
      return profile.rating_rapid || 800;
    case 'classical':
      return profile.rating_classical || 800;
    default:
      return profile.rating_rapid || 800;
  }
}

// Determinar categoria de rating a atualizar
export function getRatingCategory(timeControlName) {
  const tc = TIME_CONTROLS.find(t => t.name === timeControlName);
  if (!tc) return 'rating_rapid';
  
  switch (tc.category) {
    case 'bullet':
    case 'blitz':
      return 'rating_blitz';
    case 'rapid':
      return 'rating_rapid';
    case 'classical':
      return 'rating_classical';
    default:
      return 'rating_rapid';
  }
}

// FEN inicial padrão
export const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Verificar se é a vez do jogador
export function isPlayerTurn(game, myColor) {
  return game?.current_turn === myColor;
}

// Obter resultado amigável
export function getResultText(result, resultReason, myColor, winnerId, myProfileId) {
  if (!result) return null;
  
  const isWinner = winnerId === myProfileId;
  const isDraw = result === '1/2-1/2';
  
  let resultText = '';
  if (isDraw) {
    resultText = 'Empate';
  } else if (isWinner) {
    resultText = 'Vitória!';
  } else {
    resultText = 'Derrota';
  }
  
  let reasonText = '';
  switch (resultReason) {
    case 'checkmate':
      reasonText = 'por xeque-mate';
      break;
    case 'timeout':
      reasonText = 'por tempo';
      break;
    case 'resignation':
      reasonText = 'por desistência';
      break;
    case 'draw_agreement':
      reasonText = 'por acordo';
      break;
    case 'stalemate':
      reasonText = 'por afogamento';
      break;
    case 'insufficient_material':
      reasonText = 'por material insuficiente';
      break;
    case 'threefold_repetition':
      reasonText = 'por repetição tripla';
      break;
    case 'fifty_moves':
      reasonText = 'pela regra dos 50 lances';
      break;
    default:
      reasonText = '';
  }
  
  return `${resultText} ${reasonText}`.trim();
}
