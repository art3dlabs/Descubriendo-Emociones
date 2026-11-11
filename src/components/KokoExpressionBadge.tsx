import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type KokoExpression =
  | 'wink'
  | 'laugh'
  | 'shocked'
  | 'smirk'
  | 'thinking'
  | 'happy'
  | 'grin'
  | 'knowing';

const base = import.meta.env.BASE_URL || './';

export const KOKO_EXPRESSIONS: Record<
  KokoExpression,
  {
    src: string;
    label: string;
    emoji: string;
    glow: string;
    border: string;
  }
> = {
  wink: {
    src: `${base}assets/koko_master_sprites/normalized/expr_wink.png`,
    label: 'Guiño Koko',
    emoji: '😉',
    glow: 'rgba(236, 72, 153, 0.5)',
    border: 'border-pink-500',
  },
  laugh: {
    src: `${base}assets/koko_master_sprites/normalized/expr_laugh.png`,
    label: '¡Risa Total!',
    emoji: '😂',
    glow: 'rgba(234, 179, 8, 0.5)',
    border: 'border-amber-400',
  },
  shocked: {
    src: `${base}assets/koko_master_sprites/normalized/expr_shocked.png`,
    label: '¡Qué Momento!',
    emoji: '😲',
    glow: 'rgba(244, 63, 94, 0.6)',
    border: 'border-rose-500',
  },
  smirk: {
    src: `${base}assets/koko_master_sprites/normalized/expr_smirk.png`,
    label: 'Mente Picante',
    emoji: '😏',
    glow: 'rgba(168, 85, 247, 0.5)',
    border: 'border-purple-500',
  },
  thinking: {
    src: `${base}assets/koko_master_sprites/normalized/expr_thinking.png`,
    label: 'Evaluando...',
    emoji: '🤔',
    glow: 'rgba(6, 182, 212, 0.5)',
    border: 'border-cyan-400',
  },
  happy: {
    src: `${base}assets/koko_master_sprites/normalized/expr_happy.png`,
    label: 'Buena Onda',
    emoji: '😊',
    glow: 'rgba(34, 197, 94, 0.5)',
    border: 'border-emerald-400',
  },
  grin: {
    src: `${base}assets/koko_master_sprites/normalized/expr_grin.png`,
    label: 'Pura Sonrisa',
    emoji: '😁',
    glow: 'rgba(249, 115, 22, 0.5)',
    border: 'border-orange-400',
  },
  knowing: {
    src: `${base}assets/koko_master_sprites/normalized/expr_knowing.png`,
    label: 'Ojo Clínico',
    emoji: '🧐',
    glow: 'rgba(99, 102, 241, 0.5)',
    border: 'border-indigo-400',
  },
};

// Preload all expression heads for instant swap
if (typeof window !== 'undefined') {
  Object.values(KOKO_EXPRESSIONS).forEach((exp) => {
    const img = new Image();
    img.src = exp.src;
  });
}

interface KokoExpressionBadgeProps {
  expression: KokoExpression;
  size?: number; // size in px
  showLabel?: boolean;
  onClick?: () => void;
  className?: string;
}

export const KokoExpressionBadge: React.FC<KokoExpressionBadgeProps> = ({
  expression = 'wink',
  size = 72,
  showLabel = true,
  onClick,
  className = '',
}) => {
  const current = KOKO_EXPRESSIONS[expression] || KOKO_EXPRESSIONS.wink;

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center select-none group cursor-pointer ${className}`}
      title={`Expresión de Koko: ${current.label}`}
    >
      <div
        className={`relative rounded-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-2 ${current.border} p-1 transition-all duration-300 group-hover:scale-105 flex items-center justify-center overflow-hidden shadow-xl`}
        style={{
          width: size,
          height: size,
          boxShadow: `0 0 14px ${current.glow}`,
        }}
      >
        {/* Subtle radial sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none rounded-full" />

        <AnimatePresence mode="wait">
          <motion.img
            key={expression}
            src={current.src}
            alt={current.label}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 0.95, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 24 }}
            className="w-full h-full object-contain filter contrast-105 drop-shadow-md"
            draggable={false}
          />
        </AnimatePresence>

        {/* Small Emoji badge tag */}
        <span className="absolute -bottom-0.5 -right-0.5 text-[10px] bg-slate-950 border border-slate-700 rounded-full w-4 h-4 flex items-center justify-center shadow">
          {current.emoji}
        </span>
      </div>

      {showLabel && (
        <span className="mt-1 text-[10px] font-bold text-slate-300 kids-font tracking-wide text-center">
          {current.label}
        </span>
      )}
    </div>
  );
};
