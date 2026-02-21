import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Download, Star, Shield, Zap, Wifi } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const FEATURES = [
  { icon: Zap, title: 'Jogue em qualquer lugar', desc: 'Partidas online e offline, a qualquer hora.' },
  { icon: Shield, title: 'Sincronização total', desc: 'Seu progresso sincronizado entre todos os dispositivos.' },
  { icon: Wifi, title: 'Modo offline', desc: 'Puzzles e lições disponíveis sem internet.' },
  { icon: Star, title: 'Notificações', desc: 'Receba alertas de desafios e torneios em tempo real.' },
];

const RATINGS = [
  { store: 'App Store', rating: '4.8', reviews: '12.4K', emoji: '🍎' },
  { store: 'Google Play', rating: '4.7', reviews: '28.1K', emoji: '🤖' },
];

export default function MaisApps() {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Smartphone className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Apps OitoPorOito</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Leve o xadrez no seu bolso. Disponível para iOS e Android com todas as funcionalidades da plataforma.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Badges de download */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {RATINGS.map((r, i) => (
            <motion.div key={r.store} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card variant="gradient" className="flex items-center gap-4 px-6 py-4 hover:border-gold/40 transition-all cursor-pointer group min-w-[220px]">
                <span className="text-4xl">{r.emoji}</span>
                <div>
                  <p className="text-xs text-muted-foreground">Disponível na</p>
                  <p className="font-bold text-foreground group-hover:text-gold transition-colors">{r.store}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} className="text-gold fill-gold" />
                    <span className="text-xs text-gold font-semibold">{r.rating}</span>
                    <span className="text-xs text-muted-foreground">({r.reviews} avaliações)</span>
                  </div>
                </div>
                <Download size={18} className="text-gold ml-auto" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Preview do app */}
        <Card variant="gradient" className="mb-10 text-center py-16 border border-gold/20">
          <Smartphone size={64} className="mx-auto mb-4 text-gold opacity-60" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Preview do App</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Screenshots e demonstrações do app em breve. Baixe agora e experimente gratuitamente.
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <Button variant="primary" className="flex items-center gap-2">
              <Download size={16} /> Baixar para iOS
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} /> Baixar para Android
            </Button>
          </div>
        </Card>

        {/* Features */}
        <h2 className="text-xl font-bold text-foreground mb-5 text-center">Por que usar o app?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
                <Card variant="gradient" className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{f.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
