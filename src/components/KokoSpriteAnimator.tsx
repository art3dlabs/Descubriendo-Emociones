import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export type KokoSpriteAction =
  | 'idle'
  | 'talk'
  | 'wave'
  | 'celebrate'
  | 'victory'
  | 'jump'
  | 'run'
  | 'present'
  | 'spin_wheel'
  | 'point'
  | 'crouch'
  | 'applause'
  | 'shh';

export interface KokoSpriteAnimatorProps {
  action?: KokoSpriteAction;
  isSpeaking?: boolean;
  size?: number; // width in pixels
  className?: string;
  onClick?: () => void;
  showPedestal?: boolean;
}

const base = import.meta.env.BASE_URL || './';

// Normalized 220x330 South-anchored master sprites (Ground-level aligned feet!)
export const KOKO_SPRITES = {
  // Standing poses
  welcome_arms: `${base}assets/koko_master_sprites/normalized/clean_welcome_arms.png`,
  open_hands: `${base}assets/koko_master_sprites/normalized/clean_open_hands.png`,
  point_player: `${base}assets/koko_master_sprites/normalized/clean_point_player.png`,
  present_side: `${base}assets/koko_master_sprites/normalized/clean_present_side.png`,
  thumbs_up: `${base}assets/koko_master_sprites/normalized/clean_thumbs_up.png`,
  celebrate_fists: `${base}assets/koko_master_sprites/normalized/clean_celebrate_fists.png`,
  victory_arms: `${base}assets/koko_master_sprites/normalized/clean_victory_arms.png`,
  thinking_standing: `${base}assets/koko_master_sprites/normalized/clean_thinking_standing.png`,

  // Dynamic movement
  run_rush: `${base}assets/koko_master_sprites/normalized/clean_run_rush.png`,
  jump_victory: `${base}assets/koko_master_sprites/normalized/clean_jump_victory.png`,
  lean_curious: `${base}assets/koko_master_sprites/normalized/clean_lean_curious.png`,
  crouch_listen: `${base}assets/koko_master_sprites/normalized/clean_crouch_listen.png`,
  wave_friendly: `${base}assets/koko_master_sprites/normalized/clean_wave_friendly.png`,

  // Walk cycle
  walk1: `${base}assets/koko_master_sprites/normalized/clean_walk_step1.png`,
  walk2: `${base}assets/koko_master_sprites/normalized/clean_walk_step2.png`,
  walk3: `${base}assets/koko_master_sprites/normalized/clean_walk_step3.png`,
  walk4: `${base}assets/koko_master_sprites/normalized/clean_walk_step4.png`,

  // Bust gestures
  bust_applause: `${base}assets/koko_master_sprites/normalized/clean_bust_applause.png`,
  bust_shh: `${base}assets/koko_master_sprites/normalized/clean_bust_shh_secret.png`,
};

// Global cache preloader for instant zero-flicker rendering
if (typeof window !== 'undefined') {
  Object.values(KOKO_SPRITES).forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

export const KokoSpriteAnimator: React.FC<KokoSpriteAnimatorProps> = ({
  action = 'idle',
  isSpeaking = false,
  size = 280,
  className = '',
  onClick,
  showPedestal = true,
}) => {
  const [frameIndex, setFrameIndex] = useState<number>(0);

  // Sequences crafted for smooth storytelling and TV host presence
  const getSequence = (): string[] => {
    if (action === 'spin_wheel') {
      return [
        KOKO_SPRITES.present_side,
        KOKO_SPRITES.lean_curious,
        KOKO_SPRITES.point_player,
        KOKO_SPRITES.present_side,
      ];
    }
    if (action === 'present') {
      return [
        KOKO_SPRITES.welcome_arms,
        KOKO_SPRITES.present_side,
        KOKO_SPRITES.open_hands,
        KOKO_SPRITES.welcome_arms,
      ];
    }
    if (action === 'point') {
      return [
        KOKO_SPRITES.point_player,
        KOKO_SPRITES.lean_curious,
        KOKO_SPRITES.point_player,
      ];
    }
    if (action === 'run') {
      return [
        KOKO_SPRITES.walk1,
        KOKO_SPRITES.walk2,
        KOKO_SPRITES.run_rush,
        KOKO_SPRITES.walk3,
        KOKO_SPRITES.walk4,
      ];
    }
    if (action === 'celebrate') {
      return [
        KOKO_SPRITES.celebrate_fists,
        KOKO_SPRITES.victory_arms,
        KOKO_SPRITES.jump_victory,
        KOKO_SPRITES.thumbs_up,
      ];
    }
    if (action === 'victory') {
      return [
        KOKO_SPRITES.victory_arms,
        KOKO_SPRITES.celebrate_fists,
        KOKO_SPRITES.thumbs_up,
      ];
    }
    if (action === 'applause') {
      return [
        KOKO_SPRITES.bust_applause,
        KOKO_SPRITES.thumbs_up,
        KOKO_SPRITES.celebrate_fists,
      ];
    }
    if (action === 'shh') {
      return [
        KOKO_SPRITES.bust_shh,
        KOKO_SPRITES.lean_curious,
        KOKO_SPRITES.bust_shh,
      ];
    }
    if (action === 'wave') {
      return [
        KOKO_SPRITES.welcome_arms,
        KOKO_SPRITES.wave_friendly,
        KOKO_SPRITES.open_hands,
      ];
    }
    if (action === 'jump') {
      return [
        KOKO_SPRITES.jump_victory,
        KOKO_SPRITES.celebrate_fists,
        KOKO_SPRITES.jump_victory,
      ];
    }
    if (action === 'crouch') {
      return [
        KOKO_SPRITES.crouch_listen,
        KOKO_SPRITES.lean_curious,
        KOKO_SPRITES.point_player,
      ];
    }
    if (isSpeaking || action === 'talk') {
      // Fluid talking gestures without abrupt jumps
      return [
        KOKO_SPRITES.welcome_arms,
        KOKO_SPRITES.open_hands,
        KOKO_SPRITES.point_player,
        KOKO_SPRITES.present_side,
      ];
    }
    // Default Idle: smooth breathing and natural charisma
    return [
      KOKO_SPRITES.welcome_arms,
      KOKO_SPRITES.welcome_arms,
      KOKO_SPRITES.open_hands,
      KOKO_SPRITES.welcome_arms,
    ];
  };

  const sequence = getSequence();

  useEffect(() => {
    setFrameIndex(0);
    // Smooth frame durations preventing rapid flickering
    const speed =
      action === 'run'
        ? 180
        : action === 'spin_wheel'
        ? 350
        : isSpeaking
        ? 420
        : action === 'celebrate'
        ? 380
        : 750;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % sequence.length);
    }, speed);

    return () => clearInterval(interval);
  }, [action, isSpeaking, sequence.length]);

  const currentFrame = sequence[frameIndex % sequence.length] || KOKO_SPRITES.welcome_arms;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-end select-none group cursor-pointer ${className}`}
      style={{ width: size, height: size * 1.25 }}
    >
      {/* 3D Holographic Stage Pedestal */}
      {showPedestal && (
        <div className="absolute bottom-1 w-4/5 h-10 pointer-events-none flex items-center justify-center z-0">
          <div className="w-full h-8 rounded-[100%] bg-gradient-to-r from-pink-500/25 via-cyan-400/35 to-purple-500/25 blur-md transform scale-y-50" />
          <div className="absolute w-3/4 h-5 rounded-[100%] bg-slate-950/80 border-2 border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.6)] transform scale-y-60" />
        </div>
      )}

      {/* Floating Animated Character Sprite with smooth physics and zero-flicker CSS cross-fade */}
      <motion.div
        animate={
          action === 'run'
            ? { x: [-8, 8, -8], y: [0, -6, 0] }
            : action === 'jump'
            ? { y: [0, -26, 0], scale: [0.97, 1.05, 1] }
            : action === 'celebrate'
            ? { y: [0, -12, 0], scale: [1, 1.03, 1] }
            : isSpeaking
            ? { y: [0, -4, 1, 0] }
            : { y: [0, -3, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: action === 'run' ? 0.7 : isSpeaking ? 0.45 : 3.2,
          ease: 'easeInOut',
        }}
        className="relative z-10 w-full h-full flex items-end justify-center"
      >
        <img
          src={currentFrame}
          alt="Koko Anfitrión"
          className="max-h-[96%] w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] filter contrast-105 transition-opacity duration-150"
          draggable={false}
        />
      </motion.div>
    </div>
  );
};
