"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Volume2, Check, ArrowRight, BookOpen, Swords, Home, ChevronLeft } from 'lucide-react';
import { playFeedbackSound, playLevelCompleteSound } from '@/utils/audio';
import { BountyModal } from './BountyModal';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ChartItem {
  k?: string; // Character (Hiragana/Katakana)
  j?: string; // Kanji
  r: string;  // Romaji/Pronunciation
  e?: string; // Meaning (Kanji)
  h?: string; // Transcription in Hiragana
}

interface ChartQuizProps {
  items: ChartItem[];
  onClose: () => void;
  title: string;
}

export function ChartQuiz({ items, onClose, title }: ChartQuizProps) {
  const router = useRouter();
  const { user, token, updateUser } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showBounty, setShowBounty] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  useEffect(() => {
    if (isFinished && score > 0) {
      recordQuizActivity();
    }
  }, [isFinished]);

  const recordQuizActivity = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/activity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        updateUser({ streak: data.streak });
      }
    } catch (error) {
      console.error('Failed to record quiz activity:', error);
    }
  };

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (!isFinished && currentItem) {
      generateOptions();
      setUserAnswer('');
      setStatus('idle');
    }
  }, [currentIndex, isFinished]);

  const generateOptions = () => {
    const correct = currentItem.r || currentItem.e || '';
    const allPossible = items
      .map(item => item.r || item.e || '')
      .filter(val => val !== correct);
    
    const shuffled = allPossible.sort(() => 0.5 - Math.random());
    const selectedOptions = [correct, ...shuffled.slice(0, 3)].sort(() => 0.5 - Math.random());
    setOptions(selectedOptions);
  };

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSelect = (option: string) => {
    if (status !== 'idle') return;
    
    const correct = currentItem.r || currentItem.e || '';
    const isCorrect = option === correct;
    
    setUserAnswer(option);
    if (isCorrect) {
      setScore(s => s + 1);
      setStatus('correct');
      playFeedbackSound('correct');
    } else {
      setStatus('wrong');
      playFeedbackSound('wrong');
    }

    setTimeout(() => {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setIsFinished(true);
        playLevelCompleteSound();
      }
    }, 1500);
  };

  const handleHome = () => {
    onClose();
    router.push('/');
  };

  if (isFinished) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 11000,
        background: 'var(--bg-root)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            background: '#FFFFFF', padding: '48px 32px', borderRadius: 24, 
            textAlign: 'center', maxWidth: 450, width: '100%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <Trophy size={80} color="#FFD93D" style={{ margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#2B2B2B', margin: '0 0 8px' }}>Quiz Complete!</h2>
          <p style={{ fontSize: 18, color: '#9696A8', marginBottom: 32 }}>Your score: <strong>{score} / {items.length}</strong></p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => setShowBounty(true)}
              style={{
                width: '100%', padding: '18px', borderRadius: 16,
                background: 'linear-gradient(135deg, #FFD93D 0%, #FF8400 100%)', 
                border: 'none', color: '#3d2b1f',
                fontWeight: 900, fontSize: 18, cursor: 'pointer', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                boxShadow: '0 10px 20px rgba(255, 132, 0, 0.2)'
              }}
            >
              <Swords size={24} /> CLAIM BOUNTY REWARD
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button
                onClick={onClose}
                style={{
                  padding: '16px', borderRadius: 16,
                  background: '#F0F0F0', border: '1px solid var(--border)', color: 'var(--text-primary)',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                <ChevronLeft size={18} /> Charts
              </button>
              <button
                onClick={handleHome}
                style={{
                  padding: '16px', borderRadius: 16,
                  background: '#E63946', border: 'none', color: '#fff',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                <Home size={18} /> Home
              </button>
            </div>
          </div>

          <BountyModal 
            isOpen={showBounty} 
            onClose={() => { setShowBounty(false); onClose(); }} 
            title={`Mastery: ${title}`}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 11000,
      background: 'var(--bg-root)', display: 'flex', flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '20px 24px', display: 'flex', alignItems: 'center', 
        justifyContent: 'space-between', borderBottom: '1px solid var(--border)',
        background: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button 
            onClick={() => setShowQuitConfirm(true)}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', 
              color: '#9696A8', display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 14, fontWeight: 600
            }}
          >
            <ChevronLeft size={20} /> Quit
          </button>
          <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={20} color="#E63946" />
            <span style={{ fontWeight: 800, fontSize: 18 }}>{title}</span>
          </div>
        </div>
        
        <button 
          onClick={handleHome}
          style={{ 
            background: 'var(--bg-elevated)', border: 'none', 
            borderRadius: 12, padding: '8px 16px', cursor: 'pointer', 
            color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 13, fontWeight: 700, transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
        >
          <Home size={16} /> Dashboard
        </button>
      </div>

      {/* Quit Confirmation Overlay */}
      <AnimatePresence>
        {showQuitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 12000,
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: '#fff', padding: 32, borderRadius: 24,
                maxWidth: 400, width: '100%', textAlign: 'center'
              }}
            >
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Quit Test?</h3>
              <p style={{ color: '#9696A8', marginBottom: 24 }}>Your progress in this test will not be saved.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button
                  onClick={() => setShowQuitConfirm(false)}
                  style={{
                    padding: '12px', borderRadius: 12, background: 'var(--bg-elevated)',
                    border: 'none', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Keep Playing
                </button>
                <button
                  onClick={onClose}
                  style={{
                    padding: '12px', borderRadius: 12, background: '#E63946',
                    color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Yes, Quit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div style={{ height: 6, background: '#F0F0F0' }}>
        <motion.div 
          animate={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
          style={{ height: '100%', background: '#E63946' }} 
        />
      </div>

      {/* Main Quiz Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            style={{ textAlign: 'center', width: '100%', maxWidth: 500 }}
          >
            <div style={{ 
              fontSize: 120, fontWeight: 800, color: '#2B2B2B', 
              marginBottom: 40, lineHeight: 1 
            }}>
              {currentItem.k || currentItem.j}
            </div>

            <button 
              onClick={() => speak(currentItem.k || currentItem.j || '')}
              style={{
                width: 56, height: 56, borderRadius: '50%', background: 'rgba(230,57,70,0.1)',
                color: '#E63946', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 40px', transition: 'all 0.2s'
              }}
            >
              <Volume2 size={28} />
            </button>

            <div style={{ display: 'grid', gap: 12 }}>
              {options.map((option, i) => {
                const isCorrect = option === (currentItem.r || currentItem.e);
                const isSelected = userAnswer === option;
                
                let bgColor = '#FFF';
                let borderColor = 'rgba(0,0,0,0.1)';
                let textColor = '#2B2B2B';

                if (status !== 'idle') {
                  if (isCorrect) {
                    bgColor = 'rgba(76, 175, 80, 0.1)';
                    borderColor = '#4CAF50';
                    textColor = '#2E7D32';
                  } else if (isSelected) {
                    bgColor = 'rgba(230, 57, 70, 0.1)';
                    borderColor = '#E63946';
                    textColor = '#C62828';
                  }
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={status === 'idle' ? { x: 5, borderColor: '#E63946' } : {}}
                    onClick={() => handleSelect(option)}
                    disabled={status !== 'idle'}
                    style={{
                      padding: '18px 24px', borderRadius: 16,
                      background: bgColor, border: `2px solid ${borderColor}`,
                      color: textColor, fontWeight: 700, fontSize: 18,
                      textAlign: 'center', cursor: status === 'idle' ? 'pointer' : 'default',
                      transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10
                    }}
                  >
                    {status !== 'idle' && isCorrect && <Check size={20} />}
                    {status !== 'idle' && isSelected && !isCorrect && <X size={20} />}
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ padding: '24px', textAlign: 'center', color: '#9696A8', fontSize: 14, fontWeight: 600 }}>
        Item {currentIndex + 1} of {items.length}
      </div>
    </div>
  );
}
