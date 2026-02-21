import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Plus, Trash2, Play } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const THEMES = ['Garfo', 'Cravada', 'Espeto', 'Ataque Descoberto', 'Mate em 1', 'Mate em 2', 'Mate em 3', 'Final', 'Abertura', 'Sacrifício', 'Promoção', 'Defesa'];
const DIFFICULTIES = ['Iniciante (600-1000)', 'Intermediário (1000-1400)', 'Avançado (1400-1800)', 'Mestre (1800+)'];

export default function PuzzleCustom() {
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedDiff, setSelectedDiff] = useState('');
  const [count, setCount] = useState(10);

  const toggleTheme = (t) => {
    setSelectedThemes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Settings2 className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Puzzles Personalizados</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Monte sua própria sessão de treino. Escolha os temas, dificuldade e quantidade de puzzles.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuração */}
          <div className="lg:col-span-2 space-y-5">
            {/* Temas */}
            <Card variant="gradient">
              <h3 className="font-bold text-foreground mb-3">Temas Táticos</h3>
              <div className="flex flex-wrap gap-2">
                {THEMES.map(t => (
                  <button
                    key={t}
                    onClick={() => toggleTheme(t)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      selectedThemes.includes(t)
                        ? 'bg-gold text-surface-primary border-gold'
                        : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {selectedThemes.length > 0 && (
                <button
                  onClick={() => setSelectedThemes([])}
                  className="mt-3 text-xs text-muted-foreground hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={12} /> Limpar seleção
                </button>
              )}
            </Card>

            {/* Dificuldade */}
            <Card variant="gradient">
              <h3 className="font-bold text-foreground mb-3">Dificuldade</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDiff(d)}
                    className={`px-3 py-2.5 rounded-xl text-sm text-left border transition-all ${
                      selectedDiff === d
                        ? 'bg-gold/20 text-gold border-gold/50 font-semibold'
                        : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/30'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Card>

            {/* Quantidade */}
            <Card variant="gradient">
              <h3 className="font-bold text-foreground mb-3">Quantidade de Puzzles</h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={count}
                  onChange={e => setCount(Number(e.target.value))}
                  className="flex-1 accent-gold"
                />
                <span className="text-2xl font-bold text-gold w-12 text-center">{count}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5</span><span>50</span>
              </div>
            </Card>
          </div>

          {/* Resumo */}
          <div>
            <Card variant="gradient" className="sticky top-20 border border-gold/30">
              <h3 className="font-bold text-foreground mb-4">Resumo da Sessão</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Temas</span>
                  <span className="text-foreground font-medium">
                    {selectedThemes.length === 0 ? 'Todos' : `${selectedThemes.length} selecionados`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dificuldade</span>
                  <span className="text-foreground font-medium">
                    {selectedDiff ? selectedDiff.split(' ')[0] : 'Mista'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Puzzles</span>
                  <span className="text-gold font-bold">{count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tempo estimado</span>
                  <span className="text-foreground">{count * 2}–{count * 4} min</span>
                </div>
              </div>

              {selectedThemes.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground mb-2">Temas selecionados:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedThemes.map(t => (
                      <span key={t} className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              <Button variant="primary" size="md" className="w-full flex items-center gap-2">
                <Play size={16} /> Iniciar Sessão
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
