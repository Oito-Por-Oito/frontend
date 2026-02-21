// components/Navbar.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Estados de abertura dos dropdowns
  const [playOpen, setPlayOpen] = useState(false);
  const [puzzleOpen, setPuzzleOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [watchOpen, setWatchOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [maisOpen, setMaisOpen] = useState(false);

  // Submenus
  const playMenuItems = [
    { icon: '♟️', text: 'Jogar', href: '/play' },
    { icon: '🤖', text: 'Jogar com Bots', href: '/play-computer' },
    { icon: '🧔', text: 'Jogar contra o Treinador', href: '/play/trainer' },
    { icon: '🏅', text: 'Torneios', href: '/tournaments' },
    { icon: '🎲', text: '4 Jogadores e Variantes', href: '/variants' },
    { icon: '📊', text: 'Tabela de classificação', href: '/ranking' },
    { icon: '📜', text: 'Histórico de Partidas', href: '/history' }
  ];

  const puzzleMenuItems = [
    { icon: '🧠', text: 'Problemas', href: '/puzzles/problems' },
    { icon: '🧩', text: 'Corrida de Problemas', href: '/puzzles/rush' },
    { icon: '⚔️', text: 'Batalha de Problemas', href: '/puzzles/battle' },
    { icon: '📅', text: 'Problema Diário', href: '/puzzles/daily' },
    { icon: '📘', text: 'Problemas Personalizados', href: '/puzzles/custom' }
  ];

  const learnMenuItems = [
    { icon: '📘', text: 'Aulas', href: '/learn/lessons' },
    { icon: '📖', text: 'Cursos', href: '/learn/courses' },
    { icon: '🧔', text: 'Jogar contra o Treinador', href: '/learn/trainer' },
    { icon: '📚', text: 'Aberturas', href: '/learn/openings' },
    { icon: '📂', text: 'Biblioteca de Aulas', href: '/learn/library' },
    { icon: '📊', text: 'Análise', href: '/learn/analysis' },
    { icon: '🏫', text: 'Sala de Aula', href: '/learn/classroom' },
    { icon: '💡', text: 'Ideias Críticas', href: '/learn/critical-ideas' },
    { icon: '🏁', text: 'Finais', href: '/learn/endgames' },
    { icon: '🎯', text: 'Praticar', href: '/learn/practice' },
    { icon: '🎯', text: 'Treinamento do Aimchess', href: '/learn/aimchess-training' }
  ];

  const watchMenuItems = [
    { icon: '🏆', text: 'Eventos', href: '/watch/events' },
    { icon: '📺', text: 'ChessTV', href: '/watch/chesstv' },
    { icon: '🎙️', text: 'Streamers', href: '/watch/streamers' },
    { icon: '♟️', text: 'Jogando Agora', href: '/watch/playing-now' }
  ];

  const newsMenuItems = [
    { icon: '📡', text: 'Chess Today', href: '/news/chess-today' },
    { icon: '📰', text: 'Notícias', href: '/news' },
    { icon: '📄', text: 'Artigos', href: '/news/articles' },
    { icon: '👑', text: 'Melhores Jogadores', href: '/news/top-players' },
    { icon: '📊', text: 'Rankings de Xadrez', href: '/news/rankings' }
  ];

  const socialMenuItems = [
    { icon: '👥', text: 'Amigos', href: '/social/friends' },
    { icon: '🏰', text: 'Clubes', href: '/social/clubs' },
    { icon: '💬', text: 'Fóruns', href: '/social/forums' },
    { icon: '🌍', text: 'Membros', href: '/social/members' },
    { icon: '📝', text: 'Blogs', href: '/social/blogs' },
    { icon: '🧑‍🏫', text: 'Treinadores', href: '/social/coaches' }
  ];

  const maisMenuItems = [
    { icon: '📚', text: 'Aberturas', href: '/mais/aberturas' },
    { icon: '🏛️', text: 'Biblioteca', href: '/mais/biblioteca' },
    { icon: '🧭', text: 'Explorador', href: '/mais/explorador' },
    { icon: '♟️', text: 'Xadrez Solo', href: '/mais/xadrez-solo' },
    { icon: '👁️', text: 'Visão', href: '/mais/visao' },
    { icon: '✅', text: 'Xadrez por Votação', href: '/mais/xadrez-por-votacao' },
    { icon: '📱', text: 'Aplicativos de Celular', href: '/mais/apps' },
    { icon: '🧒', text: 'ChessKid', href: '/mais/chesskid' }
  ];

  const navItems = [
    { label: '🎮 Jogar', dropdown: 'play', href: '/play' },
    { label: '🧩 Puzzles', dropdown: 'puzzle', href: '/puzzle-chess' },
    { label: '📘 Learn', dropdown: 'learn', href: '/learn' },
    { label: '👀 Watch', dropdown: 'watch', href: '/chess-events' },
    { label: '📰 News', dropdown: 'news', href: '/chessnews' },
    { label: '👥 Social', dropdown: 'social', href: '/social' },
    { label: 'Mais', dropdown: 'mais', href: '/mais' }
  ];


  // Dropdown delay logic por dropdown
  const dropdownTimeoutRef = useRef({});
  const handleDropdownEnter = (key, setOpen) => {
    if (dropdownTimeoutRef.current[key]) {
      clearTimeout(dropdownTimeoutRef.current[key]);
      dropdownTimeoutRef.current[key] = null;
    }
    setOpen(true);
  };
  const handleDropdownLeave = (key, setOpen) => {
    if (dropdownTimeoutRef.current[key]) {
      clearTimeout(dropdownTimeoutRef.current[key]);
    }
    dropdownTimeoutRef.current[key] = setTimeout(() => {
      setOpen(false);
      dropdownTimeoutRef.current[key] = null;
    }, 180);
  };

  const renderDropdown = (item, menuList, setOpen, isOpen) => (
    <div
      key={item.label}
      className="relative"
      style={{ display: 'inline-block' }}
      onMouseEnter={() => handleDropdownEnter(item.label, setOpen)}
      onMouseLeave={() => handleDropdownLeave(item.label, setOpen)}
    >
      <a
        href={item.href}
        className="flex items-center gap-2 cursor-pointer px-3 md:px-4 py-1.5 md:py-2 rounded-xl font-bold 
                   bg-gradient-to-r from-[#232526] to-[#2d2d2d] shadow-lg 
                   border-2 border-[#c29d5d]/40 hover:from-[#444] hover:to-[#232526] 
                   hover:text-[#c29d5d] hover:scale-105 transition-all duration-200"
        onClick={() => setOpen(false)}
      >
        {item.label}
      </a>

      {/* Dropdown is part of the same wrapper, so mouse can move between button and dropdown without closing */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 mt-2 w-64 bg-[#1a1a1a] border border-[#c29d5d]/30 rounded-xl shadow-lg p-2 z-50"
        >
          {menuList.map((sub) => (
            <a
              key={sub.text}
              href={sub.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg 
                         hover:bg-[#333] hover:text-[#c29d5d] transition-colors"
              onClick={() => setOpen(false)}
            >
              <span>{sub.icon}</span>
              <span>{sub.text}</span>
            </a>
          ))}
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.nav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="w-full bg-gradient-to-r from-[#232526] via-[#121212] to-[#232526] 
                 px-2 sm:px-4 md:px-10 py-2 sm:py-3 md:py-4 
                 shadow-lg sticky top-0 z-20 border-b border-[#c29d5d]/30"
    >
      <div className="flex items-center justify-between w-full">
        {/* Esquerda - Logo */}
        <div className="flex items-center gap-2">
          <a href="/">
            <img src="/assets/logo.png" alt="Logo" className="h-10 w-10 rounded-full border border-[#c29d5d]" />
          </a>
          <a href="/">
            <img src="/assets/oitoporoito.png" alt="OitoPorOito" className="h-10 object-contain" />
          </a>
        </div>

        {/* Centro - Menu (desktop) */}
        <div className="hidden lg:flex gap-6">
          {navItems.map((item) => {
            if (item.dropdown === 'play') return renderDropdown(item, playMenuItems, setPlayOpen, playOpen);
            if (item.dropdown === 'puzzle') return renderDropdown(item, puzzleMenuItems, setPuzzleOpen, puzzleOpen);
            if (item.dropdown === 'learn') return renderDropdown(item, learnMenuItems, setLearnOpen, learnOpen);
            if (item.dropdown === 'watch') return renderDropdown(item, watchMenuItems, setWatchOpen, watchOpen);
            if (item.dropdown === 'news') return renderDropdown(item, newsMenuItems, setNewsOpen, newsOpen);
            if (item.dropdown === 'social') return renderDropdown(item, socialMenuItems, setSocialOpen, socialOpen);
            if (item.dropdown === 'mais') return renderDropdown(item, maisMenuItems, setMaisOpen, maisOpen);

            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl font-bold 
                           bg-gradient-to-r from-[#232526] to-[#2d2d2d] shadow-lg 
                           border-2 border-[#c29d5d]/40 hover:from-[#444] hover:to-[#232526] 
                           hover:text-[#c29d5d] hover:scale-105 transition-all duration-200"
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Direita - Busca e Auth (desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <input
            type="text"
            placeholder="Search"
            className="pl-2 pr-2 py-1 rounded-lg bg-[#333] text-white w-32 focus:ring-2 focus:ring-[#c29d5d]"
          />
          <a href="/signup">
            <button className="bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black py-1 px-4 rounded-xl font-bold hover:scale-105">
              Sign Up
            </button>
          </a>
          <a href="/login">
            <button className="bg-gradient-to-r from-[#232526] to-[#2d2d2d] text-white py-1 px-4 rounded-xl font-bold border border-[#c29d5d]/50 hover:scale-105">
              Log In
            </button>
          </a>
        </div>

        {/* Botão Hamburger (mobile) */}
        <button
          className="lg:hidden flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg border border-[#c29d5d]/40 bg-[#232526] hover:bg-[#333] transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <span className={`block w-6 h-0.5 bg-[#c29d5d] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#c29d5d] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#c29d5d] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden mt-3 flex flex-col gap-2 pb-3 border-t border-[#c29d5d]/20 pt-3"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl font-bold 
                         bg-gradient-to-r from-[#232526] to-[#2d2d2d] shadow 
                         border border-[#c29d5d]/30 hover:from-[#444] hover:to-[#232526] 
                         hover:text-[#c29d5d] transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          {/* Auth mobile */}
          <div className="flex gap-2 mt-2 px-1">
            <a href="/signup" className="flex-1">
              <button className="w-full bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black py-2 rounded-xl font-bold hover:scale-105 transition-all">
                Sign Up
              </button>
            </a>
            <a href="/login" className="flex-1">
              <button className="w-full bg-gradient-to-r from-[#232526] to-[#2d2d2d] text-white py-2 rounded-xl font-bold border border-[#c29d5d]/50 hover:scale-105 transition-all">
                Log In
              </button>
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
