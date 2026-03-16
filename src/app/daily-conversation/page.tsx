"use client";

import React from 'react';
import { VocabManager } from '@/components/vocab/VocabManager';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Zap, Trophy } from 'lucide-react';
import Link from 'next/link';
import { HeartsDisplay } from '@/components/ui/HeartsDisplay';

export default function DailyConversationPage() {
  const { user, token, logout } = useAuth();

  if (!token) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return null;
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFAFA', overflow: 'hidden' }}>
      {/* ── Top Navigation ── */}
      <nav style={{
        background: '#FFFFFF',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        height: 62, flexShrink: 0
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: '#E63946',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, color: '#fff', fontWeight: 700,
            }}>日</div>
            <span style={{ fontWeight: 800, fontSize: 17, color: '#2B2B2B', letterSpacing: '-0.03em' }}>NihonGo</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#E63946', fontSize: 13, fontWeight: 700 }}>
                <Zap size={14} />
                <span>{user?.streak ?? 0} day streak</span>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#D97706', fontSize: 13, fontWeight: 700 }}>
                <Trophy size={14} />
                <span>{user?.xp ?? 0} XP</span>
             </div>
             <HeartsDisplay count={user?.hearts ?? 5} />
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '24px' }}>
         <VocabManager />
      </div>
    </div>
  );
}
