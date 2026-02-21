import React from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, Users, Plus, Play, Calendar } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const CLASSES = [
  { id: 1, title: 'Táticas para Iniciantes', instructor: 'Prof. Silva', students: 24, next: 'Hoje, 19h', status: 'upcoming', emoji: '⚡' },
  { id: 2, title: 'Finais de Torre', instructor: 'IM Souza', students: 18, next: 'Amanhã, 20h', status: 'upcoming', emoji: '🏰' },
  { id: 3, title: 'Aberturas Populares', instructor: 'GM Mendes', students: 32, next: 'Qui, 18h', status: 'upcoming', emoji: '📖' },
];

export default function LearnClassroom() {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <MonitorPlay className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Sala de Aula</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Aulas ao vivo com instrutores. Aprenda em grupo e tire suas dúvidas em tempo real.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Próximas Aulas</h2>
          <Button variant="primary" size="sm" className="flex items-center gap-2">
            <Plus size={14} /> Criar Sala
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {CLASSES.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card variant="gradient" className="h-full flex flex-col gap-3 hover:border-gold/40 transition-all">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{c.emoji}</span>
                  <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/30">Ao vivo</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{c.instructor}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users size={11} /> {c.students} inscritos</span>
                  <span className="flex items-center gap-1"><Calendar size={11} /> {c.next}</span>
                </div>
                <Button variant="primary" size="sm" className="mt-auto flex items-center gap-2">
                  <Play size={13} /> Participar
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Aulas gravadas */}
        <h2 className="text-xl font-bold text-foreground mb-4">Aulas Gravadas</h2>
        <Card variant="gradient" className="text-center py-12 text-muted-foreground">
          <MonitorPlay size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhuma aula gravada disponível ainda.</p>
          <p className="text-xs mt-1">As aulas ao vivo ficam disponíveis para replay após 24 horas.</p>
        </Card>
      </div>
    </PageLayout>
  );
}
