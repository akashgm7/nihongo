"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Swords, Zap, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BountyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const BOUNTY_POOL = [
  { id: 'Zuu6ClXRabE', title: 'Zoro vs King (Legendary Finish)' },
  { id: 'ltn2YITCdFw', title: 'Rock Lee vs Gaara (Classic Mastery)' },
  { id: 'iYbDA-m1u-c', title: 'Luffy Gear 5 (The Warrior of Liberation)' },
  { id: 'oagC8Tbb7fM', title: 'Naruto & Sasuke vs Momoshiki (Peak Teamwork)' },
  { id: 'AGEuQ3Q6Tm4', title: 'Tanjiro vs Rui (Hinokami Kagura)' },
  { id: 'ErXfj3sbIfU', title: 'Saitama vs Boros (Serious Punch)' }
];

export function BountyModal({ isOpen, onClose, title = "Mastery Reward" }: BountyModalProps) {
  const router = useRouter();
  const [selectedBounty, setSelectedBounty] = useState(BOUNTY_POOL[0]);

  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * BOUNTY_POOL.length);
      setSelectedBounty(BOUNTY_POOL[randomIndex]);
    }
  }, [isOpen]);

  const handleHome = () => {
    onClose();
    router.push('/dashboard');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="bounty-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)'
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '95vh',
              background: '#f4e4bc', // Aged parchment color
              borderRadius: '12px',
              padding: 'clamp(12px, 3vh, 24px)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              border: '8px solid #3d2b1f', // Dark wood border
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(8px, 2vh, 20px)',
              overflow: 'hidden'
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '44px',
                height: '44px',
                background: '#E63946',
                border: '4px solid #3d2b1f',
                borderRadius: '50%',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={24} strokeWidth={3} />
            </button>

            {/* Bounty Header */}
            <div style={{
              borderBottom: '4px double #3d2b1f',
              paddingBottom: '16px'
            }}>
              <h1 style={{
                fontFamily: 'serif',
                fontSize: 'clamp(32px, 8vw, 48px)',
                fontWeight: 900,
                color: '#3d2b1f',
                margin: 0,
                letterSpacing: 'clamp(4px, 1vw, 8px)',
                textTransform: 'uppercase'
              }}>WANTED</h1>
              <p style={{
                color: '#3d2b1f',
                fontSize: 'clamp(14px, 3vw, 18px)',
                fontWeight: 700,
                margin: '8px 0 0',
                letterSpacing: '2px'
              }}>TEST COMPLETE REWARD</p>
            </div>

            {/* Video Container */}
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '600px',
                margin: '0 auto',
                maxHeight: '35vh',
                aspectRatio: '16/9',
                background: '#000',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '4px solid #3d2b1f',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
              }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedBounty.id}?rel=0&modestbranding=1&controls=1`}
                  title={selectedBounty.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p style={{ margin: 0 }}>
                <a 
                  href={`https://www.youtube.com/watch?v=${selectedBounty.id}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '10px',
                    color: '#3d2b1f',
                    textDecoration: 'underline',
                    fontWeight: 700,
                    opacity: 0.7
                  }}
                >
                  Watch on YouTube 🏴‍☠️
                </a>
              </p>
            </div>

            {/* Description */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <h2 style={{
                fontSize: 'clamp(18px, 4vw, 24px)',
                fontWeight: 800,
                color: '#3d2b1f',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <Swords size={24} /> {selectedBounty.title} <Swords size={24} />
              </h2>
              <p style={{
                fontSize: 'clamp(13px, 3vw, 16px)',
                color: '#5c412e',
                lineHeight: 1.5,
                maxWidth: '600px',
                margin: '0 auto',
                fontWeight: 500
              }}>
                Mastery comes with discipline. Enjoy this {title} reward and get ready for the next challenge.
              </p>
            </div>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px', 
              marginTop: '10px' 
            }} className="button-group">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                width: '100%'
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  style={{
                    padding: 'clamp(12px, 3vw, 16px)',
                    background: '#3d2b1f',
                    color: '#f4e4bc',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: 'clamp(14px, 3vw, 18px)',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                  }}
                >
                  <Zap size={20} fill="currentColor" />
                  CLAIM REWARD
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleHome}
                  style={{
                    padding: 'clamp(12px, 3vw, 16px)',
                    background: '#E63946',
                    color: '#fff',
                    border: '4px solid #3d2b1f',
                    borderRadius: '8px',
                    fontSize: 'clamp(14px, 3vw, 18px)',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                  }}
                >
                  <Home size={20} />
                  GO HOME
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
