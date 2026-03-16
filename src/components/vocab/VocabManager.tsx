"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, BookOpen, ChevronRight, Check, X, RefreshCw, Trophy, ArrowLeft, Swords } from 'lucide-react';
import Link from 'next/link';
import { playFeedbackSound, playLevelCompleteSound } from '@/utils/audio';
import { BountyModal } from '@/components/game/BountyModal';

interface Word {
  ja: string;
  ro: string;
  en: string;
}

interface Level {
  id: number;
  name: string;
  words: Word[];
}

const LEVEL_1_WORDS: Word[] = [
  { ja: 'こんにちは', ro: 'Konnichiwa', en: 'Hello' },
  { ja: 'ありがとう', ro: 'Arigatou', en: 'Thank you' },
  { ja: 'すみません', ro: 'Sumimasen', en: 'Excuse me' },
  { ja: 'はい', ro: 'Hai', en: 'Yes' },
  { ja: 'いいえ', ro: 'Iie', en: 'No' },
  { ja: 'よろしくお願いします', ro: 'Yoroshiku onegaishimasu', en: 'Nice to meet you' },
  { ja: 'おはようございます', ro: 'Ohayou gozaimasu', en: 'Good morning' },
  { ja: 'こんばんは', ro: 'Konbanwa', en: 'Good evening' },
  { ja: 'おやすみなさい', ro: 'Oyasumi nasai', en: 'Good night' },
  { ja: 'さようなら', ro: 'Sayounara', en: 'Goodbye' },
];

const LEVELS: Level[] = [
  { id: 1, name: 'Level 1', words: LEVEL_1_WORDS },
  ...Array.from({ length: 9 }, (_, i) => ({ id: i + 2, name: `Level ${i + 2}`, words: [] })),
];

export function VocabManager() {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testIndex, setTestIndex] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const [testOptions, setTestOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showBounty, setShowBounty] = useState(false);

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const startTest = (level: Level) => {
    setIsTesting(true);
    setTestIndex(0);
    setTestScore(0);
    setTestFinished(false);
    generateOptions(level, 0);
  };

  const generateOptions = (level: Level, index: number) => {
    const correct = level.words[index].en;
    const others = level.words
      .filter((_, i) => i !== index)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.en);
    
    setTestOptions([correct, ...others].sort(() => 0.5 - Math.random()));
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption || !selectedLevel) return;
    setSelectedOption(option);
    const correct = selectedLevel.words[testIndex].en === option;
    setIsCorrect(correct);
    if (correct) setTestScore(s => s + 1);
    
    playFeedbackSound(correct ? 'correct' : 'wrong');

    setTimeout(() => {
      if (testIndex < selectedLevel.words.length - 1) {
        setTestIndex(i => i + 1);
        generateOptions(selectedLevel, testIndex + 1);
      } else {
        setTestFinished(true);
        playLevelCompleteSound();
      }
    }, 1500);
  };

  return (
    <div style={{ 
      height: 'calc(100vh - 140px)', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden' 
    }}>
      <AnimatePresence mode="wait">
        {testFinished ? (
          <motion.div 
            key="test-finished"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            style={{ maxWidth: 600, margin: 'auto', width: '100%', padding: 32, background: '#FFFFFF', borderRadius: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.05)', textAlign: 'center' }}
          >
            <Trophy size={80} color="#FFD93D" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#2B2B2B', margin: '0 0 8px' }}>Level {selectedLevel?.id} Complete!</h2>
            <p style={{ fontSize: 18, color: '#9696A8', marginBottom: 32 }}>Your score: <strong>{testScore} / {selectedLevel?.words.length}</strong></p>
            <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
              <button
                onClick={() => setShowBounty(true)}
                style={{
                  width: '100%', padding: '18px', borderRadius: 16,
                  background: 'linear-gradient(135deg, #FFD93D 0%, #FF8400 100%)', 
                  border: 'none', color: '#3d2b1f',
                  fontWeight: 900, fontSize: 18, cursor: 'pointer', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  boxShadow: '0 10px 20px rgba(255, 132, 0, 0.2)',
                  marginBottom: 8
                }}
              >
                <Swords size={24} /> CLAIM REWARD (BOUNTY)
              </button>
              
              <div style={{ display: 'flex', gap: 16 }}>
                <button
                  onClick={() => startTest(selectedLevel!)}
                  style={{
                    flex: 1, padding: '16px', borderRadius: 16,
                    background: 'rgba(230,57,70,0.1)', border: 'none', color: '#E63946',
                    fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}
                >
                  <RefreshCw size={20} /> Try Again
                </button>
                <button
                  onClick={() => { setIsTesting(false); setTestFinished(false); }}
                  style={{
                    flex: 1, padding: '16px', borderRadius: 16,
                    background: '#E63946', border: 'none', color: '#fff',
                    fontWeight: 700, fontSize: 16, cursor: 'pointer'
                  }}
                >
                  Back to List
                </button>
              </div>
            </div>
            <BountyModal 
              isOpen={showBounty} 
              onClose={() => setShowBounty(false)} 
              title={`Mastery of Level ${selectedLevel?.id}`}
            />
          </motion.div>
        ) : isTesting && selectedLevel ? (
          <motion.div 
            key="testing"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            style={{ 
              maxWidth: 520, margin: 'auto', width: '100%', padding: '24px 32px', 
              background: '#FFFFFF', borderRadius: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
              maxHeight: '100%', display: 'flex', flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(230,57,70,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E63946' }}>
                   <BookOpen size={18} />
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#E63946', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Test Mode</span>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#2B2B2B', margin: 0 }}>Level {selectedLevel.id} Quiz</h3>
                </div>
              </div>
              <button onClick={() => setIsTesting(false)} style={{ background: '#F5F5F5', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9696A8' }}><X size={18} /></button>
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <motion.div key={testIndex} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontSize: 44, fontWeight: 800, color: '#2B2B2B', marginBottom: 10 }}>{selectedLevel.words[testIndex].ja}</motion.div>
              <button 
                onClick={() => speak(selectedLevel.words[testIndex].ja)}
                style={{ 
                    background: '#FFFFFF', border: '2px solid rgba(230,57,70,0.2)', borderRadius: '50%', 
                    width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto', cursor: 'pointer', color: '#E63946',
                    boxShadow: '0 4px 12px rgba(230,57,70,0.1)'
                }}
              >
                <Volume2 size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {testOptions.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isWordCorrect = opt === selectedLevel.words[testIndex].en;
                let bgColor = '#FFFFFF';
                let borderColor = 'rgba(0,0,0,0.08)';
                let textColor = '#4A4A4A';

                if (isSelected) {
                  bgColor = isCorrect ? 'rgba(76, 175, 80, 0.08)' : 'rgba(230, 57, 70, 0.08)';
                  borderColor = isCorrect ? '#4CAF50' : '#E63946';
                  textColor = isCorrect ? '#2E7D32' : '#C62828';
                } else if (selectedOption && isWordCorrect) {
                  bgColor = 'rgba(76, 175, 80, 0.08)';
                  borderColor = '#4CAF50';
                  textColor = '#2E7D32';
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={!selectedOption ? { x: 4, borderColor: '#E63946' } : {}}
                    onClick={() => handleOptionSelect(opt)}
                    disabled={!!selectedOption}
                    style={{
                      width: '100%', padding: '12px 18px', borderRadius: 12,
                      background: bgColor, border: `2px solid ${borderColor}`,
                      color: textColor, fontWeight: 700, fontSize: 14,
                      textAlign: 'left', cursor: selectedOption ? 'default' : 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'background 0.2s, border-color 0.2s'
                    }}
                  >
                    {opt}
                    {isSelected && (isCorrect ? <Check size={16} /> : <X size={16} />)}
                    {!isSelected && selectedOption && isWordCorrect && <Check size={16} />}
                  </motion.button>
                );
              })}
            </div>
            
            <div style={{ marginTop: 20 }}>
               <div style={{ height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div 
                    animate={{ width: `${((testIndex + 1) / selectedLevel.words.length) * 100}%` }}
                    style={{ height: '100%', background: '#E63946' }} 
                  />
               </div>
               <div style={{ marginTop: 12, fontSize: 11, color: '#9696A8', textAlign: 'center', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                 Word {testIndex + 1} of {selectedLevel.words.length}
               </div>
            </div>
          </motion.div>
        ) : selectedLevel ? (
          <motion.div 
            key="level-detail"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            style={{ maxWidth: 800, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', maxHeight: '100%' }}
          >
            <button 
              onClick={() => setSelectedLevel(null)} 
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#5A5A6E', fontWeight: 700, fontSize: 14, marginBottom: 16, padding: '8px 0' }}
            >
              <ArrowLeft size={18} /> Back to Levels
            </button>

            <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 32, boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#2B2B2B', margin: 0 }}>{selectedLevel.name}: Essential Phrases</h2>
                  <p style={{ fontSize: 14, color: '#9696A8', margin: '4px 0 0' }}>Learn and practice these common daily expressions.</p>
                </div>
                <button
                  onClick={() => startTest(selectedLevel)}
                  style={{
                    padding: '12px 24px', borderRadius: 12,
                    background: '#E63946', border: 'none', color: '#fff',
                    fontWeight: 700, fontSize: 15, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    boxShadow: '0 4px 12px rgba(230,57,70,0.2)'
                  }}
                >
                  Start Test
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, overflowY: 'auto', paddingRight: 8 }}>
                {selectedLevel.words.map((w, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#FAFAFA', borderRadius: 16, border: '1px solid rgba(0,0,0,0.02)', transition: 'transform 0.2s' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 20, fontWeight: 800, color: '#1A1A1A' }}>{w.ja}</span>
                        <span style={{ fontSize: 12, color: '#9696A8', fontWeight: 600 }}>{w.ro}</span>
                      </div>
                      <div style={{ fontSize: 15, color: '#5A5A6E', fontWeight: 500 }}>{w.en}</div>
                    </div>
                    <button 
                      onClick={() => speak(w.ja)}
                      style={{ 
                        background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '50%', 
                        width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        cursor: 'pointer', color: '#E63946', transition: 'all 0.2s' 
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#E63946'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'}
                    >
                      <Volume2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="levels-grid"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            style={{ maxWidth: 900, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', maxHeight: '100%' }}
          >
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#2B2B2B', letterSpacing: '-0.03em', margin: 0 }}>Daily Conversation Levels</h1>
              <p style={{ color: '#5A5A6E', fontSize: 16, marginTop: 8 }}>Master real-world Japanese phrases, step by step.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20, overflowY: 'auto', padding: '10px 0' }}>
              {LEVELS.map((level) => {
                const isEnabled = level.id === 1;
                return (
                  <motion.button
                    key={level.id}
                    whileHover={isEnabled ? { y: -5, scale: 1.02, borderColor: '#E63946' } : {}}
                    onClick={() => isEnabled && setSelectedLevel(level)}
                    style={{
                      aspectRatio: '1',
                      padding: '24px', borderRadius: 24,
                      background: isEnabled ? '#FFFFFF' : '#F5F5F5',
                      border: `2px solid ${isEnabled ? 'rgba(0,0,0,0.04)' : 'transparent'}`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                      cursor: isEnabled ? 'pointer' : 'default',
                      opacity: isEnabled ? 1 : 0.6,
                      boxShadow: isEnabled ? '0 10px 20px rgba(0,0,0,0.03)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ 
                      width: 48, height: 48, borderRadius: 16, 
                      background: isEnabled ? 'rgba(230,57,70,0.1)' : 'rgba(0,0,0,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, fontWeight: 800, color: isEnabled ? '#E63946' : '#9696A8',
                      marginBottom: 4
                    }}>
                      {level.id}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: isEnabled ? '#1A1A1A' : '#9696A8' }}>Level {level.id}</div>
                    {isEnabled ? (
                       <div style={{ fontSize: 10, fontWeight: 700, color: '#E63946', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available</div>
                    ) : (
                       <div style={{ fontSize: 10, fontWeight: 700, color: '#9696A8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Locked</div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
