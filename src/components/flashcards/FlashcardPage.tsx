"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Layers } from 'lucide-react';
import FlashcardReview from './FlashcardReview';

export default function FlashcardPage() {
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [decks, setDecks] = useState<any[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // In a real implementation, we would fetch decks with due counts from the backend.
  // For this prototype, we'll fetch vocab and kanji directly to build decks.
  useEffect(() => {
    if (!authLoading && !token) router.push('/login');
  }, [authLoading, token, router]);

  const fetchDecks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const [vocabRes, kanjiRes] = await Promise.all([
        fetch(`${apiUrl}/vocabulary?limit=1000`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/kanji?limit=1000`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const vocabData = vocabRes.ok ? await vocabRes.json() : { data: [] };
      const kanjiData = kanjiRes.ok ? await kanjiRes.json() : { data: [] };
      
      const vocabItems = vocabData.data || [];
      const kanjiItems = kanjiData.data || [];

      // Create synthetic decks
      setDecks([
        {
          id: 'vocab-n5',
          title: 'JLPT N5 Vocabulary',
          description: 'Basic vocabulary for JLPT N5',
          cards: vocabItems.filter((v: any) => v.jlptLevel === 'N5').map((v: any) => ({
            id: `v-${v.id}`,
            front: v.word,
            back: `${v.reading} - ${v.meaning}`,
            type: 'vocab',
            data: v
          })),
          dueCount: Math.floor(Math.random() * 20) + 5 // Fake due count for prototype
        },
        {
          id: 'vocab-n4',
          title: 'JLPT N4 Vocabulary',
          description: 'Intermediate vocabulary for JLPT N4',
          cards: vocabItems.filter((v: any) => v.jlptLevel === 'N4').map((v: any) => ({
            id: `v-${v.id}`,
            front: v.word,
            back: `${v.reading} - ${v.meaning}`,
            type: 'vocab',
            data: v
          })),
          dueCount: Math.floor(Math.random() * 20) + 5
        },
        {
          id: 'kanji-n5',
          title: 'JLPT N5 Kanji',
          description: 'Basic kanji for JLPT N5',
          cards: kanjiItems.filter((k: any) => k.jlptLevel === 'N5').map((k: any) => ({
            id: `k-${k.id}`,
            front: k.character,
            back: `${k.meaning}\nOn: ${k.onyomi}\nKun: ${k.kunyomi}`,
            type: 'kanji',
            data: k
          })),
          dueCount: Math.floor(Math.random() * 20) + 5
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, [token]);

  if (authLoading) return <div className="min-h-screen bg-[#FAFAFA]" />;

  if (selectedDeck) {
    return <FlashcardReview deck={selectedDeck} onBack={() => setSelectedDeck(null)} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center' }}>
          <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#5A5A6E', fontWeight: 700, fontSize: 14 }}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 1000, margin: '0 auto', width: '100%', padding: '32px 24px', flex: 1 }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#2B2B2B', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Flashcard Decks</h1>
          <p style={{ color: '#5A5A6E', fontSize: 15, margin: 0 }}>Review vocabulary and kanji using Spaced Repetition.</p>
        </div>

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#9696A8' }}>Loading decks...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {decks.map(deck => (
              <div
                key={deck.id}
                style={{
                  background: '#fff', borderRadius: 20, border: '1.5px solid rgba(0,0,0,0.08)',
                  padding: 24, display: 'flex', flexDirection: 'column',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(59,130,246,0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={24} />
                  </div>
                  <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '4px 12px', borderRadius: 99, fontSize: 13, fontWeight: 800 }}>
                    {deck.dueCount} Due
                  </div>
                </div>
                
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#2B2B2B', margin: '0 0 8px 0' }}>{deck.title}</h3>
                <p style={{ fontSize: 14, color: '#5A5A6E', margin: '0 0 24px 0', flex: 1 }}>{deck.description}</p>
                <p style={{ fontSize: 13, color: '#9696A8', margin: '0 0 16px 0', fontWeight: 600 }}>{deck.cards.length} Total Cards</p>

                <button
                  onClick={() => setSelectedDeck(deck)}
                  disabled={deck.cards.length === 0}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 12, background: deck.cards.length > 0 ? '#3B82F6' : '#E2E8F0',
                    color: deck.cards.length > 0 ? '#fff' : '#94A3B8', border: 'none', fontSize: 15, fontWeight: 700,
                    cursor: deck.cards.length > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}
                >
                  <Play size={18} fill="currentColor" /> Review Now
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
