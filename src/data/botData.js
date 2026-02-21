/**
 * Catálogo de bots com personalidades únicas no estilo Chess.com
 * Cada bot tem nome, rating, país, avatar, mensagem e nível do Stockfish mapeado
 */

export const BOT_CATEGORIES = {
  BEGINNER: 'Iniciante',
  INTERMEDIATE: 'Intermediário', 
  ADVANCED: 'Avançado',
  MASTER: 'Mestre',
  GRANDMASTER: 'Grande Mestre'
};

export const BOTS = [
  // Iniciantes (Stockfish 0-3)
  {
    id: 'sunny',
    name: 'Sunny',
    rating: 250,
    country: 'br',
    avatar: '🌞',
    message: 'Olá! Sou novo no xadrez, vamos aprender juntos!',
    stockfishLevel: 0,
    category: BOT_CATEGORIES.BEGINNER,
    personality: 'Amigável e encorajador'
  },
  {
    id: 'jimmy',
    name: 'Jimmy',
    rating: 400,
    country: 'us',
    avatar: '🧒',
    message: 'Thanks for playing chess with me. Good luck!',
    stockfishLevel: 1,
    category: BOT_CATEGORIES.BEGINNER,
    personality: 'Jovem e animado'
  },
  {
    id: 'pedro',
    name: 'Pedro',
    rating: 550,
    country: 'mx',
    avatar: '🎸',
    message: '¡Hola amigo! Vamos jogar um xadrez tranquilo.',
    stockfishLevel: 2,
    category: BOT_CATEGORIES.BEGINNER,
    personality: 'Descontraído'
  },
  {
    id: 'maria',
    name: 'Maria',
    rating: 700,
    country: 'pt',
    avatar: '👩',
    message: 'Adoro xadrez! Vamos ver quem joga melhor.',
    stockfishLevel: 3,
    category: BOT_CATEGORIES.BEGINNER,
    personality: 'Competitiva mas justa'
  },

  // Intermediários (Stockfish 4-8)
  {
    id: 'carlos',
    name: 'Carlos',
    rating: 850,
    country: 'es',
    avatar: '🧔',
    message: 'Buena suerte! Vou te mostrar algumas táticas.',
    stockfishLevel: 4,
    category: BOT_CATEGORIES.INTERMEDIATE,
    personality: 'Professor paciente'
  },
  {
    id: 'elena',
    name: 'Elena',
    rating: 1000,
    country: 'ru',
    avatar: '👱‍♀️',
    message: 'Привет! Estou focada em melhorar meus finais.',
    stockfishLevel: 5,
    category: BOT_CATEGORIES.INTERMEDIATE,
    personality: 'Estudiosa e analítica'
  },
  {
    id: 'nelson',
    name: 'Nelson',
    rating: 1150,
    country: 'za',
    avatar: '🧑‍🦱',
    message: 'I love tactical puzzles! Let\'s see yours.',
    stockfishLevel: 6,
    category: BOT_CATEGORIES.INTERMEDIATE,
    personality: 'Tático e agressivo'
  },
  {
    id: 'yuki',
    name: 'Yuki',
    rating: 1300,
    country: 'jp',
    avatar: '🎌',
    message: 'よろしく! Precisão é a chave do xadrez.',
    stockfishLevel: 7,
    category: BOT_CATEGORIES.INTERMEDIATE,
    personality: 'Preciso e metódico'
  },
  {
    id: 'ahmed',
    name: 'Ahmed',
    rating: 1450,
    country: 'eg',
    avatar: '👳',
    message: 'Que a partida seja justa e equilibrada!',
    stockfishLevel: 8,
    category: BOT_CATEGORIES.INTERMEDIATE,
    personality: 'Estrategista clássico'
  },

  // Avançados (Stockfish 9-13)
  {
    id: 'sophie',
    name: 'Sophie',
    rating: 1550,
    country: 'fr',
    avatar: '👩‍🎓',
    message: 'Bonjour! J\'adore les échecs positionnels.',
    stockfishLevel: 9,
    category: BOT_CATEGORIES.ADVANCED,
    personality: 'Posicional e elegante'
  },
  {
    id: 'viktor',
    name: 'Viktor',
    rating: 1700,
    country: 'ua',
    avatar: '🥋',
    message: 'Давай! Prepare-se para uma luta dura.',
    stockfishLevel: 10,
    category: BOT_CATEGORIES.ADVANCED,
    personality: 'Lutador determinado'
  },
  {
    id: 'chen',
    name: 'Chen Wei',
    rating: 1850,
    country: 'cn',
    avatar: '🏮',
    message: '您好! O xadrez é como a arte da guerra.',
    stockfishLevel: 11,
    category: BOT_CATEGORIES.ADVANCED,
    personality: 'Filosófico e profundo'
  },
  {
    id: 'isabella',
    name: 'Isabella',
    rating: 2000,
    country: 'it',
    avatar: '👑',
    message: 'Ciao! Vamos ver quem domina o centro.',
    stockfishLevel: 12,
    category: BOT_CATEGORIES.ADVANCED,
    personality: 'Dominante e confiante'
  },
  {
    id: 'magnus_jr',
    name: 'Magnus Jr.',
    rating: 2100,
    country: 'no',
    avatar: '⚔️',
    message: 'Hei! Sonho em ser campeão mundial.',
    stockfishLevel: 13,
    category: BOT_CATEGORIES.ADVANCED,
    personality: 'Ambicioso e talentoso'
  },

  // Mestres (Stockfish 14-17)
  {
    id: 'grandpa_boris',
    name: 'Vovô Boris',
    rating: 2200,
    country: 'ru',
    avatar: '👴',
    message: 'Joguei contra Tal uma vez. Boa sorte!',
    stockfishLevel: 14,
    category: BOT_CATEGORIES.MASTER,
    personality: 'Experiente e sábio'
  },
  {
    id: 'alexandra',
    name: 'Alexandra',
    rating: 2350,
    country: 'ge',
    avatar: '♟️',
    message: 'Sou Mestre Internacional. Prepare-se!',
    stockfishLevel: 15,
    category: BOT_CATEGORIES.MASTER,
    personality: 'Profissional e séria'
  },
  {
    id: 'david',
    name: 'David',
    rating: 2450,
    country: 'il',
    avatar: '📚',
    message: 'Estudei 10.000 partidas. E você?',
    stockfishLevel: 16,
    category: BOT_CATEGORIES.MASTER,
    personality: 'Erudito e preparado'
  },
  {
    id: 'kumar',
    name: 'Kumar',
    rating: 2550,
    country: 'in',
    avatar: '🧘',
    message: 'Namaste! O xadrez é meditação em ação.',
    stockfishLevel: 17,
    category: BOT_CATEGORIES.MASTER,
    personality: 'Calmo e centrado'
  },

  // Grandes Mestres (Stockfish 18-20)
  {
    id: 'gm_ivanov',
    name: 'GM Ivanov',
    rating: 2650,
    country: 'ru',
    avatar: '🏆',
    message: 'Sou Grande Mestre há 20 anos.',
    stockfishLevel: 18,
    category: BOT_CATEGORIES.GRANDMASTER,
    personality: 'Veterano implacável'
  },
  {
    id: 'gm_fischer_bot',
    name: 'Fischer Bot',
    rating: 2750,
    country: 'us',
    avatar: '⚡',
    message: 'Precisão absoluta. Sem misericórdia.',
    stockfishLevel: 19,
    category: BOT_CATEGORIES.GRANDMASTER,
    personality: 'Perfecionista e intenso'
  },
  {
    id: 'stockfish_max',
    name: 'Stockfish Max',
    rating: 3200,
    country: 'world',
    avatar: '🐟',
    message: 'Eu sou a engine mais forte do mundo.',
    stockfishLevel: 20,
    category: BOT_CATEGORIES.GRANDMASTER,
    personality: 'Máquina implacável'
  }
];

export const TIME_CONTROLS = [
  { id: 'bullet1', name: '1 min', category: 'Bullet', initialTime: 60, increment: 0, icon: '🔥' },
  { id: 'bullet1_1', name: '1|1', category: 'Bullet', initialTime: 60, increment: 1, icon: '🔥' },
  { id: 'bullet2_1', name: '2|1', category: 'Bullet', initialTime: 120, increment: 1, icon: '🔥' },
  { id: 'blitz3', name: '3 min', category: 'Blitz', initialTime: 180, increment: 0, icon: '⚡' },
  { id: 'blitz3_2', name: '3|2', category: 'Blitz', initialTime: 180, increment: 2, icon: '⚡' },
  { id: 'blitz5', name: '5 min', category: 'Blitz', initialTime: 300, increment: 0, icon: '⚡' },
  { id: 'blitz5_3', name: '5|3', category: 'Blitz', initialTime: 300, increment: 3, icon: '⚡' },
  { id: 'rapid10', name: '10 min', category: 'Rapid', initialTime: 600, increment: 0, icon: '🕐' },
  { id: 'rapid15_10', name: '15|10', category: 'Rapid', initialTime: 900, increment: 10, icon: '🕐' },
  { id: 'rapid30', name: '30 min', category: 'Rapid', initialTime: 1800, increment: 0, icon: '🕐' },
];

export const getBotsByCategory = (category) => {
  return BOTS.filter(bot => bot.category === category);
};

export const getBotById = (id) => {
  return BOTS.find(bot => bot.id === id);
};

export const getFlagUrl = (country) => {
  if (country === 'world') return null;
  return `https://flagcdn.com/w40/${country}.png`;
};
