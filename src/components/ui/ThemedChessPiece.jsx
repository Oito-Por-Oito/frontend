import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { usePieceTheme } from '@/contexts/PieceThemeContext';

/**
 * Mapeamento de peças para arquivos de imagem (tema clássico)
 */
const CLASSIC_PIECE_MAP = {
  bK: 'bK.png', bQ: 'bQ.png', bR: 'bR.png',
  bN: 'bN.png', bB: 'bB.png', bP: 'bP.png',
  wK: 'wK.png', wQ: 'wQ.png', wR: 'wR.png',
  wN: 'wN.png', wB: 'wB.png', wP: 'wP.png',
};

/**
 * Símbolos Unicode para peças (tema minimalista)
 */
const UNICODE_PIECES = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

/**
 * Tamanhos predefinidos
 */
const SIZE_CLASSES = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10 md:w-12 md:h-12',
  lg: 'w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16',
  xl: 'w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20',
};

const FONT_SIZES = {
  sm: 'text-2xl',
  md: 'text-3xl md:text-4xl',
  lg: 'text-4xl md:text-5xl lg:text-6xl',
  xl: 'text-5xl md:text-6xl lg:text-7xl',
};

/**
 * SVG paths para peças modernas
 */
const ModernPieceSVG = memo(({ type, color, size }) => {
  const isWhite = color === 'w';
  const fillColor = isWhite ? '#FFFFFF' : '#1a1a1a';
  const strokeColor = isWhite ? '#333333' : '#c29d5d';
  
  const sizeMap = { sm: 32, md: 48, lg: 56, xl: 64 };
  const svgSize = sizeMap[size] || 48;

  const paths = {
    k: (
      <g>
        <path d="M22.5 11.63V6M20 8h5" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <path d="M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <path d="M12.5 30c5.5-3 14.5-3 20 0M12.5 33.5c5.5-3 14.5-3 20 0M12.5 37c5.5-3 14.5-3 20 0" stroke={strokeColor} strokeWidth="1.5" />
      </g>
    ),
    q: (
      <g>
        <circle cx="6" cy="12" r="2.75" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="14" cy="9" r="2.75" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="22.5" cy="8" r="2.75" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="31" cy="9" r="2.75" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="39" cy="12" r="2.75" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-3.5-7-5 8.5-5-8.5-3.5 7-7.5-11L9 26z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <path d="M11 38.5a35 35 1 0023 0" fill="none" stroke={strokeColor} strokeWidth="1.5" />
        <path d="M11 29a35 35 1 0023 0M12.5 31.5h20M11.5 34.5a35 35 1 0022 0" fill="none" stroke={strokeColor} strokeWidth="1.5" />
      </g>
    ),
    r: (
      <g>
        <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M34 14l-3 3H14l-3-3" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <path d="M31 17v12.5H14V17" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <path d="M11 14h23" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="miter" />
      </g>
    ),
    b: (
      <g>
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="22.5" cy="10.5" r="2.5" fill={isWhite ? strokeColor : fillColor} />
        <path d="M17.5 26h10M15 30h15" fill="none" stroke={strokeColor} strokeWidth="1.5" />
      </g>
    ),
    n: (
      <g>
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="9.5" cy="25.5" r="0.5" fill={strokeColor} />
        <circle cx="15" cy="15.5" r="0.5" fill={strokeColor} />
        <path d="M24.55 10.4l-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34-2.37-4.49-5.79-6.64-9.19-7.16l-.51-.1z" fill={strokeColor} />
      </g>
    ),
    p: (
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
    ),
  };

  return (
    <svg 
      viewBox="0 0 45 45" 
      width={svgSize} 
      height={svgSize}
      className="drop-shadow-[2px_3px_3px_rgba(0,0,0,0.4)]"
    >
      {paths[type]}
    </svg>
  );
});

ModernPieceSVG.displayName = 'ModernPieceSVG';

/**
 * Componente de peça com suporte a temas
 */
function ThemedChessPiece({ 
  piece, 
  size = 'md', 
  animated = false,
  layoutId,
  shadow = true,
  className = '',
  themeOverride,
}) {
  const pieceTheme = usePieceTheme();
  const currentTheme = themeOverride || pieceTheme?.theme || 'classic';

  if (!piece || !piece.type || !piece.color) return null;

  const key = piece.color + piece.type.toUpperCase();
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const shadowClass = shadow ? 'drop-shadow-[2px_3px_3px_rgba(0,0,0,0.4)]' : '';

  // Tema Clássico - Imagens PNG
  if (currentTheme === 'classic') {
    const imagePath = CLASSIC_PIECE_MAP[key];
    if (!imagePath) return null;

    const commonProps = {
      src: `/assets/pieces/${imagePath}`,
      alt: key,
      className: `${sizeClass} ${shadowClass} pointer-events-none select-none ${className}`,
      draggable: false,
      style: { maxWidth: '98%', maxHeight: '98%' },
    };

    if (animated) {
      return (
        <motion.img
          {...commonProps}
          layoutId={layoutId}
          initial={{ opacity: 0.6, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        />
      );
    }

    return <img {...commonProps} />;
  }

  // Tema Moderno - SVGs
  if (currentTheme === 'modern') {
    const Wrapper = animated ? motion.div : 'div';
    const motionProps = animated ? {
      layoutId,
      initial: { opacity: 0.6, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      transition: { duration: 0.2 },
    } : {};

    return (
      <Wrapper 
        className={`${sizeClass} flex items-center justify-center pointer-events-none select-none ${className}`}
        {...motionProps}
      >
        <ModernPieceSVG type={piece.type} color={piece.color} size={size} />
      </Wrapper>
    );
  }

  // Tema Minimalista - Unicode
  if (currentTheme === 'minimalist') {
    const unicode = UNICODE_PIECES[key];
    if (!unicode) return null;

    const fontSize = FONT_SIZES[size] || FONT_SIZES.md;
    const isWhite = piece.color === 'w';
    
    const Wrapper = animated ? motion.span : 'span';
    const motionProps = animated ? {
      layoutId,
      initial: { opacity: 0.6, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      transition: { duration: 0.2 },
    } : {};

    return (
      <Wrapper
        className={`
          ${sizeClass} ${fontSize} flex items-center justify-center 
          pointer-events-none select-none font-serif
          ${isWhite ? 'text-white' : 'text-gray-900'}
          ${shadow ? 'drop-shadow-[1px_2px_2px_rgba(0,0,0,0.5)]' : ''}
          ${className}
        `}
        style={{ 
          WebkitTextStroke: isWhite ? '1px #333' : '1px #c29d5d',
          lineHeight: 1,
        }}
        {...motionProps}
      >
        {unicode}
      </Wrapper>
    );
  }

  return null;
}

export default memo(ThemedChessPiece);
