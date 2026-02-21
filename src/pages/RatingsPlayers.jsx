import React from "react";
import { PageLayout } from "@/components/layout";
import { Container, Card } from "@/components/ui";
import chessData from "@/data/chessData";
import { motion } from "framer-motion";

const MODES = Object.keys(chessData);
const CATEGORIES = ["Open", "Women", "Juniors"];

const getFlagUrl = (countryCode) =>
  `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

function PlayersTable({ mode, category, players }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <Card variant="gradient" className="mb-10 overflow-x-auto border-t-2 border-b-2 border-gold/30">
        <h2 className="text-xl md:text-2xl font-bold text-gold-light px-2 pt-2 pb-2 drop-shadow text-left">
          {mode} - {category}
        </h2>
        <table className="w-full text-sm md:text-base text-foreground">
          <thead>
            <tr className="text-left text-gold border-b border-gold/20">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Jogador</th>
              <th className="py-2 px-4">País</th>
              <th className="py-2 px-4 text-right">Rating</th>
            </tr>
          </thead>
          <tbody>
            {players && players.length > 0 ? (
              players.map((player, idx) => (
                <tr key={player.name} className="border-b border-gold/10 hover:bg-surface-secondary/40 transition-all">
                  <td className="py-2 px-4 font-bold text-gold">{idx + 1}</td>
                  <td className="py-2 px-4 flex items-center gap-2">
                    <span className="font-semibold">{player.name}</span>
                  </td>
                  <td className="py-2 px-4">
                    <img
                      src={getFlagUrl(player.country)}
                      alt={player.country}
                      className="w-6 h-4 object-cover rounded-sm border border-surface-tertiary bg-surface-secondary inline-block mr-2"
                    />
                    <span className="uppercase text-xs text-muted-foreground">{player.country}</span>
                  </td>
                  <td className="py-2 px-4 text-right font-bold text-gold">{player.rating}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-muted-foreground">
                  Sem dados para esta modalidade/categoria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
}

export default function RatingsPlayers() {
  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col items-center bg-surface-tertiary px-2 md:px-8 pt-8 flex-1 w-full"
      >
        <Container size="wide">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="text-3xl md:text-4xl font-bold text-gold-light mb-8 text-center drop-shadow"
          >
            Ratings dos Melhores Jogadores de Xadrez
          </motion.h1>
          {MODES.map((mode, i) => (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.18 + i * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gold mb-4 mt-8 text-left">{mode}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {CATEGORIES.map((category) => (
                  <PlayersTable
                    key={category}
                    mode={mode}
                    category={category}
                    players={chessData[mode][category]}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </Container>
      </motion.div>
    </PageLayout>
  );
}
