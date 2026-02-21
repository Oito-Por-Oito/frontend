import React from 'react';
import { FaFileAlt, FaPlay, FaYoutube, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { Card } from "@/components/ui";

const NEWS_ITEMS = [
  { icon: <FaFileAlt />, text: 'Notícia 1' },
  { icon: <FaPlay />, text: 'Notícia 2' },
  { icon: <FaFileAlt />, text: 'Notícia 3' },
];

const SOCIAL_MEDIA = [
  { icon: <FaYoutube />, color: 'bg-red-600', count: '85,631' },
  { icon: <FaInstagram />, color: 'bg-pink-500', count: '26,651' },
  { icon: <FaTwitter />, color: 'bg-blue-500', count: '12,064' },
  { icon: <FaFacebook />, color: 'bg-blue-700', count: '47,153' },
];

/**
 * RecentNews - Widget de notícias recentes e redes sociais
 */
export default function RecentNews({ newsItems = NEWS_ITEMS, socialMedia = SOCIAL_MEDIA }) {
  return (
    <Card variant="gradient" className="w-full max-w-xs border border-gold/40">
      <h2 className="text-xl font-bold mb-4 text-gold-light drop-shadow flex items-center gap-2">
        📰 Últimas Notícias
      </h2>
      
      <ul className="space-y-3 text-base">
        {newsItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-3 bg-surface-secondary/70 border border-gold/20 rounded-lg px-3 py-2 shadow hover:bg-surface-tertiary transition-all cursor-pointer"
          >
            <span className="text-gold-light text-lg">{item.icon}</span>
            <span className="truncate font-semibold text-foreground">{item.text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <h3 className="text-md font-semibold text-gold mb-2">Redes Sociais</h3>
        <div className="flex justify-between flex-wrap gap-2">
          {socialMedia.map((media, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-1">
              <div
                className={`w-10 h-10 flex items-center justify-center shadow rounded-full ${media.color}`}
              >
                {media.icon}
              </div>
              <span className="text-xs font-bold text-gold-light">{media.count}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
