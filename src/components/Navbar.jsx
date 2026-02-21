// components/Navbar.jsx
import React, { useState, useRef, useEffect, memo, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Menu, X, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = memo(() => {
  const { user, profile, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  // Fecha o menu mobile quando a tela fica maior que 1024px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setOpenMobileSubmenu(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoize menu items to prevent recreation
  const playMenuItems = useMemo(() => [
    { icon: '♟️', text: 'Jogar', href: '/play' },
    { icon: '🤖', text: 'Jogar com Bots', href: '/play-computer' },
    { icon: '🧔', text: 'Jogar contra o Treinador', href: '/play/trainer' },
    { icon: '🏅', text: 'Torneios', href: '/tournaments' },
    { icon: '🎲', text: '4 Jogadores e Variantes', href: '/variants' },
    { icon: '📊', text: 'Tabela de classificação', href: '/ranking' },
    { icon: '📜', text: 'Histórico de Partidas', href: '/history' }
  ], []);

  const puzzleMenuItems = useMemo(() => [
    { icon: '🧠', text: 'Problemas', href: '/puzzles/problems' },
    { icon: '🧩', text: 'Corrida de Problemas', href: '/puzzles/rush' },
    { icon: '⚔️', text: 'Batalha de Problemas', href: '/puzzles/battle' },
    { icon: '📅', text: 'Problema Diário', href: '/puzzles/daily' },
    { icon: '📘', text: 'Problemas Personalizados', href: '/puzzles/custom' }
  ], []);

  const learnMenuItems = useMemo(() => [
    { icon: '📘', text: 'Aulas', href: '/learn/lessons' },
    { icon: '📖', text: 'Cursos', href: '/learn/courses' },
    { icon: '🧔', text: 'Jogar contra o Treinador', href: '/learn/trainer' },
    { icon: '📚', text: 'Aberturas', href: '/learn/openings' },
    { icon: '📂', text: 'Biblioteca de Aulas', href: '/learn/library' },
    { icon: '📊', text: 'Análise', href: '/learn/analysis' },
    { icon: '🏫', text: 'Sala de Aula', href: '/learn/classroom' },
    { icon: '💡', text: 'Ideias Críticas', href: '/learn/critical-ideas' },
    { icon: '🏁', text: 'Finais', href: '/learn/endgames' },
    { icon: '🎯', text: 'Praticar', href: '/learn/practice' }
  ], []);

  const watchMenuItems = useMemo(() => [
    { icon: '📺', text: 'Ao Vivo', href: '/watch', highlight: true },
    { icon: '🏆', text: 'Eventos', href: '/watch/events' },
    { icon: '📺', text: 'ChessTV', href: '/watch/chesstv' },
    { icon: '🎙️', text: 'Streamers', href: '/watch/streamers' },
    { icon: '♟️', text: 'Jogando Agora', href: '/watch/playing-now' }
  ], []);

  const newsMenuItems = useMemo(() => [
    { icon: '📡', text: 'Chess Today', href: '/news/chess-today' },
    { icon: '📰', text: 'Notícias', href: '/news' },
    { icon: '📄', text: 'Artigos', href: '/news/articles' },
    { icon: '👑', text: 'Melhores Jogadores', href: '/news/top-players' },
    { icon: '📊', text: 'Rankings de Xadrez', href: '/news/rankings' }
  ], []);

  const socialMenuItems = useMemo(() => [
    { icon: '👥', text: 'Amigos', href: '/social/friends' },
    { icon: '🏰', text: 'Clubes', href: '/social/clubs' },
    { icon: '💬', text: 'Fóruns', href: '/social/forums' },
    { icon: '🌍', text: 'Membros', href: '/social/members' },
    { icon: '📝', text: 'Blogs', href: '/social/blogs' },
    { icon: '🧑‍🏫', text: 'Treinadores', href: '/social/coaches' }
  ], []);

  const maisMenuItems = useMemo(() => [
    { icon: '📚', text: 'Aberturas', href: '/mais/aberturas' },
    { icon: '🏛️', text: 'Biblioteca', href: '/mais/biblioteca' },
    { icon: '🧭', text: 'Explorador', href: '/mais/explorador' },
    { icon: '♟️', text: 'Xadrez Solo', href: '/mais/xadrez-solo' },
    { icon: '📱', text: 'Aplicativos', href: '/mais/apps' }
  ], []);

  const navItems = useMemo(() => [
    { label: '🎮 Jogar', dropdown: 'play', href: '/play' },
    { label: '🧩 Puzzles', dropdown: 'puzzle', href: '/puzzle-chess' },
    { label: '📘 Learn', dropdown: 'learn', href: '/learn' },
    { label: '👀 Watch', dropdown: 'watch', href: '/chess-events' },
    { label: '📰 News', dropdown: 'news', href: '/chessnews' },
    { label: '👥 Social', dropdown: 'social', href: '/social' },
    { label: 'Mais', dropdown: 'mais', href: '/mais' }
  ], []);

  const getMenuList = useCallback((dropdown) => {
    switch (dropdown) {
      case 'play': return playMenuItems;
      case 'puzzle': return puzzleMenuItems;
      case 'learn': return learnMenuItems;
      case 'watch': return watchMenuItems;
      case 'news': return newsMenuItems;
      case 'social': return socialMenuItems;
      case 'mais': return maisMenuItems;
      default: return [];
    }
  }, [playMenuItems, puzzleMenuItems, learnMenuItems, watchMenuItems, newsMenuItems, socialMenuItems, maisMenuItems]);

  // Dropdown delay logic
  const dropdownTimeoutRef = useRef(null);
  
  const handleDropdownEnter = useCallback((key) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setOpenDropdown(key);
  }, []);
  
  const handleDropdownLeave = useCallback(() => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
      dropdownTimeoutRef.current = null;
    }, 180);
  }, []);

  const toggleMobileSubmenu = useCallback((dropdown) => {
    setOpenMobileSubmenu(prev => prev === dropdown ? null : dropdown);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setUserMenuOpen(false);
    window.location.href = '/';
  }, [signOut]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // Breakpoint: 1024px (lg) - Menu desktop aparece, hamburger desaparece
  return (
    <motion.nav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full bg-gradient-to-r from-surface-secondary via-surface-primary to-surface-secondary 
                 px-3 sm:px-4 lg:px-6 xl:px-10 py-2 sm:py-3 
                 shadow-lg sticky top-0 z-50 border-b border-gold/30"
    >
      <div className="flex items-center justify-between w-full max-w-[1920px] mx-auto">
        
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a href="/" className="flex items-center gap-2">
            <img 
              src="/assets/logo.png" 
              alt="Logo" 
              className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full border border-gold" 
            />
            <img 
              src="/assets/oitoporoito.png" 
              alt="OitoPorOito" 
              className="h-6 sm:h-7 lg:h-8 object-contain hidden sidebar:block" 
            />
          </a>
        </div>

        {/* Menu Desktop - Visível apenas em telas >= 1024px */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-3">
          {navItems.map((item) => {
            const menuList = getMenuList(item.dropdown);
            const isOpen = openDropdown === item.dropdown;
            
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(item.dropdown)}
                onMouseLeave={handleDropdownLeave}
              >
                <a
                  href={item.href}
                  className="flex items-center gap-1 cursor-pointer px-2 xl:px-3 py-2 rounded-lg font-semibold text-xs xl:text-sm
                             bg-gradient-to-r from-surface-secondary to-surface-tertiary shadow-md 
                             border border-gold/30 hover:border-gold/60 hover:text-gold 
                             hover:scale-105 transition-all duration-200 whitespace-nowrap"
                >
                  {item.label}
                  <ChevronDown 
                    size={12} 
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </a>

                {/* Dropdown Desktop */}
                <AnimatePresence>
                  {isOpen && menuList.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-56 xl:w-64 bg-surface-primary border border-gold/30 rounded-xl shadow-2xl p-2 z-50"
                    >
                      {menuList.map((sub) => (
                        <a
                          key={sub.text}
                          href={sub.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                                     hover:bg-surface-tertiary hover:text-gold transition-colors
                                     ${sub.highlight ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300' : ''}`}
                        >
                          <span>{sub.icon}</span>
                          <span>{sub.text}</span>
                          {sub.highlight && (
                            <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          )}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Search + Auth Desktop + Hamburger Mobile/Tablet */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop: Search + Auth - Visível apenas em telas >= 1024px */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-9 pr-3 py-1.5 rounded-lg bg-surface-tertiary text-white w-24 xl:w-32 2xl:w-40
                           focus:ring-2 focus:ring-gold focus:outline-none text-sm placeholder:text-text-muted"
              />
            </div>
            {user ? (
              /* User Menu when logged in */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg bg-surface-tertiary border border-gold/30 
                             hover:border-gold/60 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gold bg-surface-secondary">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                        👤
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gold hidden xl:block">
                    {profile?.display_name || profile?.username || 'User'}
                  </span>
                  <ChevronDown size={14} className={`text-gold transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-surface-primary border border-gold/30 rounded-xl shadow-2xl p-2 z-50"
                    >
                      <a
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-surface-tertiary hover:text-gold transition-colors"
                      >
                        <User size={16} />
                        <span>Meu Perfil</span>
                      </a>
                      <a
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-surface-tertiary hover:text-gold transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                      </a>
                      <a
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-surface-tertiary hover:text-gold transition-colors"
                      >
                        <Settings size={16} />
                        <span>Configurações</span>
                      </a>
                      <div className="border-t border-gold/20 my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-red-500/20 hover:text-red-400 transition-colors w-full text-left"
                      >
                        <LogOut size={16} />
                        <span>Sair</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Sign Up / Log In buttons when not logged in */
              <>
                <a href="/signup">
                  <button className="bg-gradient-to-r from-gold-light to-gold text-black py-1.5 px-3 xl:px-4 
                                     rounded-lg font-bold hover:scale-105 transition-transform text-xs xl:text-sm">
                    Sign Up
                  </button>
                </a>
                <a href="/login">
                  <button className="bg-gradient-to-r from-surface-secondary to-surface-tertiary text-white py-1.5 px-3 xl:px-4 
                                     rounded-lg font-bold border border-gold/50 hover:scale-105 
                                     transition-transform text-xs xl:text-sm">
                    Log In
                  </button>
                </a>
              </>
            )}
          </div>

          {/* Mobile/Tablet: Hamburger - Visível apenas em telas < 1024px */}
          <button
            className="flex lg:hidden flex-col justify-center items-center w-10 h-10 rounded-lg
                       bg-surface-secondary border border-gold/40 hover:bg-surface-tertiary transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={20} className="text-gold" />
            ) : (
              <Menu size={20} className="text-gold" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu - Visível apenas em telas < 1024px quando aberto */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-2 pt-4 pb-2 max-h-[calc(100vh-80px)] overflow-y-auto">
              {/* Mobile Search */}
              <div className="relative mb-2">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-surface-tertiary text-white 
                             focus:ring-2 focus:ring-gold focus:outline-none placeholder:text-text-muted"
                />
              </div>
              
              {/* Nav Items Accordion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const menuList = getMenuList(item.dropdown);
                  const isSubmenuOpen = openMobileSubmenu === item.dropdown;
                  
                  return (
                    <div key={item.label} className="flex flex-col">
                      <button
                        onClick={() => toggleMobileSubmenu(item.dropdown)}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl font-bold 
                                   bg-gradient-to-r from-surface-secondary to-surface-tertiary 
                                   border border-gold/30 hover:bg-surface-tertiary hover:text-gold 
                                   transition-colors text-left text-sm"
                      >
                        <span>{item.label}</span>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 flex-shrink-0 ${isSubmenuOpen ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {isSubmenuOpen && menuList.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2 space-y-1">
                              {menuList.map((sub) => (
                                <a
                                  key={sub.text}
                                  href={sub.href}
                                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
                                             bg-surface-primary hover:bg-surface-tertiary hover:text-gold 
                                             transition-colors"
                                  onClick={closeMobileMenu}
                                >
                                  <span>{sub.icon}</span>
                                  <span>{sub.text}</span>
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Auth Buttons Mobile */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gold/20">
                {user ? (
                  <>
                    <a href="/profile" className="flex-1">
                      <button className="w-full bg-gradient-to-r from-gold-light to-gold text-black 
                                         py-3 rounded-xl font-bold hover:scale-105 transition-transform text-sm">
                        Meu Perfil
                      </button>
                    </a>
                    <button 
                      onClick={handleSignOut}
                      className="flex-1 bg-gradient-to-r from-surface-secondary to-surface-tertiary text-white 
                                 py-3 rounded-xl font-bold border border-gold/50 
                                 hover:scale-105 transition-transform text-sm"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <a href="/signup" className="flex-1">
                      <button className="w-full bg-gradient-to-r from-gold-light to-gold text-black 
                                         py-3 rounded-xl font-bold hover:scale-105 transition-transform text-sm">
                        Sign Up
                      </button>
                    </a>
                    <a href="/login" className="flex-1">
                      <button className="w-full bg-gradient-to-r from-surface-secondary to-surface-tertiary text-white 
                                         py-3 rounded-xl font-bold border border-gold/50 
                                         hover:scale-105 transition-transform text-sm">
                        Log In
                      </button>
                    </a>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
