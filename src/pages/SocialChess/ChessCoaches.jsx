import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Star, Search, Filter, MessageCircle, Calendar } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const COACHES = [
  { id: 1, name: 'GM Carlos Mendes', emoji: '👨‍🏫', title: 'GM', rating: 2650, specialty: 'Aberturas & Meio-jogo', price: 'R$ 120/h', students: 48, rating_score: 4.9, reviews: 87, available: true, languages: ['PT', 'EN'], country: '🇧🇷' },
  { id: 2, name: 'IM Ana Souza', emoji: '👩‍🏫', title: 'IM', rating: 2450, specialty: 'Finais & Estratégia', price: 'R$ 90/h', students: 62, rating_score: 4.8, reviews: 124, available: true, languages: ['PT'], country: '🇧🇷' },
  { id: 3, name: 'FM Pedro Lima', emoji: '🧔', title: 'FM', rating: 2300, specialty: 'Táticas & Puzzles', price: 'R$ 70/h', students: 35, rating_score: 4.7, reviews: 56, available: false, languages: ['PT', 'ES'], country: '🇧🇷' },
  { id: 4, name: 'CM Julia Ramos', emoji: '👩', title: 'CM', rating: 2150, specialty: 'Iniciantes & Juvenil', price: 'R$ 50/h', students: 91, rating_score: 5.0, reviews: 203, available: true, languages: ['PT'], country: '🇧🇷' },
  { id: 5, name: 'NM Rafael Costa', emoji: '👨', title: 'NM', rating: 2050, specialty: 'Preparação para Torneios', price: 'R$ 60/h', students: 27, rating_score: 4.6, reviews: 41, available: true, languages: ['PT', 'EN'], country: '🇧🇷' },
  { id: 6, name: 'GM Yuri Petrov', emoji: '🧑', title: 'GM', rating: 2720, specialty: 'Abertura Siciliana', price: 'R$ 150/h', students: 19, rating_score: 4.9, reviews: 38, available: false, languages: ['EN', 'RU'], country: '🇷🇺' },
];

const TITLE_COLORS = {
  GM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  IM: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  FM: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  CM: 'bg-green-500/20 text-green-400 border-green-500/30',
  NM: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function ChessCoaches() {
  const [search, setSearch] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(false);

  const filtered = COACHES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.specialty.toLowerCase().includes(search.toLowerCase());
    const matchAvail = filterAvailable ? c.available : true;
    return matchSearch && matchAvail;
  });

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Treinadores</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Encontre o treinador ideal para o seu nível. Aulas particulares com mestres e grandes mestres.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Busca e filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome ou especialidade..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-secondary border border-gold/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <button
            onClick={() => setFilterAvailable(!filterAvailable)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              filterAvailable ? 'bg-gold text-surface-primary border-gold' : 'bg-surface-secondary text-muted-foreground border-gold/20 hover:border-gold/40'
            }`}
          >
            <Filter size={14} />
            Disponíveis agora
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card variant="gradient" className="h-full flex flex-col gap-3 hover:border-gold/40 transition-all">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-surface-tertiary flex items-center justify-center text-3xl border border-gold/20">
                      {c.emoji}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface-secondary ${c.available ? 'bg-green-500' : 'bg-gray-500'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-foreground text-sm truncate">{c.name}</h3>
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${TITLE_COLORS[c.title]}`}>{c.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.country} {c.specialty}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-semibold text-foreground">{c.rating_score}</span>
                      <span className="text-xs text-muted-foreground">({c.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-surface-tertiary rounded-lg p-2">
                    <div className="text-sm font-bold text-gold">{c.rating}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="bg-surface-tertiary rounded-lg p-2">
                    <div className="text-sm font-bold text-foreground">{c.students}</div>
                    <div className="text-xs text-muted-foreground">Alunos</div>
                  </div>
                  <div className="bg-surface-tertiary rounded-lg p-2">
                    <div className="text-sm font-bold text-foreground">{c.languages.join('/')}</div>
                    <div className="text-xs text-muted-foreground">Idiomas</div>
                  </div>
                </div>

                {/* Preço */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-gold font-bold">{c.price}</span>
                  <span className={`text-xs ${c.available ? 'text-green-400' : 'text-muted-foreground'}`}>
                    {c.available ? '● Disponível' : '○ Indisponível'}
                  </span>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="flex-1 flex items-center gap-1" disabled={!c.available}>
                    <Calendar size={13} />
                    Agendar
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <MessageCircle size={13} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <GraduationCap size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum treinador encontrado.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
