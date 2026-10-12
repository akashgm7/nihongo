import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, ArrowRight, RefreshCw, Trophy, Volume2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function KanjiQuiz({ kanjiList, onBack }: { kanjiList: any[], onBack: () => void }) {
  const [quizItems, setQuizItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (kanjiList.length === 0) return;
    const shuffled = [...kanjiList].sort(() => 0.5 - Math.random());
    setQuizItems(shuffled.slice(0, Math.min(10, kanjiList.length)));
  }, [kanjiList]);

  useEffect(() => {
    if (quizItems.length > 0 && currentIndex < quizItems.length) {
      const currentItem = quizItems[currentIndex];
      const distractors = kanjiList
        .filter(v => v.id !== currentItem.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const allOptions = [...distractors, currentItem].sort(() => 0.5 - Math.random());
      setOptions(allOptions);
      setSelectedOption(null);
      setIsRevealed(false);
    }
  }, [currentIndex, quizItems]);

  const handleSelect = (index: number) => {
    if (isRevealed) return;
    setSelectedOption(index);
    setIsRevealed(true);
    const isCorrect = options[index].id === quizItems[currentIndex].id;
    if (isCorrect) setScore(s => s + 1);
  };

  if (quizItems.length === 0) return null;

  if (isFinished) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 24, border: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', color: '#F59E0B' }}>
          <Trophy size={40} />
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: '#2B2B2B', margin: '0 0 12px 0' }}>Quiz Complete!</h2>
        <p style={{ fontSize: 18, color: '#5A5A6E', margin: '0 0 32px 0' }}>
          You scored <strong style={{ color: '#8338EC' }}>{score}</strong> out of {quizItems.length}
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Button onClick={onBack} variant="outline">Back to Grid</Button>
          <Button onClick={() => {
            const shuffled = [...kanjiList].sort(() => 0.5 - Math.random());
            setQuizItems(shuffled.slice(0, Math.min(10, kanjiList.length)));
            setCurrentIndex(0);
            setScore(0);
            setIsFinished(false);
          }}>
            <RefreshCw size={18} className="mr-2" /> Play Again
          </Button>
        </div>
      </div>
    );
  }

  const currentItem = quizItems[currentIndex];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9696A8' }}>
          <XCircle size={24} />
        </button>
        <div style={{ flex: 1, height: 8, background: 'rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${((currentIndex) / quizItems.length) * 100}%`, height: '100%', background: '#8338EC', transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#5A5A6E' }}>
          {currentIndex + 1} / {quizItems.length}
        </span>
      </div>

      <div style={{ background: '#fff', borderRadius: 24, padding: '40px 24px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.04)', marginBottom: 24, border: '1px solid rgba(0,0,0,0.06)' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#9696A8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What does this Kanji mean?</span>
        <h2 style={{ fontSize: 80, fontWeight: 500, color: '#2B2B2B', margin: '24px 0', fontFamily: '"Yu Mincho", "MS Mincho", serif' }}>
          {currentItem.character}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {options.map((opt, i) => {
          const isSelected = selectedOption === i;
          const isCorrect = opt.id === currentItem.id;
          let bg = '#fff', border = '1.5px solid rgba(0,0,0,0.08)', color = '#2B2B2B';
          
          if (isRevealed) {
            if (isCorrect) { bg = '#ECFDF5'; border = '1.5px solid #10B981'; color = '#065F46'; } 
            else if (isSelected) { bg = '#FEF2F2'; border = '1.5px solid #EF4444'; color = '#991B1B'; }
          } else if (isSelected) { bg = '#F8FAFC'; border = '1.5px solid #CBD5E1'; }

          return (
            <motion.button
              key={i}
              whileHover={!isRevealed ? { scale: 1.02 } : {}}
              whileTap={!isRevealed ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(i)}
              style={{
                width: '100%', padding: '20px 24px', borderRadius: 16, textAlign: 'left',
                fontSize: 16, fontWeight: 600, cursor: isRevealed ? 'default' : 'pointer',
                background: bg, border, color, transition: 'all 0.2s',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                opacity: isRevealed && !isCorrect && !isSelected ? 0.5 : 1
              }}
            >
              <span>{opt.meaning}</span>
              {isRevealed && isCorrect && <CheckCircle2 color="#10B981" />}
              {isRevealed && isSelected && !isCorrect && <XCircle color="#EF4444" />}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {isRevealed && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 32 }}>
            <Button 
              onClick={() => currentIndex < quizItems.length - 1 ? setCurrentIndex(c => c + 1) : setIsFinished(true)} 
              style={{ width: '100%', height: 56, fontSize: 16, borderRadius: 16, background: '#8338EC' }}
            >
              {currentIndex < quizItems.length - 1 ? 'Next Kanji' : 'Finish Quiz'}
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
