"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { X, CheckCircle, XCircle, Volume2, Sparkles, ArrowLeft, Search, 
  Settings, 
  Layout, 
  MessageSquare,
  History,
  Play,
  CheckCircle2,
  Swords,
  ChevronRight,
  RotateCw
} from 'lucide-react';
import { QuizQuestion } from '@/components/game/QuizQuestion';
import { MatchQuestion } from '@/components/game/MatchQuestion';
import { TranslateQuestion } from '@/components/game/TranslateQuestion';
import { DragDropQuestion } from '@/components/game/DragDropQuestion';
import { TypingQuestion } from '@/components/game/TypingQuestion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { playFeedbackSound } from '@/utils/audio';
import { useAuth } from '@/hooks/useAuth';
import { HeartsDisplay } from '@/components/ui/HeartsDisplay';
import { BountyModal } from '@/components/game/BountyModal';

// DUMMY_LESSON_CONTENT removed - now using dynamic data from API

export default function LessonScreen({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const { user, token, updateUser, refreshUser, isLoading: authLoading } = useAuth();
  const [lesson, setLesson] = React.useState<any>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<'idle' | 'correct' | 'wrong'>('idle');
  const [hearts, setHearts] = React.useState(5);
  const [initialHearts, setInitialHearts] = React.useState(5);
  const [progress, setProgress] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [canProceed, setCanProceed] = React.useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = React.useState(true);
  const [mistakeCount, setMistakeCount] = React.useState(0);
  const [isFinished, setIsFinished] = React.useState(false);
  const [hasCalculatedScore, setHasCalculatedScore] = React.useState(false);
  const [showBounty, setShowBounty] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);
  const [isTimeUp, setIsTimeUp] = React.useState(false);
  const autoAdvanceRef = React.useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();
  const mode = (searchParams?.get('mode') || 'learn') as 'learn' | 'practice' | 'play';

  // Determine which content set to use based on mode
  const lessonPhases = lesson?.phases || {};
  const currentModeContent = 
    (mode === 'learn' ? lessonPhases.learn : 
     (mode === 'practice' ? lessonPhases.practice : lessonPhases.play)) || 
    lesson?.content || [];
  
  const activeQuestion = Array.isArray(currentModeContent) ? currentModeContent[currentIndex] : null;

  const deductMainHeart = async () => {
    // Only deduct main hearts if in 'play' mode (or if it's a boss challenge which is always play-like)
    if (mode !== 'play' && !lesson?.isBoss) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/deduct-heart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Since updateUser only takes Partial<User>, and we might have updated lastHeartRefillTime too
        await refreshUser();
      }
    } catch (err) {
      console.error('Failed to deduct heart:', err);
    }
  };

  const romajiToKana: { [key: string]: string } = {
    'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
    'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
    'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
    'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
    'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
    'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
    'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
    'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
    'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
    'wa': 'わ', 'wo': 'を', 'n': 'ん',
    'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
    'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
    'da': 'だ', 'de': 'で', 'do': 'ど',
    'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
    'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ'
  };

  const speak = (text: string) => {
    if (!isAudioEnabled || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    // Convert to Hiragana if it's a known romaji for better accent
    const lowerText = text.toLowerCase().trim();
    const ttsText = romajiToKana[lowerText] || text;
    
    const utterance = new SpeechSynthesisUtterance(ttsText);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8; // Slightly slower for clarity
    
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith('ja'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  // Pre-load voices
  React.useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);


  const handleRetry = () => {
    setStatus('idle');
    setSelectedOption(null);
    setCanProceed(false);
  };

  // Prevent entry if no hearts
  React.useEffect(() => {
    if (user && user.hearts <= 0) {
      setError("You've run out of hearts! Wait for a refill or practice some old lessons.");
      setLoading(false);
    }
  }, [user]);

  const handleRestart = async () => {
    // Only deduct heart for Boss levels if you retry or failed
    if (lesson?.isBoss) {
      await deductMainHeart();
    }
    
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    setCurrentIndex(0);
    setHearts(initialHearts);
    setMistakeCount(0);
    setStatus('idle');
    setSelectedOption(null);
    setHasCalculatedScore(false);
    setIsFinished(false);
    setIsTimeUp(false);
    setProgress(0);
    if (lesson?.timeLimit) {
      setTimeLeft(lesson.timeLimit);
    }
  };

  React.useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/lessons/${lessonId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch lesson');
        const data = await response.json();
        
        setLesson(data);
        
        // Safely determine content length for heart calculation
        const phases = data.phases || {};
        const effectiveContent = (mode === 'learn' ? phases.learn : 
                                 (mode === 'practice' ? phases.practice : phases.play)) || 
                                 data.content || [];
                                 
        if (effectiveContent.length === 0) {
          setError(`This lesson does not have a ${mode} phase. Please try another mode.`);
        } else {
          setError(null);
          const h = effectiveContent.length > 15 ? 7 : 5;
          setInitialHearts(h);
          setHearts(h);
        }
      } catch (err: any) {
        console.error('Error fetching lesson:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (token && lessonId) {
      fetchLesson();
    }
  }, [lessonId, token, router]);

  // Timer logic for Boss Levels
  React.useEffect(() => {
    if (lesson?.isBoss && timeLeft !== null && timeLeft > 0 && !isFinished && !isTimeUp && status === 'idle') {
      const timer = setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished) {
      setIsTimeUp(true);
    }
  }, [lesson, timeLeft, isFinished, isTimeUp, status]);

  React.useEffect(() => {
    if (lesson?.isBoss && lesson?.timeLimit) {
      setTimeLeft(lesson.timeLimit);
    }
  }, [lesson]);

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-root)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          width: 48, 
          height: 48, 
          border: '4px solid #E63946', 
          borderTopColor: 'transparent', 
          borderRadius: '50%',
        }} className="animate-spin" />
        <p style={{ marginTop: 16, color: 'var(--text-secondary)', fontWeight: 600 }}>Loading lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-root)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <XCircle className="text-[#ff4b4b]" size={48} />
        <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{error}</p>
        <Button onClick={() => window.location.href = '/dashboard'}>Return to Dashboard</Button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-xl font-bold">Please log in to continue</p>
        <Button onClick={() => window.location.href = '/login'}>Login</Button>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-root)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Lesson not found</h2>
        <Button onClick={() => window.location.href = '/dashboard'}>Go Back</Button>
      </div>
    );
  }

  const handleCheck = () => {
    if (!activeQuestion) return;
    let isCorrect = false;

    if (activeQuestion.type === 'match') {
      isCorrect = canProceed;
    } else if (activeQuestion.type === 'typing') {
      const userAnswer = (selectedOption || '').toLowerCase().trim();
      const correctAnswer = (Array.isArray(activeQuestion.answer) 
        ? activeQuestion.answer[0] 
        : activeQuestion.answer).toLowerCase().trim();
      isCorrect = (userAnswer === correctAnswer);
    } else {
      const userAnswer = selectedOption;
      const correctAnswer = Array.isArray(activeQuestion.answer) 
        ? activeQuestion.answer.join(' ') 
        : activeQuestion.answer;
      isCorrect = (userAnswer === correctAnswer);
    }

    if (isCorrect) {
      setStatus('correct');
      playFeedbackSound('correct');
      setProgress(((currentIndex + 1) / (currentModeContent.length || 1)) * 100);
      
      // Auto advance after 1.5 seconds if correct
      autoAdvanceRef.current = setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      setStatus('wrong');
      playFeedbackSound('wrong');
      
      // Only deduct hearts in Play mode
      if (mode === 'play' || lesson?.isBoss) {
        const newHearts = Math.max(0, hearts - 1);
        setHearts(newHearts);
        setMistakeCount(prev => prev + 1);
        
        if (newHearts === 0) {
          deductMainHeart();
        }
      } else {
        // In practice mode, just show it's wrong but don't deduct hearts
        setMistakeCount(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedOption(null);
      setCanProceed(true); // Can always go back in learn mode
      setStatus('idle');
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
      setProgress(((currentIndex - 1) / currentModeContent.length) * 100);
    }
  };

  const handleNext = async () => {
    const content = currentModeContent;
    if (currentIndex < content.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setCanProceed(false);
      setStatus('idle');
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
      setProgress(((currentIndex + 1) / content.length) * 100);
    } else {
      setIsFinished(true);
      if (!hasCalculatedScore) {
        setHasCalculatedScore(true);
        const finalScore = Math.round(((currentModeContent.length - mistakeCount) / currentModeContent.length) * 100);
        
        // Only award XP in PLAY mode or Boss mode
        const xpToAward = (mode === 'play' || lesson.isBoss) ? (currentModeContent.length - mistakeCount) : 0;
        
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/lessons/${lesson.id}/complete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              score: finalScore,
              correctCount: currentModeContent.length - mistakeCount,
              totalCount: currentModeContent.length,
              mode: mode // Send mode to backend
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            if (xpToAward > 0) {
              updateUser({ xp: data.user.xp, level: data.user.level });
            }
          }
        } catch (err) {
          console.error('Error completing lesson:', err);
        }
      }
    }
  };

  const handleFinishProgress = async () => {
    if (hasCalculatedScore) return;
    setHasCalculatedScore(true);
    
    try {
      const totalQuestions = currentModeContent.length;
      const correctCount = Math.max(0, totalQuestions - mistakeCount);
      const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
      
      console.log(`Saving progress: Score ${scorePercentage}%, Correct ${correctCount}/${totalQuestions}`);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          score: scorePercentage,
          correctCount,
          totalCount: totalQuestions,
          mode: mode
        })
      });

      const data = await response.json();
      
      if (data.user) {
        updateUser(data.user);
      }

      console.log('Progress saved successfully');
    } catch (error) {
      console.error('Error completing lesson:', error);
      // Reset so user can try again by clicking the button
      setHasCalculatedScore(false);
    }
  };

  const handleFinish = async () => {
    // If progress hasn't been saved yet, try one more time
    if (!hasCalculatedScore) {
      await handleFinishProgress();
    }
    
    const moduleId = searchParams?.get('module');
    const subModuleId = searchParams?.get('subModule');
    const nextLessonId = searchParams?.get('nextLessonId');

    // If there's a next lesson, go to it
    if (nextLessonId) {
      // Reconstruct query params for the next lesson
      const nextQueryParams = new URLSearchParams();
      if (moduleId) nextQueryParams.set('module', moduleId);
      if (subModuleId) nextQueryParams.set('subModule', subModuleId);
      
      // We don't necessarily know the next next lesson here, 
      // but the dashboard will provide it when the user eventually returns to it.
      // For now, just go to the next one.
      router.push(`/lesson/${nextLessonId}?${nextQueryParams.toString()}`);
      return;
    }

    // Default: Redirect to dashboard with context
    let url = '/dashboard';
    if (moduleId || subModuleId) {
      url += '?';
      if (moduleId) url += `module=${moduleId}`;
      if (subModuleId) url += `${moduleId ? '&' : ''}subModule=${subModuleId}`;
    }
    router.push(url);
  };

  if (isFinished) {
    const total = currentModeContent.length;
    const correctCount = total - mistakeCount;
    const scorePercentage = Math.round((correctCount / total) * 100);
    
    const hasPlayPhase = lesson?.phases?.play && Array.isArray(lesson.phases.play) && lesson.phases.play.length > 0;
    const isActuallyComplete = mode === 'play' || lesson.isBoss || !hasPlayPhase;

    let statusTitle = isActuallyComplete ? "Lesson Complete!" : "Section Complete!";
    let statusDesc = isActuallyComplete 
      ? "Great effort! You're making real progress."
      : "You've finished the learning material. Ready to practice?";
    let emoji = isActuallyComplete ? "🏁" : "📖";
    let showReward = isActuallyComplete;
    let allowContinue = true;

    if (lesson.isBoss) {
      // Victory: 80% or better
      if (scorePercentage >= 80) {
        statusTitle = "HIRED! BOSS DEFEATED";
        statusDesc = "You mastered this module like a pro.";
        emoji = "👑";
      } else if (scorePercentage >= 70) {
        statusTitle = "SO CLOSE!";
        statusDesc = "You were almost there! A quick retry should do it.";
        emoji = "💪";
        showReward = false;
        allowContinue = false;
      } else {
        statusTitle = "BOSS REPELLED";
        statusDesc = "The boss was too strong. More training required!";
        emoji = "💀";
        showReward = false;
        allowContinue = false;
      }
    } else if (mistakeCount === 0) {
      statusTitle = "PERFECT RUN!";
      statusDesc = "Double mastery! That was flawless.";
      emoji = "🎉";
    }

    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-root)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            background: 'var(--bg-elevated)', 
            padding: '48px 32px', 
            borderRadius: 24, 
            textAlign: 'center', 
            maxWidth: 400, 
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 24 }}>
            {emoji}
          </div>
          
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
            {statusTitle}
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
            {statusDesc}
          </p>

          <div style={{ 
            background: 'var(--bg-root)',
            borderRadius: 16,
            padding: '24px',
            marginBottom: 32,
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }}>
              Lesson Results
            </div>
            
            {/* Stars Row (Only for Play/Boss or lessons with no play phase) */}
            {isActuallyComplete && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  const totalQuestions = currentModeContent.length;
                  const score = Math.round(((totalQuestions - mistakeCount) / totalQuestions) * 100);
                  let isFilled = false;
                  if (starIndex === 1 && score >= 20) isFilled = true;
                  if (starIndex === 2 && score >= 40) isFilled = true;
                  if (starIndex === 3 && score >= 60) isFilled = true;
                  if (starIndex === 4 && score >= 80) isFilled = true;
                  if (starIndex === 5 && score === 100) isFilled = true;

                  return (
                    <motion.div
                      key={starIndex}
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + (starIndex * 0.15), type: 'spring', stiffness: 200 }}
                    >
                      <Sparkles 
                        size={42} 
                        fill={isFilled ? '#FFD93D' : 'rgba(0,0,0,0.05)'} 
                        color={isFilled ? '#FFD93D' : 'rgba(0,0,0,0.1)'}
                        style={{ filter: isFilled ? 'drop-shadow(0 0 8px rgba(255,217,61,0.5))' : 'none' }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div style={{ fontSize: 32, fontWeight: 800, color: scorePercentage >= 80 ? 'var(--success)' : 'var(--accent)' }}>
              {correctCount}/{total}
            </div>
            {isActuallyComplete && correctCount === total && (
              <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 700, marginTop: 4 }}>
                100% MASTERY
              </div>
            )}
          </div>

          {showReward && (
            <button
              onClick={() => setShowBounty(true)}
              style={{
                width: '100%', height: 52, fontSize: 18, fontWeight: 900,
                background: 'linear-gradient(135deg, #FFD93D 0%, #FF8400 100%)',
                border: 'none', borderRadius: 12, color: '#3d2b1f',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: '0 8px 16px rgba(255, 132, 0, 0.2)',
                marginBottom: 12
              }}
            >
              <Swords size={22} /> CLAIM REWARD (BOUNTY)
            </button>
          )}

          {allowContinue ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {searchParams?.get('nextLessonId') && (
                <Button onClick={handleFinish} style={{ width: '100%', height: 52, fontSize: 16 }}>
                  Next Lesson <ChevronRight size={18} style={{ marginLeft: 8 }} />
                </Button>
              )}
              <Button 
                onClick={() => {
                  const moduleId = searchParams?.get('module');
                  const subModuleId = searchParams?.get('subModule');
                  let url = '/dashboard';
                  if (moduleId || subModuleId) {
                    url += '?';
                    if (moduleId) url += `module=${moduleId}`;
                    if (subModuleId) url += `${moduleId ? '&' : ''}subModule=${subModuleId}`;
                  }
                  router.push(url);
                }} 
                variant={searchParams?.get('nextLessonId') ? "secondary" : "primary"}
                style={{ width: '100%', height: 52, fontSize: 16 }}
              >
                {searchParams?.get('nextLessonId') ? "Back to Lessons" : (lesson.isBoss ? "Finish Module" : "Continue")}
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Button onClick={handleRestart} style={{ width: '100%', height: 52, fontSize: 16 }}>
                Try Again
              </Button>
              <Button onClick={() => {
                const moduleId = searchParams?.get('module');
                const subModuleId = searchParams?.get('subModule');
                let url = '/dashboard';
                if (moduleId || subModuleId) {
                  url += '?';
                  if (moduleId) url += `module=${moduleId}`;
                  if (subModuleId) url += `${moduleId ? '&' : ''}subModule=${subModuleId}`;
                }

                if (lesson.isBoss) {
                  deductMainHeart().finally(() => router.push(url));
                } else {
                  router.push(url);
                }
              }} variant="secondary" style={{ width: '100%', height: 52, fontSize: 16 }}>
                Dashboard
              </Button>
            </div>
          )}

          <BountyModal 
            isOpen={showBounty} 
            onClose={() => setShowBounty(false)} 
            title="Bounty Unlocked: Zoro's Slash"
          />
        </motion.div>
      </div>
    );
  }

  if (hearts === 0 || isTimeUp) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-root)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            background: 'var(--bg-elevated)', 
            padding: '48px 32px', 
            borderRadius: 24, 
            textAlign: 'center', 
            maxWidth: 400, 
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: `2px solid var(--danger)`
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 24 }}>{isTimeUp ? '⏰' : '💔'}</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--danger)', marginBottom: 8 }}>
            {isTimeUp ? 'Time Up!' : 'Out of Hearts!'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
            {isTimeUp ? "The boss was too fast! Try again and be quicker." : "Don't give up! Every mistake is a step towards mastery."}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Button onClick={handleRestart} style={{ width: '100%', height: 52, fontSize: 16 }}>
              Retry Challenge
            </Button>
            <Button onClick={() => {
              if (lesson.isBoss) {
                deductMainHeart().finally(() => router.push('/dashboard'));
              } else {
                router.push('/dashboard');
              }
            }} variant="secondary" style={{ width: '100%', height: 52, fontSize: 16 }}>
              Back to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-root)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/dashboard" style={{ 
            color: 'var(--text-muted)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 700
          }}>
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div style={{ flex: 1, paddingRight: 8 }}>
            <ProgressBar current={progress} total={100} />
          </div>
          {timeLeft !== null && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              padding: '6px 12px', 
              background: timeLeft < 10 ? 'rgba(230,57,70,0.1)' : 'rgba(0,0,0,0.05)',
              borderRadius: 10,
              border: '1px solid',
              borderColor: timeLeft < 10 ? '#E63946' : 'transparent',
              transition: 'all 0.3s'
            }}>
              <Sparkles size={16} color={timeLeft < 10 ? '#E63946' : '#5A5A6E'} />
              <span style={{ 
                fontSize: 14, 
                fontWeight: 800, 
                color: timeLeft < 10 ? '#E63946' : '#2B2B2B',
                fontFamily: 'monospace'
              }}>
                {timeLeft}s
              </span>
            </div>
          )}
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34, borderRadius: 8, border: '1px solid',
              borderColor: isAudioEnabled ? 'var(--accent)' : 'var(--border)',
              background: isAudioEnabled ? 'var(--accent-dim)' : 'transparent',
              color: isAudioEnabled ? 'var(--accent-light)' : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <Volume2 size={16} />
          </button>
          <HeartsDisplay count={hearts} />
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, width: '100%', maxWidth: 800, margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {mode === 'learn' && activeQuestion?.type === 'intro' ? (
            <motion.div
              key={`intro-${currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}
            >
              <div style={{
                width: activeQuestion.character.length > 2 ? 'auto' : 200,
                minWidth: 200,
                height: activeQuestion.character.length > 2 ? 'auto' : 200,
                minHeight: 200,
                padding: activeQuestion.character.length > 2 ? '32px 48px' : 0,
                background: 'var(--bg-elevated)',
                borderRadius: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: activeQuestion.character.length > 10 ? 36 : activeQuestion.character.length > 4 ? 64 : 96,
                textAlign: 'center',
                fontWeight: 800,
                color: 'var(--text-primary)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                border: '1px solid var(--border)'
              }}>
                {activeQuestion.character}
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>{activeQuestion.romaji}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 18 }}>{activeQuestion.hint}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => speak(activeQuestion.character)}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: '#E63946',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(230,57,70,0.3)'
                }}
              >
                <Volume2 size={32} />
              </motion.button>
            </motion.div>
          ) : activeQuestion?.type === 'quiz' ? (
            <QuizQuestion 
              key={`quiz-${currentIndex}`}
              question={activeQuestion.question}
              options={activeQuestion.options}
              onSelect={setSelectedOption}
              selectedOption={selectedOption}
              disabled={status !== 'idle'}
              character={activeQuestion.character}
              big={lesson.isBoss}
              onSpeak={speak}
            />
          ) : activeQuestion?.type === 'match' ? (
            <MatchQuestion 
              key={`match-${currentIndex}`}
              pairs={activeQuestion.pairs}
              onComplete={(completed) => setCanProceed(completed)}
              onSpeak={speak}
            />
          ) : activeQuestion?.type === 'translate' ? (
            <TranslateQuestion 
              key={`translate-${currentIndex}`}
              question={activeQuestion.question}
              options={activeQuestion.options}
              onSelect={setSelectedOption}
              selectedOption={selectedOption}
              disabled={status !== 'idle'}
              onSpeak={speak}
            />
          ) : activeQuestion?.type === 'drag_drop' ? (
            <DragDropQuestion 
              key={`dragdrop-${currentIndex}`}
              question={activeQuestion.question}
              words={activeQuestion.words || activeQuestion.options}
              onComplete={(answer) => {
                setSelectedOption(answer.join(' '));
                setCanProceed(true);
              }}
              onSpeak={speak}
            />
          ) : activeQuestion?.type === 'typing' ? (
            <TypingQuestion
              key={`typing-${currentIndex}`}
              question={activeQuestion.question}
              character={activeQuestion.character}
              answer={activeQuestion.answer}
              selectedOption={selectedOption}
              onSelect={setSelectedOption}
              onSubmit={handleCheck}
              disabled={status !== 'idle'}
              onSpeak={speak}
            />
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: 48,
              background: 'rgba(230,57,70,0.03)',
              borderRadius: 24,
              border: '1px dashed rgba(230,57,70,0.2)',
              margin: '20px 0'
            }}>
              <XCircle className="text-[#ff4b4b] mx-auto mb-4" size={40} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                Unknown Content Type
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                This card type "{activeQuestion?.type || 'undefined'}" is not supported yet.
              </p>
              <Button onClick={() => handleNext()}>Skip Question</Button>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Action Bar */}
      <footer style={{
        borderTop: '1px solid',
        borderTopColor: status === 'correct' ? 'rgba(34,197,94,0.3)' : status === 'wrong' ? 'rgba(239,68,68,0.3)' : 'var(--border)',
        background: status === 'correct' ? 'rgba(34,197,94,0.06)' : status === 'wrong' ? 'rgba(239,68,68,0.06)' : 'var(--bg-elevated)',
        transition: 'all 0.3s',
        padding: '20px 24px',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ flex: 1 }}>
            {status === 'correct' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--success)' }}>
                <CheckCircle size={24} />
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>Correct!</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Great work, keep going</p>
                </div>
              </div>
            )}
            {status === 'wrong' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--danger)' }}>
                <XCircle size={24} />
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>Incorrect</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                    Answer: {activeQuestion && (Array.isArray(activeQuestion.answer) ? activeQuestion.answer.join(' ') : activeQuestion.answer)}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {status === 'idle' && (
              <>
                {mode === 'learn' && currentIndex > 0 && (
                  <Button onClick={handlePrevious} variant="secondary">
                    Previous
                  </Button>
                )}
                <Button 
                  onClick={(mode === 'learn' && activeQuestion?.type === 'intro') ? handleNext : handleCheck} 
                  disabled={(mode !== 'learn' || activeQuestion?.type !== 'intro') && !selectedOption && !canProceed}
                >
                  {(mode === 'learn' && activeQuestion?.type === 'intro') ? 'Next' : 'Submit'}
                </Button>
              </>
            )}
            {status !== 'idle' && (
              <div style={{ display: 'flex', gap: 10 }}>
                {status === 'wrong' && <Button onClick={handleRetry} variant="secondary">Retry</Button>}
                <Button onClick={handleNext} variant={status === 'correct' ? 'primary' : 'danger'}>
                  Continue
                </Button>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
