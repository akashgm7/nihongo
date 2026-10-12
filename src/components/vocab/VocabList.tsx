import React from 'react';
import VocabCard from './VocabCard';

interface VocabListProps {
  vocabulary: any[];
}

export default function VocabList({ vocabulary }: VocabListProps) {
  // Group by level
  const grouped = vocabulary.reduce((acc: any, item: any) => {
    const level = item.jlptLevel || 'Other';
    if (!acc[level]) acc[level] = [];
    acc[level].push(item);
    return acc;
  }, {});

  const levels = Object.keys(grouped).sort().reverse(); // N4, N5, etc.

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {levels.map(level => (
        <div key={level}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2B2B2B', margin: 0 }}>JLPT {level}</h2>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#9696A8' }}>
              {grouped[level].length} words
            </span>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: 16 
          }}>
            {grouped[level].map((vocab: any) => (
              <VocabCard key={vocab.id} vocab={vocab} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
