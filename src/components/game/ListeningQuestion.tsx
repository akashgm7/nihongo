import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Play } from 'lucide-react';

interface ListeningQuestionProps {
  data: {
    audioText: string;
    question: string;
    options: string[];
    answer: string;
  };
  onAnswer: (isCorrect: boolean) => void;
  isAudioEnabled?: boolean;
}

export function ListeningQuestion({ data, onAnswer, isAudioEnabled = true }: ListeningQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Auto-play audio when question appears if enabled
    if (isAudioEnabled) {
      playAudio();
    }
  }, [data.audioText]);

  const playAudio = () => {
    try {
      const msg = new SpeechSynthesisUtterance(data.audioText);
      msg.lang = 'ja-JP';
      msg.rate = 0.8;
      
      msg.onstart = () => setIsPlaying(true);
      msg.onend = () => setIsPlaying(false);
      msg.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(msg);
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };

  const handleSelect = (opt: string) => {
    setSelectedOption(opt);
    const isCorrect = opt === data.answer;
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 500, margin: '0 auto' }}>
      <h3 style={{ fontSize: 24, fontWeight: 800, color: '#2B2B2B', marginBottom: 32, textAlign: 'center' }}>
        {data.question || "Listen and choose the correct answer."}
      </h3>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={playAudio}
        style={{
          width: 100, height: 100, borderRadius: '50%',
          background: isPlaying ? 'rgba(131,56,236,0.1)' : '#8338EC',
          border: isPlaying ? '4px solid #8338EC' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', marginBottom: 40,
          boxShadow: isPlaying ? 'none' : '0 12px 24px rgba(131,56,236,0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        <Volume2 size={48} color={isPlaying ? '#8338EC' : '#fff'} />
      </motion.button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
        {data.options.map((opt, i) => (
          <motion.button
            key={i}
            whileHover={!selectedOption ? { scale: 1.02, x: 4 } : {}}
            whileTap={!selectedOption ? { scale: 0.98 } : {}}
            onClick={() => !selectedOption && handleSelect(opt)}
            style={{
              padding: '16px 20px',
              borderRadius: 12,
              background: selectedOption === opt ? '#F3E8FF' : '#fff',
              border: `2px solid ${selectedOption === opt ? '#8338EC' : 'rgba(0,0,0,0.08)'}`,
              color: selectedOption === opt ? '#8338EC' : '#2B2B2B',
              fontSize: 16,
              fontWeight: 700,
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
