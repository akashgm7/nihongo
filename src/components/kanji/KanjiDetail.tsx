import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, ArrowRight } from 'lucide-react';
import { createPortal } from 'react-dom';

interface KanjiDetailProps {
  kanji: any;
  onClose: () => void;
}

export default function KanjiDetail({ kanji, onClose }: KanjiDetailProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  const playAudio = (text: string) => {
    try {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'ja-JP';
      window.speechSynthesis.speak(msg);
    } catch (e) {
      console.error(e);
    }
  };

  const words = kanji.exampleWords ? JSON.parse(kanji.exampleWords) : [];

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto',
            background: '#fff', borderRadius: 24, boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            position: 'relative'
          }}
        >
          <button 
            onClick={onClose}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%',
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#5A5A6E', zIndex: 10
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(131,56,236,0.1) 0%, rgba(131,56,236,0.05) 100%)', textAlign: 'center', position: 'relative' }}>
              <span style={{ fontSize: 120, fontWeight: 500, color: '#2B2B2B', lineHeight: 1, fontFamily: '"Yu Mincho", "MS Mincho", serif', display: 'block', margin: '0 auto 24px auto' }}>
                {kanji.character}
              </span>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: '#8338EC', margin: 0, textTransform: 'capitalize' }}>
                {kanji.meaning}
              </h2>
            </div>

            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ background: '#FAFAFA', padding: 24, borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#9696A8', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Onyomi (Chinese)</h3>
                  {kanji.onyomi ? kanji.onyomi.split(',').map((yomi: string) => (
                    <div key={yomi} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#2B2B2B' }}>{yomi.trim()}</span>
                      <button onClick={() => playAudio(yomi.trim())} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8338EC', display: 'flex' }}><Volume2 size={16} /></button>
                    </div>
                  )) : <span style={{ color: '#9696A8' }}>None</span>}
                </div>
                
                <div style={{ background: '#FAFAFA', padding: 24, borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#9696A8', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kunyomi (Japanese)</h3>
                  {kanji.kunyomi ? kanji.kunyomi.split(',').map((yomi: string) => (
                    <div key={yomi} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#2B2B2B' }}>{yomi.trim()}</span>
                      <button onClick={() => playAudio(yomi.trim())} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8338EC', display: 'flex' }}><Volume2 size={16} /></button>
                    </div>
                  )) : <span style={{ color: '#9696A8' }}>None</span>}
                </div>
              </div>

              {words.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#9696A8', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vocabulary Examples</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {words.map((w: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: 16, borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 20, fontWeight: 700, color: '#2B2B2B' }}>{w.word}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#8338EC' }}>{w.reading}</span>
                          </div>
                          <span style={{ fontSize: 14, color: '#5A5A6E', marginTop: 4, display: 'block' }}>{w.meaning}</span>
                        </div>
                        <button onClick={() => playAudio(w.word)} style={{ background: 'rgba(131,56,236,0.1)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8338EC' }}>
                          <Volume2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
