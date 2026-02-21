
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import chessData from "../data/chessData";
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
      className="bg-gradient-to-r from-[#232526] via-[#1a1a1a] to-[#232526] rounded-2xl shadow-xl border-t-2 border-b-2 border-[#c29d5d]/30 mb-10 overflow-x-auto"
    >
      <h2 className="text-xl md:text-2xl font-bold text-[#e7c27d] px-6 pt-6 pb-2 drop-shadow text-left">
        {mode} - {category}
      </h2>
      <table className="w-full text-sm md:text-base text-white px-4 mb-4">
        <thead>
          <tr className="text-left text-[#d4af37] border-b border-[#c29d5d]/20">
            <th className="py-2 px-4">#</th>
            <th className="py-2 px-4">Jogador</th>
            <th className="py-2 px-4">País</th>
            <th className="py-2 px-4 text-right">Rating</th>
          </tr>
        </thead>
        <tbody>
          {players && players.length > 0 ? (
            players.map((player, idx) => (
              <tr key={player.name} className="border-b border-[#c29d5d]/10 hover:bg-[#232526]/40 transition-all">
                <td className="py-2 px-4 font-bold text-[#d4af37]">{idx + 1}</td>
                <td className="py-2 px-4 flex items-center gap-2">
                  <span className="font-semibold">{player.name}</span>
                </td>
                <td className="py-2 px-4">
                  <img
                    src={getFlagUrl(player.country)}
                    alt={player.country}
                    className="w-6 h-4 object-cover rounded-sm border border-[#444] bg-[#232526] inline-block mr-2"
                  />
                  <span className="uppercase text-xs text-gray-400">{player.country}</span>
                </td>
                <td className="py-2 px-4 text-right font-bold text-[#d4af37]">{player.rating}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-6 text-center text-gray-400">
                Sem dados para esta modalidade/categoria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}

export default function RatingsPlayers() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col overflow-x-hidden">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col items-center bg-[#2c2c2c] px-2 sm:px-4 md:px-8 pt-8 flex-1 w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="w-full max-w-[1200px] mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="text-3xl md:text-4xl font-bold text-[#e7c27d] mb-8 text-center drop-shadow"
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
              <h2 className="text-2xl font-bold text-[#c29d5d] mb-4 mt-8 text-left">{mode}</h2>
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
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
}
