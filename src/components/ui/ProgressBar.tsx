"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  isGlow?: boolean;
}

export const ProgressBar = ({ current, total, color = '#E63946', isGlow = false }: ProgressBarProps) => {
  const percent = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div style={{
      width: '100%',
      height: 8,
      background: 'rgba(0,0,0,0.08)',
      borderRadius: 9999,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ 
          width: `${percent}%`,
          boxShadow: isGlow ? [
            "0 0 0px #FFD700",
            "0 0 15px #FFD700",
            "0 0 0px #FFD700"
          ] : "none"
        }}
        transition={{ 
          width: { duration: 0.7, ease: 'easeOut' },
          boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          height: '100%',
          background: isGlow 
            ? 'linear-gradient(90deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)' 
            : color,
          borderRadius: 9999,
          position: 'relative',
          zIndex: 1,
        }}
      />
      {isGlow && (
        <motion.div
          animate={{
            opacity: [0, 0.5, 0],
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '40%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
            zIndex: 2,
          }}
        />
      )}
    </div>
  );
};
