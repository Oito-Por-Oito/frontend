import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Share2, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const today = new Date();
const dateStr = today.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export default function PuzzleDaily() {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-6xl mb-4">📅</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gold mb-2">Puzzle do Dia</h1>
            <p className="text-muted-foreground text-sm capitalize">{dateStr}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tabuleiro */}
          <div className="lg:col-span-2">
            <Card variant="gradient" className="border border-gold/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground">Brancas jogam e vencem</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-surface-tertiary px-2 py-1 rounded-full border border-gold/10">
                    Mate em 2 · ⭐ 1450
                  </span>
                </div>
              </div>

              {/* Tabuleiro placeholder */}
              <div className="aspect-square w-full max-w-[480px] mx-auto rounded-xl overflow-hidden border-2 border-gold/20 mb-4">
                <div className="grid grid-cols-8 w-full h-full">
                  {Array.from({ length: 64 }, (_, i) => (
                    <div
                      key={i}
                      className={`${(Math.floor(i / 8) + i % 8) % 2 === 0 ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'} flex items-center justify-center`}
                    >
                      {/* Peças seriam renderizadas aqui */}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <ChevronLeft size={16} /> Anterior
                </Button>
                <Button variant="primary" size="md" className="flex items-center gap-2">
                  Resolver Puzzle
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  Próximo <ChevronRight size={16} />
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Streak */}
            <Card variant="gradient" className="text-center border border-gold/20">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-gold">0</div>
              <div className="text-sm text-muted-foreground">dias seguidos</div>
              <div className="mt-3 text-xs text-muted-foreground">
                Resolva o puzzle de hoje para começar sua sequência!
              </div>
            </Card>

            {/* Histórico da semana */}
            <Card variant="gradient">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-gold" /> Esta Semana
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">{d}</div>
                    <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs ${
                      i < today.getDay() ? 'bg-green-500/20 text-green-400' :
                      i === today.getDay() ? 'bg-gold/20 text-gold border border-gold/40' :
                      'bg-surface-tertiary text-muted-foreground'
                    }`}>
                      {i < today.getDay() ? '✓' : i === today.getDay() ? '?' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Compartilhar */}
            <Card variant="gradient">
              <h3 className="font-bold text-foreground mb-3">Compartilhar</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Resolva o puzzle e compartilhe seu resultado com amigos!
              </p>
              <Button variant="outline" size="sm" className="w-full flex items-center gap-2" disabled>
                <Share2 size={14} /> Compartilhar Resultado
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
