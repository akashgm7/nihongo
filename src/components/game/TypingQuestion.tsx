"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Keyboard } from 'lucide-react';

interface TypingQuestionProps {
  question: string;
  character?: string;
  answer: string;
  selectedOption: string | null;
  onSelect: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  onSpeak?: (text: string) => void;
}

export const TypingQuestion = ({
  question,
  character,
  selectedOption,
  onSelect,
  onSubmit,
  disabled,
  onSpeak
}: TypingQuestionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, width: '100%', maxWidth: 560 }}>
      
      {/* Question */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: 22, fontWeight: 800,
          color: '#2B2B2B', letterSpacing: '-0.02em', margin: '0 0 8px 0', lineHeight: 1.3,
        }}>
          {question}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
          Type the Romaji (English reading)
        </p>
      </div>

      {/* Japanese Word Display */}
      {character && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div
            onClick={() => character && onSpeak?.(character)}
            style={{
              fontSize: 80, fontWeight: 700,
              padding: '24px 48px',
              background: '#FFFFFF',
              border: '2px solid rgba(0,0,0,0.10)',
              borderBottom: '4px solid rgba(0,0,0,0.12)',
              borderRadius: 16,
              cursor: 'pointer',
              color: '#2B2B2B',
              lineHeight: 1,
              userSelect: 'none',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
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
            >
              <Volume2 size={20} />
            </button>
          )}
        </div>
      )}

      {/* Input Field */}
      <div style={{ width: '100%', position: 'relative' }}>
        <div style={{ 
          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
        }}>
          <Keyboard size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={selectedOption || ''}
          onChange={(e) => onSelect(e.target.value)}
          disabled={disabled}
          placeholder="Type here..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !disabled && selectedOption) {
              onSubmit();
            }
          }}
          style={{
            width: '100%',
            padding: '16px 16px 16px 48px',
            fontSize: 20,
            fontWeight: 600,
            borderRadius: 12,
            border: '2px solid var(--border)',
            background: disabled ? 'var(--bg-elevated)' : '#FFFFFF',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'all 0.2s',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
          }}
          onFocus={(e) => {
            if (!disabled) e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onBlur={(e) => {
            if (!disabled) e.currentTarget.style.borderColor = 'var(--border)';
          }}
        />
      </div>
    </div>
  );
};
