
import React from 'react';
import { motion } from "framer-motion";

const newsItems = [
  {
    title: "Humpy Wins On Demand, Advances To All-Indian Final",
    image: "https://images.chesscomfiles.com/uploads/v1/news/1732304.fca0db19.507x286o.5eb38d7a6f9a.png", // Substitua pelas imagens corretas
    author: "AnthonyLevin",
    tag: "NM",
  },
  {
    title: "Fedoseev Edges Out Aravindh On Tiebreaks To Win Biel Masters",
    image: "https://images.chesscomfiles.com/uploads/v1/news/1732480.a06d3a3f.507x286o.b44b9e5ecba7.png",
    author: "PeterDoggers",
    tag: null,
  },
  {
    title: "Yes, You Can Use The Engine To Improve—And Other Tips From A Data-Focused Coach",
    image: "https://images.chesscomfiles.com/uploads/v1/article/32210.36ebf22b.507x286o.33177f6dd4e2.png",
    author: "NathanielGreen",
    tag: "FM",
  },
  {
    title: "Rare Fourth Moves",
    image: "https://images.chesscomfiles.com/uploads/v1/video/9851.202e2ac5.507x286o.8bdc6c84f09d.png",
    author: "JanistanTV",
    tag: "GM",
  },
];

export default function ChessNewsGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-gradient-to-r from-[#232526] via-[#1a1a1a] to-[#232526] text-white p-4 sm:p-6 md:p-10 rounded-2xl max-w-4xl w-full mx-auto border-t-2 border-b-2 border-[#c29d5d]/30 shadow-xl"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#e7c27d] drop-shadow">
        Follow what’s happening in Chess Today.
      </h2>

      {/* Grid de notícias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
        {newsItems.map((item, index) => (
          <div key={index} className="flex flex-col bg-[#232526]/60 rounded-xl shadow-lg border border-[#c29d5d]/20 p-2 md:p-3 hover:scale-[1.025] transition-all duration-200">
            <img
              src={item.image}
              alt={item.title}
              className="rounded-md w-full object-cover border border-[#c29d5d]/20 shadow"
            />
            <p className="text-base mt-3 font-semibold text-white">{item.title}</p>
            <p className="text-sm text-gray-400 mt-1">
              {item.tag && (
                <span className="bg-red-600 text-white text-xs px-1 py-0.5 rounded mr-2 font-bold">
                  {item.tag}
                </span>
              )}
              {item.author}
            </p>
          </div>
        ))}
      </div>

      {/* Botão final */}
      <div className="flex justify-center">
        <button className="bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black font-bold px-6 py-2 rounded-xl shadow-lg hover:from-[#ffe7b3] hover:to-[#e7c27d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]">
          Chess Today
        </button>
      </div>
    </motion.div>
  );
}
