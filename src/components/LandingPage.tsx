"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#4b4b4b] flex flex-col items-center">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-32 flex flex-col md:flex-row items-center justify-between w-full">
        <div className="md:w-1/2 text-center md:text-left space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold leading-tight"
          >
            The free, fun, and effective way to learn <span className="text-[#58cc02]">Japanese!</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-[#777777]"
          >
            Gamified lessons to help you master Hiragana, Katakana, and beyond.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col space-y-4 pt-4"
          >
            <Link href="/signup">
              <Button size="lg" className="w-full md:w-64">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button variant="white" size="lg" className="w-full md:w-64">I already have an account</Button>
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="md:w-1/2 mt-12 md:mt-0 flex justify-center"
        >
          {/* Custom Illustration Placeholder / Image */}
          <div className="w-64 h-64 md:w-96 md:h-96 bg-[#58cc02] rounded-full flex items-center justify-center text-white text-8xl md:text-9xl font-bold shadow-2xl">
            あ
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="bg-[#f7f7f7] w-full py-16 border-t-2 border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Gamified Experience', desc: 'Earn points, maintain streaks, and level up as you learn.', icon: '🎮' },
            { title: 'Bite-sized Lessons', desc: 'Lessons take under 5 minutes. Learn anytime, anywhere.', icon: '⏱️' },
            { title: 'Master the Script', desc: 'Learn Hiragana and Katakana using proven visual methods.', icon: '🇯🇵' },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border-2 border-[#e5e5e5] shadow-[0_4px_0_#e5e5e5] flex flex-col items-center text-center">
              <span className="text-4xl mb-4">{feature.icon}</span>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-[#777777]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
