"use client";

import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function DailyQuestSidebar({ 
  quests = [
    { title: 'Complete 2 lessons', progress: 1, total: 2, xp: 20 },
    { title: 'Review 10 flashcards', progress: 10, total: 10, xp: 15 },
    { title: 'Score 100% in a Quiz', progress: 0, total: 1, xp: 30 }
  ] 
}: { 
  quests?: any[] 
}) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1.5px solid rgba(0,0,0,0.08)',
      borderRadius: 16,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Target size={18} color="#3B82F6" />
        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#2B2B2B', margin: 0 }}>Daily Quests</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {quests.map((q, i) => {
          const completed = q.progress >= q.total;
          return (
            <div key={i} style={{ display: 'flex', gap: 12, opacity: completed ? 0.6 : 1 }}>
              <div style={{ marginTop: 2 }}>
                {completed ? <CheckCircle2 size={18} color="#10B981" /> : <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.1)' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: completed ? '#9696A8' : '#2B2B2B', margin: '0 0 4px 0', textDecoration: completed ? 'line-through' : 'none' }}>
                  {q.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#3B82F6' }}>+{q.xp} XP</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#9696A8' }}>{q.progress} / {q.total}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
