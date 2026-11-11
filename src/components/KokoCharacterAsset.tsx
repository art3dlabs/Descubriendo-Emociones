import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KokoSpriteAnimator } from './KokoSpriteAnimator';

interface KokoCharacterAssetProps {
  isSpeaking?: boolean;
  expression?: 'happy' | 'thinking' | 'excited' | 'mischievous' | 'surprised';
  className?: string;
  size?: number;
  showHoloGlow?: boolean;
  showPedestal?: boolean;
  onClick?: () => void;
  interactive?: boolean;
}

/**
 * KokoCharacterAsset: Sprite-based animated game show host.
 * Completely replaces legacy SVG vector rig with lightweight, fluid sprite animation
 * matching the authentic character appearance without SVG errors.
 */
export const KokoCharacterAsset: React.FC<KokoCharacterAssetProps> = ({
  isSpeaking = false,
  expression = 'happy',
  className = '',
  size = 280,
  showPedestal = true,
  onClick,
}) => {
  const getActionFromExpression = () => {
    if (isSpeaking) return 'talk';
    switch (expression) {
      case 'excited':
        return 'celebrate';
      case 'mischievous':
        return 'point';
      case 'surprised':
        return 'jump';
      case 'thinking':
        return 'present';
      case 'happy':
      default:
        return 'idle';
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <KokoSpriteAnimator
        size={size}
        isSpeaking={isSpeaking}
        action={getActionFromExpression()}
        showPedestal={showPedestal}
        onClick={onClick}
      />
    </div>
  );
};
