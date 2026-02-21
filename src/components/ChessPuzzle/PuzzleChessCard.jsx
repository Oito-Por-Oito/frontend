
import React from 'react';
import { motion } from "framer-motion";

export default function PuzzleChessCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-gradient-to-r from-[#232526] via-[#1a1a1a] to-[#232526] text-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl max-w-4xl w-full mx-auto flex flex-col sm:flex-row items-center gap-6 md:gap-8 border-t-2 border-b-2 border-[#c29d5d]/30"
    >
      {/* Lado esquerdo: tabuleiro */}
      <div className="w-full max-w-[220px] md:max-w-[280px] flex justify-center items-center mb-4 md:mb-0">
        <img
          src="assets/img/puzzle2.png"
          alt="Chess lesson board"
          className="rounded-lg w-full shadow-lg border border-[#c29d5d]/30 bg-[#232526]"
        />
      </div>

      {/* Lado direito: texto, botão e citação */}
      <div className="flex flex-col items-start gap-4 md:gap-6 w-full max-w-sm">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-[#e7c27d] drop-shadow">Take Chess Lessons</h2>
          <button className="bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black font-bold px-6 py-2 rounded-xl shadow-lg hover:from-[#ffe7b3] hover:to-[#e7c27d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]">
            Start Lessons
          </button>
        </div>

        <div className="flex items-start gap-4">
          <img
            src="public/assets/img/anna-rudolf.jpg"
            alt="Anna Rudolf"
            className="w-16 h-16 object-cover rounded-md border border-[#c29d5d]/40 bg-[#232526] shadow"
          />
          <div className="text-sm">
            <p className="mb-1 italic text-gray-200">
              "Chess.com lessons make it easy to learn to play, then challenge you to continue growing."
            </p>
            <p className="text-gray-300">
              <span className="bg-red-600 px-1 py-0.5 rounded text-xs font-semibold mr-1">IM</span>
              Anna Rudolf
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
