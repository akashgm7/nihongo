"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DragDropQuestionProps {
  question: string;
  words: string[];
  onComplete: (answer: string[]) => void;
  disabled?: boolean;
  onSpeak?: (text: string) => void;
}

export const DragDropQuestion = ({
  question,
  words,
  onComplete,
  disabled,
  onSpeak
}: DragDropQuestionProps) => {
  // Store indices of selected words
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  // Store a shuffled version of the words indices to show in the pool
  const [poolIndices, setPoolIndices] = useState<number[]>([]);

  // Shuffle on mount or when words change
  React.useEffect(() => {
    if (!words || !Array.isArray(words)) {
      setPoolIndices([]);
      return;
    }
    const indices = words.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setPoolIndices(indices);
    setSelectedIndices([]); // Reset selection if words change
  }, [words]);

  const toggleWord = (index: number, isFromSelected: boolean) => {
    if (disabled) return;

    if (isFromSelected) {
      const newIndices = selectedIndices.filter(i => i !== index);
      setSelectedIndices(newIndices);
      onComplete(newIndices.map(i => words[i]));
    } else {
      const newIndices = [...selectedIndices, index];
      setSelectedIndices(newIndices);
      onComplete(newIndices.map(i => words[i]));
      if (onSpeak) onSpeak(words[index]);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-12 w-full max-w-2xl px-4">
      <h2 className="text-2xl font-bold text-center w-full">{question}</h2>

      {/* Drop Area / Sentence Builder */}
      <div className="w-full min-h-[100px] border-b-4 border-[#e5e5e5] flex flex-wrap gap-2 p-4">
        <AnimatePresence>
          {selectedIndices.map((index) => (
            <motion.button
              key={`selected-${index}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => toggleWord(index, true)}
              disabled={disabled}
              className="bg-white border-2 border-[#e5e5e5] px-4 py-2 rounded-xl font-bold shadow-[0_2px_0_#e5e5e5] hover:bg-[#f7f7f7]"
            >
              {words[index]}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Pool of words */}
      <div className="flex flex-wrap justify-center gap-3">
        {poolIndices.map((index) => {
          const word = words[index];
          const isSelected = selectedIndices.includes(index);
          return (
            <motion.button
              key={`pool-${index}`}
              onClick={() => !isSelected && toggleWord(index, false)}
              disabled={disabled || isSelected}
              className={`
                px-4 py-2 rounded-xl font-bold border-2 transition-all
                ${isSelected 
                  ? 'bg-[#e5e5e5] text-[#e5e5e5] border-[#e5e5e5] cursor-default' 
                  : 'bg-white border-[#e5e5e5] shadow-[0_4px_0_#e5e5e5] hover:bg-[#f7f7f7]'}
              `}
            >
              {word}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
