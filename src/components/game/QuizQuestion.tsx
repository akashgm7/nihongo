"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface QuizQuestionProps {
  question: string;
  character?: string;
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  disabled?: boolean;
  onSpeak?: (text: string) => void;
  big?: boolean;
}

export const QuizQuestion = ({
  question,
  character,
  options,
  selectedOption,
  onSelect,
  disabled,
  onSpeak,
  big
}: QuizQuestionProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, width: '100%', maxWidth: 560 }}>

      {/* Question */}
      <h2 style={{
        fontWeight: 800, textAlign: 'center',
        color: '#2B2B2B', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.3,
        fontSize: big ? 28 : 22,
      }}>
        {question}
      </h2>

      {/* Character card */}
      {character && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div
            onClick={() => character && onSpeak?.(character)}
            style={{
              fontSize: big ? 160 : 96, fontWeight: 700,
              padding: big ? '40px 80px' : '28px 52px',
              background: '#FFFFFF',
              border: '2px solid rgba(0,0,0,0.10)',
              borderBottom: '4px solid rgba(0,0,0,0.12)',
              borderRadius: 24,
              cursor: 'pointer',
              color: '#2B2B2B',
              lineHeight: 1,
              userSelect: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            {character}
          </div>
          {onSpeak && (
            <button
              onClick={() => character && onSpeak?.(character)}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: '#E63946', border: 'none',
                color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(230,57,70,0.3)',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.8'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
            >
              <Volume2 size={20} />
            </button>
          )}
        </div>
      )}

      {/* Options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
        {options.map((option) => {
          const isSelected = selectedOption === option;
          return (
            <motion.button
              key={option}
              whileTap={!disabled ? { scale: 0.97 } : {}}
              disabled={disabled}
              onClick={() => {
                onSelect(option);
                onSpeak?.(option);
              }}
              style={{
                padding: '16px 12px',
                borderRadius: 10,
                border: `2px solid ${isSelected ? '#E63946' : 'rgba(0,0,0,0.10)'}`,
                borderBottom: `${isSelected ? '4px solid #CC2F3B' : '4px solid rgba(0,0,0,0.12)'}`,
                background: isSelected ? 'rgba(230,57,70,0.06)' : '#FFFFFF',
                color: isSelected ? '#E63946' : '#2B2B2B',
                fontWeight: 700, fontSize: 18,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                transition: 'all 0.15s',
                textAlign: 'center' as const,
                letterSpacing: '-0.01em',
                boxShadow: isSelected ? '0 2px 8px rgba(230,57,70,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
