import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookMarked, Search, TrendingUp, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const OPENINGS_TREE = [
  {
    eco: 'B20-B99', name: 'Defesa Siciliana', moves: '1.e4 c5', popularity: 98, emoji: '🛡️',
    lines: ['Variante Najdorf', 'Variante Dragão', 'Variante Scheveningen', 'Variante Clássica']
  },
  {
    eco: 'C60-C99', name: 'Abertura Espanhola (Ruy López)', moves: '1.e4 e5 2.Cf3 Cc6 3.Bb5', popularity: 90, emoji: '🇪🇸',
    lines: ['Defesa Berlinesa', 'Defesa Morphy', 'Variante Fechada', 'Variante Aberta']
  },
  {
    eco: 'C50-C59', name: 'Abertura Italiana', moves: '1.e4 e5 2.Cf3 Cc6 3.Bc4', popularity: 88, emoji: '🇮🇹',
    lines: ['Giuoco Piano', 'Giuoco Pianissimo', 'Ataque Evans', 'Defesa Dois Cavalos']
  },
  {
    eco: 'D06-D69', name: 'Gambito da Rainha', moves: '1.d4 d5 2.c4', popularity: 85, emoji: '👑',
    lines: ['Gambito da Rainha Aceito', 'Gambito da Rainha Recusado', 'Defesa Eslava', 'Defesa Semi-Eslava']
  },
  {
    eco: 'E60-E99', name: 'Defesa Indiana do Rei', moves: '1.d4 Cf6 2.c4 g6', popularity: 82, emoji: '🏰',
    lines: ['Variante Clássica', 'Variante Sämisch', 'Variante Averbakh', 'Sistema Quatro Peões']
  },
  {
    eco: 'C00-C19', name: 'Defesa Francesa', moves: '1.e4 e6', popularity: 78, emoji: '🇫🇷',
    lines: ['Variante Winawer', 'Variante Tarrasch', 'Variante Clássica', 'Variante de Avanço']
  },
];

export default function MaisAberturas() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = OPENINGS_TREE.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.eco.toLowerCase().includes(search.toLowerCase()) ||
    o.moves.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <BookMarked className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Explorador de Aberturas</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Explore a árvore completa de aberturas do xadrez com estatísticas de popularidade e variantes detalhadas.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Busca */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome, código ECO ou lances..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-secondary border border-gold/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de aberturas */}
          <div className="lg:col-span-2 space-y-3">
            {filtered.map((o, i) => (
              <motion.div key={o.eco} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card
                  variant="gradient"
                  className={`cursor-pointer transition-all hover:border-gold/40 group ${selected?.eco === o.eco ? 'border-gold/50 bg-gold/5' : ''}`}
                  onClick={() => setSelected(selected?.eco === o.eco ? null : o)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-tertiary flex items-center justify-center text-2xl shrink-0 border border-gold/10">
                      {o.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-foreground group-hover:text-gold transition-colors truncate">{o.name}</h3>
                        <span className="text-xs text-muted-foreground bg-surface-tertiary px-2 py-0.5 rounded font-mono shrink-0">{o.eco}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{o.moves}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <TrendingUp size={11} className="text-gold" />
                        <div className="h-1.5 w-20 bg-surface-tertiary rounded-full overflow-hidden">
                          <div className="h-full bg-gold rounded-full" style={{ width: `${o.popularity}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{o.popularity}% popular</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className={`text-muted-foreground transition-transform shrink-0 ${selected?.eco === o.eco ? 'rotate-90 text-gold' : 'group-hover:text-gold'}`} />
                  </div>

                  {/* Variantes expandidas */}
                  {selected?.eco === o.eco && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-gold/10">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Principais Variantes</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {o.lines.map(line => (
                          <button
                            key={line}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-tertiary hover:bg-gold/10 hover:text-gold text-sm text-foreground transition-all text-left"
                          >
                            <ChevronRight size={12} className="text-gold shrink-0" />
                            {line}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Painel lateral */}
          <div className="space-y-4">
            <Card variant="gradient">
              <h3 className="font-bold text-foreground mb-3">Tabuleiro de Exploração</h3>
              <div className="aspect-square w-full rounded-xl overflow-hidden border border-gold/20">
                <div className="grid grid-cols-8 w-full h-full">
                  {Array.from({ length: 64 }, (_, i) => (
                    <div key={i} className={`${(Math.floor(i / 8) + i % 8) % 2 === 0 ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'}`} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">Selecione uma abertura para visualizar</p>
            </Card>

            <Card variant="gradient">
              <h3 className="font-bold text-foreground mb-3">Estatísticas Globais</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Total de aberturas', value: '1.327' },
                  { label: 'Variantes catalogadas', value: '8.492' },
                  { label: 'Partidas analisadas', value: '2.1M' },
                ].map(s => (
                  <div key={s.label} className="flex justify-between">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="text-gold font-bold">{s.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
