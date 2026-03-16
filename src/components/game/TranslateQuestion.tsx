"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface TranslateQuestionProps {
  question: string;
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  disabled?: boolean;
  onSpeak?: (text: string) => void;
}

export const TranslateQuestion = ({
  question,
  options,
  selectedOption,
  onSelect,
  disabled,
  onSpeak
}: TranslateQuestionProps) => {
  return (
    <div className="flex flex-col items-start space-y-8 w-full max-w-2xl px-4">
      <h2 className="text-2xl font-bold">{question}</h2>
      
      <div className="flex items-center space-x-4 w-full">
        <button 
          onClick={() => onSpeak && onSpeak(question)}
          disabled={!onSpeak}
          className="w-24 h-24 bg-[#58cc02] rounded-2xl flex items-center justify-center text-white text-5xl hover:bg-[#46a302] transition-colors relative group"
        >
          🗣️
          {onSpeak && (
            <div className="absolute -top-2 -right-2 bg-white text-[#58cc02] p-1 rounded-full border-2 border-[#58cc02] group-hover:scale-110 transition-transform">
              <Volume2 size={16} />
            </div>
          )}
        </button>
        <div className="flex-1 bg-white border-2 border-[#e5e5e5] p-6 rounded-3xl relative shadow-[0_4px_0_#e5e5e5]">
          <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l-2 border-b-2 border-[#e5e5e5] rotate-45" />
          <p className="text-xl font-medium">Translate this sentence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full">
        {options.map((option) => (
          <motion.button
            key={option}
            whileTap={!disabled ? { y: 2 } : {}}
            disabled={disabled}
            onClick={() => {
              onSelect(option);
              onSpeak?.(option);
            }}
            className={`
              p-4 rounded-2xl border-2 font-bold text-lg text-left transition-all
              ${selectedOption === option 
                ? 'bg-[#1cb0f6] text-white border-[#1899d6] shadow-[0_4px_0_#1899d6]' 
                : 'bg-white border-[#e5e5e5] shadow-[0_4px_0_#e5e5e5] hover:bg-[#f7f7f7]'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
