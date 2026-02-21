import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Zap, Brain } from 'lucide-react';

export default function AnalysisPanel({ 
  isAnalyzing, 
  progress, 
  analysisResults, 
  error, 
  onStartAnalysis, 
  onStopAnalysis 
}) {
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
        <AlertCircle className="mx-auto mb-2 text-red-400" size={24} />
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="bg-surface-secondary rounded-xl p-6 text-center">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Loader2 className="w-full h-full text-gold animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-foreground">{progress}%</span>
          </div>
        </div>
        <p className="text-foreground mb-3">Analisando partida...</p>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <motion.div
            className="bg-gold h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <button
          onClick={onStopAnalysis}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancelar
        </button>
      </div>
    );
  }

  if (!analysisResults) {
    return (
      <div className="bg-surface-secondary rounded-xl p-6 text-center">
        <Brain className="mx-auto mb-3 text-gold" size={40} />
        <h3 className="text-lg font-semibold text-foreground mb-2">Análise com Stockfish</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Descubra os melhores lances e onde você errou
        </p>
        <button
          onClick={onStartAnalysis}
          className="px-6 py-2.5 bg-gradient-to-r from-gold to-gold-light 
                     text-black font-semibold rounded-lg hover:scale-105 transition-transform
                     flex items-center gap-2 mx-auto"
        >
          <Zap size={18} />
          Analisar Partida
        </button>
      </div>
    );
  }

  // Show summary when analysis is complete
  return (
    <div className="bg-surface-secondary rounded-xl p-4 space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Brain className="text-gold" size={20} />
        Resumo da Análise
      </h3>

      {/* Accuracy comparison */}
      <div className="grid grid-cols-2 gap-4">
        <AccuracyBadge 
          label="Brancas" 
          accuracy={analysisResults.whiteAccuracy} 
          counts={analysisResults.moveTypeCounts.white}
        />
        <AccuracyBadge 
          label="Pretas" 
          accuracy={analysisResults.blackAccuracy}
          counts={analysisResults.moveTypeCounts.black}
        />
      </div>

      {/* Move type breakdown */}
      <div className="border-t border-gold/10 pt-3">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Classificação dos Lances</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <MoveCounts counts={analysisResults.moveTypeCounts.white} label="Brancas" />
          <MoveCounts counts={analysisResults.moveTypeCounts.black} label="Pretas" />
        </div>
      </div>

      <button
        onClick={onStartAnalysis}
        className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground 
                   border border-gold/10 rounded-lg hover:bg-surface-tertiary transition-colors"
      >
        Reanalisar
      </button>
    </div>
  );
}

function AccuracyBadge({ label, accuracy, counts }) {
  const getAccuracyColor = (acc) => {
    if (acc >= 90) return 'text-green-400';
    if (acc >= 80) return 'text-blue-400';
    if (acc >= 70) return 'text-yellow-400';
    if (acc >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-surface-tertiary rounded-lg p-3 text-center">
      <p className="text-xs text-muted-foreground/60 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${getAccuracyColor(accuracy)}`}>
        {accuracy.toFixed(1)}%
      </p>
      <p className="text-xs text-muted-foreground/60 mt-1">precisão</p>
    </div>
  );
}

function MoveCounts({ counts, label }) {
  return (
    <div className="space-y-1">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {counts.brilliant > 0 && (
        <div className="flex justify-between text-cyan-400">
          <span>Brilhante !!</span>
          <span>{counts.brilliant}</span>
        </div>
      )}
      {counts.best > 0 && (
        <div className="flex justify-between text-green-400">
          <span>Melhor ★</span>
          <span>{counts.best}</span>
        </div>
      )}
      {counts.good > 0 && (
        <div className="flex justify-between text-foreground">
          <span>Bom</span>
          <span>{counts.good}</span>
        </div>
      )}
      {counts.inaccuracy > 0 && (
        <div className="flex justify-between text-yellow-400">
          <span>Imprecisão ?!</span>
          <span>{counts.inaccuracy}</span>
        </div>
      )}
      {counts.mistake > 0 && (
        <div className="flex justify-between text-orange-400">
          <span>Erro ?</span>
          <span>{counts.mistake}</span>
        </div>
      )}
      {counts.blunder > 0 && (
        <div className="flex justify-between text-red-400">
          <span>Erro Grave ??</span>
          <span>{counts.blunder}</span>
        </div>
      )}
    </div>
  );
}
