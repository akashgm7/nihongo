"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MatchPair {
  character: string;
  sound: string;
}

interface MatchQuestionProps {
  pairs: MatchPair[];
  onComplete: (isCorrect: boolean) => void;
  disabled?: boolean;
  onSpeak?: (text: string) => void;
}

export const MatchQuestion = ({
  pairs,
  onComplete,
  disabled,
  onSpeak
}: MatchQuestionProps) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // stores characters
  const [wrongFlash, setWrongFlash] = useState<boolean>(false);

  // Shuffle items
  const [shuffledLeft, setShuffledLeft] = useState<string[]>([]);
  const [shuffledRight, setShuffledRight] = useState<string[]>([]);

  useEffect(() => {
    setShuffledLeft([...pairs.map(p => p.character)].sort(() => Math.random() - 0.5));
    setShuffledRight([...pairs.map(p => p.sound)].sort(() => Math.random() - 0.5));
  }, [pairs]);

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      const correctPair = pairs.find(p => p.character === selectedLeft && p.sound === selectedRight);
      
      if (correctPair) {
        setMatchedPairs(prev => [...prev, selectedLeft]);
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        setWrongFlash(true);
        setTimeout(() => {
          setWrongFlash(false);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 500);
      }
    }
  }, [selectedLeft, selectedRight, pairs]);

  useEffect(() => {
    if (matchedPairs.length === pairs.length && pairs.length > 0) {
      onComplete(true);
    }
  }, [matchedPairs, pairs.length, onComplete]);

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-2xl px-4">
      <h2 className="text-2xl font-bold text-center">Match the pairs</h2>
      
      <div className="grid grid-cols-2 gap-8 w-full">
        {/* Left Column (Characters) */}
        <div className="space-y-4">
          {shuffledLeft.map((char) => {
            const isMatched = matchedPairs.includes(char);
            const isSelected = selectedLeft === char;
            
            return (
              <motion.button
                key={char}
                whileTap={!disabled && !isMatched ? { y: 2 } : {}}
                disabled={disabled || isMatched}
                onClick={() => {
                  setSelectedLeft(char);
                  if (onSpeak) onSpeak(char);
                }}
                className={`
                  w-full p-6 h-20 rounded-2xl border-2 font-bold text-3xl transition-all flex items-center justify-center
                  ${isMatched ? 'bg-[#e5e5e5] text-[#afafaf] border-[#e5e5e5] opacity-50' : 
                    isSelected ? 'bg-[#1cb0f6] text-white border-[#1899d6] shadow-[0_4px_0_#1899d6]' : 
                    'bg-white border-[#e5e5e5] shadow-[0_4px_0_#e5e5e5] hover:bg-[#f7f7f7]'}
                  ${wrongFlash && isSelected ? 'bg-[#ff4b4b] border-[#d33131] shadow-[0_4px_0_#d33131]' : ''}
                `}
              >
                {char}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column (Sounds) */}
        <div className="space-y-4">
          {shuffledRight.map((sound) => {
            const isMatched = pairs.some(p => p.sound === sound && matchedPairs.includes(p.character));
            const isSelected = selectedRight === sound;
            
            return (
              <motion.button
                key={sound}
                whileTap={!disabled && !isMatched ? { y: 2 } : {}}
                disabled={disabled || isMatched}
                onClick={() => {
                  setSelectedRight(sound);
                  if (onSpeak) onSpeak(sound);
                }}
                className={`
                  w-full p-6 h-20 rounded-2xl border-2 font-bold text-2xl transition-all flex items-center justify-center
                  ${isMatched ? 'bg-[#e5e5e5] text-[#afafaf] border-[#e5e5e5] opacity-50' : 
                    isSelected ? 'bg-[#1cb0f6] text-white border-[#1899d6] shadow-[0_4px_0_#1899d6]' : 
                    'bg-white border-[#e5e5e5] shadow-[0_4px_0_#e5e5e5] hover:bg-[#f7f7f7]'}
                  ${wrongFlash && isSelected ? 'bg-[#ff4b4b] border-[#d33131] shadow-[0_4px_0_#d33131]' : ''}
                `}
              >
                {sound}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
