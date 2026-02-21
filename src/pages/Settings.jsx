import React from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { PieceThemeSelector } from '@/components/ui';
import { BoardThemeSelector, SoundSettings } from '@/components/settings';

/**
 * Página de Configurações
 * Permite ao usuário personalizar tema de peças, sons e cores do tabuleiro
 */
export default function Settings() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-6 sm:py-8 px-3 sm:px-4 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <FiArrowLeft />
              Voltar
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gold/20 rounded-xl">
                <FiSettings className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Configurações</h1>
                <p className="text-muted-foreground">
                  Personalize sua experiência de jogo
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {/* Tema das Peças */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface-primary border border-surface-secondary rounded-2xl p-4 sm:p-6"
            >
              <PieceThemeSelector />
            </motion.section>

            {/* Sons do Jogo */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface-primary border border-surface-secondary rounded-2xl p-4 sm:p-6"
            >
              <SoundSettings />
            </motion.section>

            {/* Cores do Tabuleiro */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface-primary border border-surface-secondary rounded-2xl p-4 sm:p-6"
            >
              <BoardThemeSelector />
            </motion.section>
          </div>

          {/* Footer info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            Suas preferências são salvas automaticamente
          </motion.p>
        </div>
      </div>
    </MainLayout>
  );
}
