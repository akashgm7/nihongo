import React from 'react';
import { motion } from 'framer-motion';

interface KanjiCardProps {
  kanji: any;
  onClick: () => void;
}

export default function KanjiCard({ kanji, onClick }: KanjiCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -4, boxShadow: '0 12px 24px rgba(131,56,236,0.15)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1.5px solid rgba(0,0,0,0.08)',
        borderRadius: 16,
        padding: '24px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        transition: 'border-color 0.2s',
        position: 'relative'
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#8338EC'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'}
    >
      <span style={{ fontSize: 42, fontWeight: 500, color: '#2B2B2B', lineHeight: 1, fontFamily: '"Yu Mincho", "MS Mincho", serif' }}>
        {kanji.character}
      </span>
      <span style={{ 
        fontSize: 12, 
        fontWeight: 700, 
        color: '#5A5A6E', 
        marginTop: 12, 
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        textAlign: 'center',
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {kanji.meaning.split(',')[0]}
      </span>
    </motion.button>
  );
}
