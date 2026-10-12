import React from 'react';
import { motion } from 'framer-motion';

export default function GrammarCard({ grammar, onClick }: { grammar: any, onClick: () => void }) {
  const parts = grammar.title.split(' — ');
  const mainTitle = parts[0];
  const subTitle = parts.length > 1 ? parts[1] : '';

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2, boxShadow: '0 8px 16px rgba(16,185,129,0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: '#fff', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '20px',
        textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.2s', position: 'relative'
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#10B981'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#2B2B2B', margin: '0 0 4px 0' }}>{mainTitle}</h3>
          {subTitle && <p style={{ fontSize: 14, fontWeight: 600, color: '#10B981', margin: 0 }}>{subTitle}</p>}
        </div>
        {grammar.jlptLevel && (
          <span style={{ background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 800, color: '#5A5A6E' }}>
            {grammar.jlptLevel}
          </span>
        )}
      </div>
      <div style={{ marginTop: 16, fontSize: 13, color: '#5A5A6E', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {grammar.explanation}
      </div>
    </motion.button>
  );
}
