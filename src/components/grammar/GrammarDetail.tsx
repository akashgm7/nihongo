import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Play, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

interface GrammarDetailProps {
  grammar: any;
  onClose: () => void;
}

export default function GrammarDetail({ grammar, onClose }: GrammarDetailProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  const examples = typeof grammar.examples === 'string' ? JSON.parse(grammar.examples) : (grammar.examples || []);
  const exercises = typeof grammar.exercises === 'string' ? JSON.parse(grammar.exercises) : (grammar.exercises || []);

  const parts = grammar.title.split(' — ');
  const mainTitle = parts[0];
  const subTitle = parts.length > 1 ? parts[1] : '';

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={e => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', background: '#fff', borderRadius: 24, boxShadow: '0 24px 48px rgba(0,0,0,0.2)', position: 'relative' }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#5A5A6E', zIndex: 10 }}>
            <X size={20} />
          </button>

          <div style={{ padding: '40px 40px 32px 40px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#2B2B2B', margin: '0 0 8px 0' }}>{mainTitle}</h2>
            {subTitle && <h3 style={{ fontSize: 20, fontWeight: 700, color: '#10B981', margin: 0 }}>{subTitle}</h3>}
          </div>

          <div style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 800, color: '#9696A8', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Explanation</h4>
              <p style={{ fontSize: 16, color: '#2B2B2B', lineHeight: 1.6, margin: 0 }}>{grammar.explanation}</p>
            </div>

            {grammar.structure && (
              <div style={{ background: '#ECFDF5', padding: 20, borderRadius: 12, border: '1px solid #A7F3D0' }}>
                <h4 style={{ fontSize: 12, fontWeight: 800, color: '#065F46', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Structure</h4>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#047857' }}>{grammar.structure}</div>
              </div>
            )}

            {examples.length > 0 && (
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: '#9696A8', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Examples</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {examples.map((ex: any, i: number) => (
                    <div key={i} style={{ background: '#FAFAFA', padding: 16, borderRadius: 12, border: '1px solid rgba(0,0,0,0.05)' }}>
                      <p style={{ fontSize: 18, fontWeight: 700, color: '#2B2B2B', margin: '0 0 4px 0' }}>{ex.japanese}</p>
                      <p style={{ fontSize: 15, color: '#5A5A6E', margin: '0 0 8px 0' }}>{ex.english}</p>
                      {ex.notes && (
                        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', background: 'rgba(0,0,0,0.03)', padding: 8, borderRadius: 6 }}>
                          <AlertCircle size={14} color="#9696A8" style={{ marginTop: 2 }} />
                          <span style={{ fontSize: 12, color: '#5A5A6E' }}>{ex.notes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {exercises.length > 0 && (
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: '#9696A8', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Practice</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {exercises.map((ex: any, i: number) => (
                    <GrammarExercise key={i} exercise={ex} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

function GrammarExercise({ exercise }: { exercise: any }) {
  const [selected, setSelected] = useState<string | null>(null);

  if (exercise.type === 'quiz') {
    return (
      <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)' }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#2B2B2B', margin: '0 0 16px 0' }}>{exercise.question}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {exercise.options.map((opt: string) => {
            const isSelected = selected === opt;
            const isCorrect = opt === exercise.answer;
            let bg = '#FAFAFA', border = '1px solid rgba(0,0,0,0.08)', color = '#2B2B2B';
            if (selected) {
              if (isCorrect) { bg = '#ECFDF5'; border = '1px solid #10B981'; color = '#065F46'; }
              else if (isSelected) { bg = '#FEF2F2'; border = '1px solid #EF4444'; color = '#991B1B'; }
            } else if (isSelected) {
              bg = 'rgba(16,185,129,0.05)'; border = '1px solid #10B981';
            }

            return (
              <button
                key={opt}
                onClick={() => !selected && setSelected(opt)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, textAlign: 'left', background: bg, border, color, fontSize: 14, fontWeight: 600, cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>{opt}</span>
                {selected && isCorrect && <CheckCircle2 size={16} color="#10B981" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
}
