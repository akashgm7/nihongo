"use client";

import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function VocabSidebar() {
  return (
    <Link href="/daily-conversation" style={{ textDecoration: 'none' }}>
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(230,57,70,0.12)', borderColor: '#E63946' }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: '#FFFFFF',
          border: '1.5px solid rgba(0,0,0,0.08)',
          borderRadius: 16,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background accent */}
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          background: 'rgba(230,57,70,0.04)',
          borderRadius: '50%',
          zIndex: 0
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(230,57,70,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E63946'
          }}>
            <BookOpen size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#2B2B2B', margin: 0, letterSpacing: '-0.01em' }}>Daily Conversation</h3>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9696A8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>10 Levels Available</p>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginTop: 4, 
          paddingTop: 12, 
          borderTop: '1px solid rgba(0,0,0,0.05)',
          position: 'relative', 
          zIndex: 1 
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#E63946' }}>Practice Now</span>
          <ChevronRight size={16} color="#E63946" strokeWidth={3} />
        </div>
      </motion.div>
    </Link>
  );
}
