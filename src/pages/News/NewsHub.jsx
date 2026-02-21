import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, TrendingUp, Trophy, Users, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const NEWS_SECTIONS = [
  { title: 'Xadrez Hoje', desc: 'As últimas notícias do mundo do xadrez.', emoji: '📰', href: '/news/chess-today', color: 'from-blue-600/20 to-blue-900/10', border: 'border-blue-500/30' },
  { title: 'Artigos', desc: 'Análises aprofundadas e conteúdo educativo.', emoji: '📝', href: '/news/articles', color: 'from-green-600/20 to-green-900/10', border: 'border-green-500/30' },
  { title: 'Rankings', desc: 'Classificações FIDE e da plataforma atualizadas.', emoji: '🏆', href: '/news/rankings', color: 'from-yellow-600/20 to-yellow-900/10', border: 'border-yellow-500/30' },
  { title: 'Top Jogadores', desc: 'Perfis e estatísticas dos melhores jogadores.', emoji: '⭐', href: '/news/top-players', color: 'from-purple-600/20 to-purple-900/10', border: 'border-purple-500/30' },
];

const FEATURED_NEWS = [
  { id: 1, title: 'Magnus Carlsen vence o Grand Chess Tour 2024', category: 'Torneios', time: '2h atrás', emoji: '♟️' },
  { id: 2, title: 'FIDE anuncia novo formato para o Campeonato Mundial', category: 'FIDE', time: '5h atrás', emoji: '🌍' },
  { id: 3, title: 'Hikaru Nakamura bate recorde de rating no Chess960', category: 'Recordes', time: '1d atrás', emoji: '⚡' },
  { id: 4, title: 'Jovem prodígio de 14 anos se torna Mestre Internacional', category: 'Destaque', time: '2d atrás', emoji: '🌟' },
];

export default function NewsHub() {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Newspaper className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Notícias</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Fique por dentro de tudo que acontece no mundo do xadrez.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Seções de notícias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {NEWS_SECTIONS.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <a href={s.href}>
                <Card variant="gradient" className={`h-full flex flex-col gap-3 bg-gradient-to-br ${s.color} ${s.border} hover:scale-[1.02] transition-all cursor-pointer group`}>
                  <span className="text-3xl">{s.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground group-hover:text-gold transition-colors">{s.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                  </div>
                  <span className="text-gold text-xs font-medium flex items-center gap-1">
                    Ver mais <ChevronRight size={12} />
                  </span>
                </Card>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Notícias em destaque */}
        <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
          <TrendingUp size={20} className="text-gold" /> Em Destaque
        </h2>
        <div className="space-y-3">
          {FEATURED_NEWS.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}>
              <Card variant="gradient" className="flex items-center gap-4 hover:border-gold/40 transition-all cursor-pointer group">
                <span className="text-2xl shrink-0">{n.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-gold transition-colors truncate">{n.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/30">{n.category}</span>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground group-hover:text-gold transition-colors shrink-0" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
