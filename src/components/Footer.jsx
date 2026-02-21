// components/Footer.jsx
import React from 'react';
import {
  FaApple,
  FaAndroid,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
  FaTwitch,
  FaInstagram,
  FaDiscord,
} from 'react-icons/fa6';
import { motion } from "framer-motion";

const socialIcons = [
  { Icon: FaApple, label: "Apple" },
  { Icon: FaAndroid, label: "Android" },
  { Icon: FaTiktok, label: "TikTok" },
  { Icon: FaXTwitter, label: "X/Twitter" },
  { Icon: FaYoutube, label: "YouTube" },
  { Icon: FaTwitch, label: "Twitch" },
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaDiscord, label: "Discord" },
];

const links = [
  "Suporte", "Idioma", "Vagas", "Desenvolvedores",
  "Contrato de Usuário", "Política de privacidade",
  "Jogo Limpo", "Parceiros"
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-gradient-to-r from-surface-secondary via-surface-primary to-surface-secondary 
                 text-text-secondary py-6 sm:py-8 lg:py-10 px-4 sm:px-6 
                 flex flex-col items-center gap-4 sm:gap-6 
                 shadow-xl border-t border-surface-tertiary"
    >
      {/* Logo */}
      <div className="flex justify-center">
        <img 
          src="/assets/logo.png" 
          alt="Logo OitoPorOito" 
          loading="lazy"
          className="h-10 sm:h-12 w-auto drop-shadow-lg rounded-full bg-surface-secondary p-1 border border-gold" 
        />
      </div>

      {/* Links - Responsivo */}
      <nav className="flex flex-wrap justify-center gap-x-2 sm:gap-x-3 gap-y-1.5 text-[10px] sm:text-xs text-text-muted px-2 max-w-4xl">
        {links.map((link, idx) => (
          <span key={link} className="flex items-center whitespace-nowrap">
            <a href="#" className="hover:text-gold transition-colors">{link}</a>
            {idx < links.length - 1 && <span className="mx-1 sm:mx-1.5 text-text-muted/50">•</span>}
          </span>
        ))}
      </nav>

      {/* Copyright */}
      <span className="font-semibold text-gold text-xs sm:text-sm">
        OitoPorOito.com © 2025
      </span>

      {/* Social Icons - Responsivo */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xl sm:text-2xl text-text-secondary">
        {socialIcons.map(({ Icon, label }) => (
          <a 
            key={label}
            href="#"
            aria-label={label}
            className="hover:text-gold hover:scale-110 transition-all cursor-pointer p-1.5 rounded-full
                       hover:bg-surface-tertiary"
          >
            <Icon />
          </a>
        ))}
      </div>
    </motion.footer>
  );
}
