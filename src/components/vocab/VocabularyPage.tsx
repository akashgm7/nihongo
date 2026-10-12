"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Search, Play, Award, Filter, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VocabList from './VocabList';
import VocabQuiz from './VocabQuiz';

export default function VocabularyPage() {
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'list' | 'quiz'>('list');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'N5' | 'N4'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [vocabulary, setVocabulary] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/login');
    }
  }, [authLoading, token, router]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      let url = `${apiUrl}/vocabulary?limit=1000`;
      if (levelFilter !== 'ALL') url += `&jlptLevel=${levelFilter}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      
      const [vocabRes, statsRes] = await Promise.all([
        fetch(url, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/vocabulary/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!vocabRes.ok || !statsRes.ok) throw new Error('Failed to fetch data');
      
      const vocabData = await vocabRes.json();
      const statsData = await statsRes.json();
      
      setVocabulary(vocabData.data || []);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, levelFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (authLoading) return <div className="min-h-screen bg-[#FAFAFA]" />;

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={() => router.push('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#5A5A6E', fontWeight: 700, fontSize: 14 }}
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(230,57,70,0.08)', padding: '6px 12px', borderRadius: 20, color: '#E63946', fontWeight: 700, fontSize: 13 }}>
              <Award size={16} />
              {stats ? `${stats.totalMastered} Mastered` : '...'}
            </div>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1000, margin: '0 auto', width: '100%', padding: '32px 24px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#2B2B2B', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Vocabulary Master
            </h1>
            <p style={{ color: '#5A5A6E', fontSize: 15, margin: 0 }}>
              Learn essential JLPT vocabulary with spaced repetition.
            </p>
          </div>
          
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.04)', padding: 4, borderRadius: 12 }}>
            <button
              onClick={() => setActiveTab('list')}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
                background: activeTab === 'list' ? '#fff' : 'transparent',
                color: activeTab === 'list' ? '#E63946' : '#5A5A6E',
                boxShadow: activeTab === 'list' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <BookOpen size={16} /> Dictionary
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
                background: activeTab === 'quiz' ? '#fff' : 'transparent',
                color: activeTab === 'quiz' ? '#E63946' : '#5A5A6E',
                boxShadow: activeTab === 'quiz' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Play size={16} /> Practice Quiz
            </button>
          </div>
        </div>

        {activeTab === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Filters & Search */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={18} color="#9696A8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search by Japanese, Romaji, or English..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12,
                    border: '1.5px solid rgba(0,0,0,0.08)', fontSize: 15, outline: 'none',
                    background: '#fff'
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                  >
                    <X size={16} color="#9696A8" />
                  </button>
                )}
              </div>
              
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.04)', padding: 4, borderRadius: 12 }}>
                {['ALL', 'N5', 'N4'].map(level => (
                  <button
                    key={level}
                    onClick={() => setLevelFilter(level as any)}
                    style={{
                      padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      fontWeight: 700, fontSize: 13,
                      background: levelFilter === level ? '#fff' : 'transparent',
                      color: levelFilter === level ? '#2B2B2B' : '#5A5A6E',
                      boxShadow: levelFilter === level ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: '#9696A8' }}>Loading vocabulary...</div>
            ) : error ? (
              <div style={{ padding: '40px', background: '#FEE2E2', color: '#DC2626', borderRadius: 12, textAlign: 'center' }}>{error}</div>
            ) : vocabulary.length === 0 ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: '#9696A8', background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)' }}>
                No vocabulary found matching your criteria.
              </div>
            ) : (
              <VocabList vocabulary={vocabulary} />
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <VocabQuiz 
            vocabulary={vocabulary} 
            onComplete={() => fetchData()} 
            onBack={() => setActiveTab('list')}
          />
        )}
      </main>
    </div>
  );
}
