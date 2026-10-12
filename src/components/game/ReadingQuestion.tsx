import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ReadingQuestionProps {
  data: {
    passage: string;
    translation?: string;
    question: string;
    options: string[];
    answer: string;
  };
  onAnswer: (isCorrect: boolean) => void;
}

export function ReadingQuestion({ data, onAnswer }: ReadingQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  const handleSelect = (opt: string) => {
    setSelectedOption(opt);
    const isCorrect = opt === data.answer;
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: 24, marginBottom: 32 }}>
        <p style={{ fontSize: 20, color: '#2B2B2B', lineHeight: 1.8, margin: '0 0 16px 0', fontFamily: '"Yu Mincho", "MS Mincho", serif' }}>
          {data.passage}
        </p>
        
        {data.translation && (
          <div style={{ marginTop: 16, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 16 }}>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              style={{ background: 'none', border: 'none', color: '#10B981', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              {showTranslation ? 'Hide Translation' : 'Show Translation'}
            </button>
            {showTranslation && (
              <p style={{ fontSize: 14, color: '#5A5A6E', margin: '8px 0 0 0', fontStyle: 'italic' }}>
                {data.translation}
              </p>
            )}
          </div>
        )}
      </div>

      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#2B2B2B', marginBottom: 20 }}>
        {data.question}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.options.map((opt, i) => (
          <motion.button
            key={i}
            whileHover={!selectedOption ? { scale: 1.02 } : {}}
            whileTap={!selectedOption ? { scale: 0.98 } : {}}
            onClick={() => !selectedOption && handleSelect(opt)}
            style={{
              padding: '16px 20px',
              borderRadius: 12,
              background: selectedOption === opt ? '#ECFDF5' : '#fff',
              border: `2px solid ${selectedOption === opt ? '#10B981' : 'rgba(0,0,0,0.08)'}`,
              color: selectedOption === opt ? '#065F46' : '#2B2B2B',
              fontSize: 16,
              fontWeight: 600,
              cursor: selectedOption ? 'default' : 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
