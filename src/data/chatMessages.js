/**
 * Mensagens de chat rápido pré-definidas para partidas online
 */
export const QUICK_CHAT_MESSAGES = [
  { key: 'good_luck', text: 'Boa sorte!', emoji: '🍀' },
  { key: 'good_game', text: 'Bom jogo!', emoji: '👏' },
  { key: 'well_played', text: 'Bem jogado!', emoji: '👍' },
  { key: 'thanks', text: 'Obrigado!', emoji: '🙏' },
  { key: 'oops', text: 'Ops!', emoji: '😅' },
  { key: 'nice_move', text: 'Bela jogada!', emoji: '✨' },
  { key: 'thinking', text: 'Pensando...', emoji: '🤔' },
  { key: 'gg', text: 'GG!', emoji: '🤝' },
];

/**
 * Busca uma mensagem pelo seu identificador
 * @param {string} key - Chave da mensagem
 * @returns {object|undefined} Objeto da mensagem ou undefined
 */
export const getChatMessage = (key) => {
  return QUICK_CHAT_MESSAGES.find(m => m.key === key);
};
