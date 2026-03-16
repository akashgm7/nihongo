"use client";

import React from 'react';
import { Heart, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeartsDisplayProps {
  count: number;
  max?: number;
  nextHeartIn?: number | null; // ms
}

export const HeartsDisplay = ({ count, max = 5, nextHeartIn }: HeartsDisplayProps) => {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 24 }}>
        <div style={{ display: 'flex', gap: 2 }}>
          <AnimatePresence mode="popLayout">
            {Array.from({ length: max }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Heart
                  size={14}
                  style={{
                    color: i < count ? '#E63946' : 'rgba(0,0,0,0.1)',
                    fill: i < count ? '#E63946' : 'rgba(0,0,0,0.05)',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    filter: i < count ? 'drop-shadow(0 2px 4px rgba(230, 57, 70, 0.3))' : 'none'
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, marginLeft: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: count > 0 ? '#1A1A1A' : '#9696A8' }}>
            {count}
          </span>
          <span style={{ fontSize: 9, fontWeight: 800, color: '#9696A8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Health
          </span>
        </div>
      </div>
      
      {nextHeartIn !== undefined && nextHeartIn !== null && count < max && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3, 
            fontSize: 8, 
            color: '#9696A8',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            padding: '1px 4px',
            borderRadius: 4,
            background: 'rgba(0,0,0,0.03)',
            marginTop: 2
          }}
        >
          <Timer size={8} />
          <span>+{formatTime(nextHeartIn)}</span>
        </motion.div>
      )}
    </div>
  );
};
