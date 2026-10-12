import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function FlashcardReview({ deck, onBack }: { deck: any, onBack: () => void }) {
  // Take a slice of cards for this review session
  const [sessionCards] = useState(() => {
    const shuffled = [...deck.cards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(deck.dueCount || 10, deck.cards.length));
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = () => {
    if (currentIndex < sessionCards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
    } else {
      setIsFinished(true);
    }
  };

  const currentCard = sessionCards[currentIndex];

  if (isFinished) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', background: '#fff', padding: 48, borderRadius: 24, border: '1px solid rgba(0,0,0,0.08)', maxWidth: 400, width: '100%' }}>
          <CheckCircle2 size={64} color="#10B981" style={{ margin: '0 auto 24px auto' }} />
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#2B2B2B', margin: '0 0 12px 0' }}>Review Complete!</h2>
          <p style={{ fontSize: 16, color: '#5A5A6E', margin: '0 0 32px 0' }}>You've reviewed {sessionCards.length} cards in {deck.title}.</p>
          <Button onClick={onBack} style={{ width: '100%', height: 48 }}>Back to Decks</Button>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#5A5A6E', fontWeight: 700, fontSize: 14 }}>
            <ArrowLeft size={18} /> Exit Review
          </button>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#2B2B2B' }}>
            {currentIndex + 1} / {sessionCards.length}
          </span>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ perspective: 1000, width: '100%', maxWidth: 500, height: 400, marginBottom: 40 }}>
          <motion.div
            style={{
              width: '100%', height: '100%', position: 'relative',
              transformStyle: 'preserve-3d', cursor: 'pointer'
            }}
            animate={{ rotateX: isFlipped ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => !isFlipped && setIsFlipped(true)}
          >
            {/* Front */}
            <div style={{
              position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
              background: '#fff', borderRadius: 24, border: '2px solid rgba(0,0,0,0.08)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(0,0,0,0.05)', padding: 32, textAlign: 'center'
            }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#9696A8', textTransform: 'uppercase', letterSpacing: '0.1em', position: 'absolute', top: 24 }}>FRONT</span>
              <h2 style={{ fontSize: currentCard.front.length > 5 ? 48 : 80, fontWeight: 500, color: '#2B2B2B', margin: 0, fontFamily: '"Yu Mincho", "MS Mincho", serif' }}>
                {currentCard.front}
              </h2>
              <p style={{ fontSize: 14, color: '#9696A8', margin: '24px 0 0 0', position: 'absolute', bottom: 24 }}>Tap to reveal</p>
            </div>

            {/* Back */}
            <div style={{
              position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
              background: '#F8FAFC', borderRadius: 24, border: '2px solid #3B82F6',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(59,130,246,0.15)', padding: 32, textAlign: 'center',
              transform: 'rotateX(180deg)'
            }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.1em', position: 'absolute', top: 24 }}>BACK</span>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1E293B', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {currentCard.back}
              </div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 500 }}
            >
              <button onClick={handleNext} style={{ flex: 1, padding: 16, borderRadius: 16, background: '#FEF2F2', border: '1.5px solid #EF4444', color: '#B91C1C', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>Again (1m)</button>
              <button onClick={handleNext} style={{ flex: 1, padding: 16, borderRadius: 16, background: '#FFFBEB', border: '1.5px solid #F59E0B', color: '#B45309', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>Hard (10m)</button>
              <button onClick={handleNext} style={{ flex: 1, padding: 16, borderRadius: 16, background: '#ECFDF5', border: '1.5px solid #10B981', color: '#047857', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>Good (1d)</button>
              <button onClick={handleNext} style={{ flex: 1, padding: 16, borderRadius: 16, background: '#EFF6FF', border: '1.5px solid #3B82F6', color: '#1D4ED8', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>Easy (4d)</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
