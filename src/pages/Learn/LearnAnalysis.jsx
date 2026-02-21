import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Upload, Link2, Play } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function LearnAnalysis() {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <BarChart2 className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Análise de Partidas</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Analise suas partidas com engine de xadrez. Encontre erros, imprecisões e oportunidades perdidas.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tabuleiro de análise */}
          <div className="lg:col-span-2">
            <Card variant="gradient" className="border border-gold/20">
              <h3 className="font-bold text-foreground mb-4">Tabuleiro de Análise</h3>
              <div className="aspect-square w-full max-w-[480px] mx-auto rounded-xl overflow-hidden border-2 border-gold/20 mb-4">
                <div className="grid grid-cols-8 w-full h-full">
                  {Array.from({ length: 64 }, (_, i) => (
                    <div key={i} className={`${(Math.floor(i / 8) + i % 8) % 2 === 0 ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'}`} />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm">⏮ Início</Button>
                <Button variant="outline" size="sm">◀ Anterior</Button>
                <Button variant="outline" size="sm">▶ Próximo</Button>
                <Button variant="outline" size="sm">⏭ Final</Button>
                <Button variant="primary" size="sm" className="ml-auto flex items-center gap-1">
                  <BarChart2 size={13} /> Analisar com Engine
                </Button>
              </div>
            </Card>
          </div>

          {/* Painel lateral */}
          <div className="space-y-4">
            {/* Importar partida */}
            <Card variant="gradient" className="border border-gold/20">
              <h3 className="font-bold text-foreground mb-3">Importar Partida</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                  <Upload size={14} /> Importar PGN
                </Button>
                <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                  <Link2 size={14} /> Colar FEN/PGN
                </Button>
                <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                  <Play size={14} /> Minhas Partidas
                </Button>
              </div>
            </Card>

            {/* Avaliação da engine */}
            <Card variant="gradient">
              <h3 className="font-bold text-foreground mb-3">Avaliação da Engine</h3>
              <div className="text-center py-6 text-muted-foreground">
                <BarChart2 size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Importe uma partida para ver a análise da engine.</p>
              </div>
            </Card>

            {/* Resumo de erros */}
            <Card variant="gradient">
              <h3 className="font-bold text-foreground mb-3">Resumo</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Erros', value: '—', color: 'text-red-400' },
                  { label: 'Imprecisões', value: '—', color: 'text-yellow-400' },
                  { label: 'Boas jogadas', value: '—', color: 'text-green-400' },
                ].map(s => (
                  <div key={s.label} className="bg-surface-tertiary rounded-lg p-2">
                    <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
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
