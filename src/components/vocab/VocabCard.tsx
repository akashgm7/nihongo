import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, BookOpen, Star, AlertCircle } from 'lucide-react';

interface VocabCardProps {
  vocab: any;
}

export default function VocabCard({ vocab }: VocabCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const progress = vocab.UserVocabulary?.[0]?.masteryLevel || 0; // 0-5
  
  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const msg = new SpeechSynthesisUtterance(vocab.word);
      msg.lang = 'ja-JP';
      window.speechSynthesis.speak(msg);
    } catch (err) {
      console.error(err);
    }
  };

  const masteryColors = ['#E2E8F0', '#FCA5A5', '#FCD34D', '#A7F3D0', '#34D399', '#10B981'];
  const masteryColor = masteryColors[Math.min(progress, 5)];

  return (
    <div 
      style={{ 
        perspective: 1000,
        height: 140,
        cursor: 'pointer'
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
        style={{
          width: '100%', height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          backfaceVisibility: 'hidden',
          background: '#fff',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          padding: 20,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
        }}>
          {/* Progress Indicator */}
          <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map(level => (
              <div 
                key={level} 
                style={{ 
                  width: 8, height: 8, borderRadius: '50%', 
                  background: progress >= level ? masteryColor : '#F1F5F9' 
                }} 
              />
            ))}
          </div>
          
          <h3 style={{ fontSize: 32, fontWeight: 800, color: '#2B2B2B', margin: 0, letterSpacing: '0.05em' }}>
            {vocab.word}
          </h3>
          {vocab.word !== vocab.reading && (
            <p style={{ fontSize: 16, color: '#5A5A6E', margin: '4px 0 0 0', fontWeight: 600 }}>
              {vocab.reading}
            </p>
          )}
          
          <button 
            onClick={playAudio}
            style={{
              position: 'absolute', bottom: 12, right: 12,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9696A8', padding: 8, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#E63946'}
            onMouseLeave={e => e.currentTarget.style.color = '#9696A8'}
          >
            <Volume2 size={20} />
          </button>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: '#fff',
          borderRadius: 16,
          border: '1.5px solid #E63946',
          boxShadow: '0 8px 24px rgba(230,57,70,0.1)',
          padding: 20,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          textAlign: 'center'
        }}>
          <h4 style={{ fontSize: 20, fontWeight: 800, color: '#E63946', margin: 0 }}>
            {vocab.meaning}
          </h4>
          {vocab.partOfSpeech && (
            <span style={{ 
              display: 'inline-block', padding: '2px 8px', 
              background: 'rgba(0,0,0,0.04)', borderRadius: 99, 
              fontSize: 11, fontWeight: 700, color: '#5A5A6E',
              marginTop: 8, textTransform: 'uppercase'
            }}>
              {vocab.partOfSpeech}
            </span>
          )}
          {vocab.exampleSentence && (
            <p style={{ fontSize: 13, color: '#2B2B2B', margin: '12px 0 0 0', fontStyle: 'italic' }}>
              {vocab.exampleSentence}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
