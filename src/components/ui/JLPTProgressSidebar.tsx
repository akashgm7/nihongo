"use client";

import React from 'react';
import { Target } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function JLPTProgressSidebar({ 
  vocabCount = 0, kanjiCount = 0, grammarCount = 0 
}: { 
  vocabCount?: number, kanjiCount?: number, grammarCount?: number 
}) {
  const n5Goals = { vocab: 800, kanji: 100, grammar: 60 };
  
  const vocabPct = Math.min(100, Math.round((vocabCount / n5Goals.vocab) * 100));
  const kanjiPct = Math.min(100, Math.round((kanjiCount / n5Goals.kanji) * 100));
  const grammarPct = Math.min(100, Math.round((grammarCount / n5Goals.grammar) * 100));

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
        <Target size={18} color="#E63946" />
        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#2B2B2B', margin: 0 }}>JLPT N5 Goal</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#5A5A6E' }}>Vocabulary</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#9696A8' }}>{vocabCount} / {n5Goals.vocab}</span>
          </div>
          <ProgressBar current={vocabCount} total={n5Goals.vocab} height={6} />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#5A5A6E' }}>Kanji</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#9696A8' }}>{kanjiCount} / {n5Goals.kanji}</span>
          </div>
          <ProgressBar current={kanjiCount} total={n5Goals.kanji} height={6} />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#5A5A6E' }}>Grammar</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#9696A8' }}>{grammarCount} / {n5Goals.grammar}</span>
          </div>
          <ProgressBar current={grammarCount} total={n5Goals.grammar} height={6} />
        </div>
      </div>
    </div>
  );
}
