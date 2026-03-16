"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  disabled,
  style,
  ...rest
}: ButtonProps) => {

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontWeight: 600,
    borderRadius: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    border: 'none',
    transition: 'opacity 0.15s, background 0.15s, box-shadow 0.15s',
    width: fullWidth ? '100%' : undefined,
    letterSpacing: '-0.01em',
    position: 'relative',
    outline: 'none',
    whiteSpace: 'nowrap',
    ...style,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: '#E63946',
      color: '#FFFFFF',
      boxShadow: '0 2px 8px rgba(230,57,70,0.25)',
    },
    secondary: {
      background: '#FF6B81',
      color: '#FFFFFF',
      boxShadow: '0 2px 6px rgba(255,107,129,0.2)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1.5px solid var(--border-strong)',
    },
    danger: {
      background: 'var(--accent-dim)',
      color: '#E63946',
      border: '1.5px solid rgba(230,57,70,0.3)',
    },
  };

  const sizes: Record<string, React.CSSProperties> = {
    sm: { fontSize: 13, padding: '6px 14px' },
    md: { fontSize: 14, padding: '10px 22px' },
    lg: { fontSize: 15, padding: '13px 28px' },
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      style={{ ...base, ...variants[variant], ...sizes[size] }}
      disabled={disabled}
      className={className}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
};
