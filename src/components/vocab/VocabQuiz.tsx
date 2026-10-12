import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, RefreshCw, Trophy, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface VocabQuizProps {
  vocabulary: any[];
  onComplete: () => void;
  onBack: () => void;
}

export default function VocabQuiz({ vocabulary, onComplete, onBack }: VocabQuizProps) {
  const { token } = useAuth();
  
  // Select 10 random words or all if less than 10
  const [quizItems, setQuizItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Options for current question
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (vocabulary.length === 0) return;
    
    // Pick 10 random items
    const shuffled = [...vocabulary].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, vocabulary.length));
    setQuizItems(selected);
  }, [vocabulary]);

  useEffect(() => {
    if (quizItems.length > 0 && currentIndex < quizItems.length) {
      generateOptions();
    }
  }, [currentIndex, quizItems]);

  const generateOptions = () => {
    const currentItem = quizItems[currentIndex];
    
    // Pick 3 random distractors
    const distractors = vocabulary
      .filter(v => v.id !== currentItem.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
      
    // Combine and shuffle
    const allOptions = [...distractors, currentItem].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setSelectedOption(null);
    setIsRevealed(false);
  };

  const playAudio = () => {
    try {
      const msg = new SpeechSynthesisUtterance(quizItems[currentIndex].word);
      msg.lang = 'ja-JP';
      window.speechSynthesis.speak(msg);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (index: number) => {
    if (isRevealed) return;
    setSelectedOption(index);
    setIsRevealed(true);
    
    const isCorrect = options[index].id === quizItems[currentIndex].id;
    if (isCorrect) setScore(s => s + 1);
    
    // Autoplay audio on reveal
    playAudio();
  };

  const handleNext = async () => {
    if (currentIndex < quizItems.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      await finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      // Submit results to backend to update SRS / progress
      // We assume there's a generic endpoint or we can use the daily tasks logic.
      // For now, we'll just show the summary screen.
      
      setIsFinished(true);
      onComplete(); // trigger refresh in parent
    } catch (err) {
      console.error('Failed to submit quiz results', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (quizItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <p style={{ color: '#9696A8', fontSize: 15 }}>Not enough vocabulary for a quiz.</p>
        <Button onClick={onBack} variant="outline" style={{ marginTop: 16 }}>Go Back</Button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 24, border: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', color: '#F59E0B' }}>
          <Trophy size={40} />
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: '#2B2B2B', margin: '0 0 12px 0' }}>Quiz Complete!</h2>
        <p style={{ fontSize: 18, color: '#5A5A6E', margin: '0 0 32px 0' }}>
          You scored <strong style={{ color: '#E63946' }}>{score}</strong> out of {quizItems.length}
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Button onClick={onBack} variant="outline">Back to List</Button>
          <Button 
            onClick={() => {
              // Restart
              const shuffled = [...vocabulary].sort(() => 0.5 - Math.random());
              setQuizItems(shuffled.slice(0, Math.min(10, vocabulary.length)));
              setCurrentIndex(0);
              setScore(0);
              setIsFinished(false);
            }}
          >
            <RefreshCw size={18} className="mr-2" /> Play Again
          </Button>
        </div>
      </div>
    );
  }

  const currentItem = quizItems[currentIndex];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9696A8' }}>
          <XCircle size={24} />
        </button>
        <div style={{ flex: 1, height: 8, background: 'rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${((currentIndex) / quizItems.length) * 100}%`, height: '100%', background: '#E63946', transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#5A5A6E' }}>
          {currentIndex + 1} / {quizItems.length}
        </span>
      </div>

      {/* Question Card */}
      <div style={{ background: '#fff', borderRadius: 24, padding: '40px 24px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.04)', marginBottom: 24, border: '1px solid rgba(0,0,0,0.06)', position: 'relative' }}>
        <button 
          onClick={playAudio}
          style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(0,0,0,0.04)', border: 'none', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A5A6E', cursor: 'pointer' }}
        >
          <Volume2 size={20} />
        </button>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#9696A8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What does this mean?</span>
        <h2 style={{ fontSize: 48, fontWeight: 900, color: '#2B2B2B', margin: '16px 0 8px 0' }}>{currentItem.word}</h2>
        {isRevealed && currentItem.word !== currentItem.reading && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 20, color: '#E63946', margin: 0, fontWeight: 700 }}>
            {currentItem.reading}
          </motion.p>
        )}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {options.map((opt, i) => {
          const isSelected = selectedOption === i;
          const isCorrect = opt.id === currentItem.id;
          
          let bg = '#fff';
          let border = '1.5px solid rgba(0,0,0,0.08)';
          let color = '#2B2B2B';
          
          if (isRevealed) {
            if (isCorrect) {
              bg = '#ECFDF5';
              border = '1.5px solid #10B981';
              color = '#065F46';
            } else if (isSelected) {
              bg = '#FEF2F2';
              border = '1.5px solid #EF4444';
              color = '#991B1B';
            } else {
              opacity = 0.5;
            }
          } else if (isSelected) {
            bg = '#F8FAFC';
            border = '1.5px solid #CBD5E1';
          }

          let opacity = isRevealed && !isCorrect && !isSelected ? 0.5 : 1;

          return (
            <motion.button
              key={i}
              whileHover={!isRevealed ? { scale: 1.02 } : {}}
              whileTap={!isRevealed ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(i)}
              style={{
                width: '100%', padding: '20px 24px', borderRadius: 16, textAlign: 'left',
                fontSize: 16, fontWeight: 600, cursor: isRevealed ? 'default' : 'pointer',
                background: bg, border, color, opacity, transition: 'all 0.2s',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <span>{opt.meaning}</span>
              {isRevealed && isCorrect && <CheckCircle2 color="#10B981" />}
              {isRevealed && isSelected && !isCorrect && <XCircle color="#EF4444" />}
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 32 }}
          >
            <Button 
              onClick={handleNext} 
              disabled={isSubmitting}
              style={{ width: '100%', height: 56, fontSize: 16, borderRadius: 16 }}
            >
              {isSubmitting ? 'Saving...' : currentIndex < quizItems.length - 1 ? 'Next Word' : 'Finish Quiz'}
              {!isSubmitting && <ArrowRight size={20} className="ml-2" />}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
