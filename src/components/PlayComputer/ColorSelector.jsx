import React from 'react';
import { motion } from 'framer-motion';

export default function ColorSelector({ selectedColor, onSelectColor }) {
  const options = [
    { id: 'w', label: 'Brancas', icon: '♔', bgClass: 'bg-white text-gray-900' },
    { id: 'random', label: 'Aleatório', icon: '🎲', bgClass: 'bg-gradient-to-r from-white to-gray-800 text-gray-600' },
    { id: 'b', label: 'Pretas', icon: '♚', bgClass: 'bg-gray-800 text-white' },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {options.map(option => (
        <motion.button
          key={option.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectColor(option.id)}
          className={`
            flex-1 flex flex-col items-center gap-0.5 p-2 rounded-lg transition-all
            ${option.bgClass}
            ${selectedColor === option.id 
              ? 'ring-2 ring-gold shadow-lg shadow-gold/20' 
              : 'opacity-60 hover:opacity-100'
            }
          `}
        >
          <span className="text-xl">{option.icon}</span>
          <span className="text-[10px] font-medium">{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
