"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { HeartsDisplay } from '@/components/ui/HeartsDisplay';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Sparkles, LogOut, CheckCircle2, Plus, X, Lock, RotateCw, Trash2, Library, FolderOpen, Shield, Compass, BookOpen, Search, Crown, Flame, Play, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChartsSidebar } from '@/components/ui/ChartsSidebar';
import { VocabSidebar } from '@/components/ui/VocabSidebar';
import { getRankInfo, getAllRanks } from '@/utils/ranks';

function GlowingFlame({ size = 22 }: { size?: number }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
      }}
    >
      {/* Ultimate Glow Bloom Layer 1 */}
      <motion.div
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,146,60,0.8) 0%, rgba(251,146,60,0) 70%)',
          filter: 'blur(12px)',
          zIndex: 0,
        }}
      />

      {/* Ultra Glow Layer 2 (Faster Pulse) */}
      <motion.div
        animate={{
          opacity: [0.5, 0.9, 0.5],
          scale: [0.8, 1.05, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #FF5722 0%, rgba(255,152,0,0) 80%)',
          filter: 'blur(6px)',
          zIndex: 0,
        }}
      />
      
      {/* The Flame Itself (Subtle, no bouncing) */}
      <motion.div
        animate={{
          scale: [1, 1.03, 0.98, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          fontSize: size,
          zIndex: 1,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 0 8px #FF5252) drop-shadow(0 0 15px #FFB74D)',
        }}
      >
        🔥
      </motion.div>
    </div>
  );
}

export default function Dashboard() {
  const { user, token, logout, isLoading: authLoading, nextHeartIn } = useAuth();
  const [lessons, setLessons] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Derived Statistics
  const xp = user?.xp || 0;
  const storedLevel = user?.level || 1;
  const derivedLevel = Math.floor(xp / 100) + 1;
  const currentLevel = Math.max(storedLevel, derivedLevel);
  const prevLevelXp = (currentLevel - 1) * 100;
  const xpInCurrentLevel = xp - prevLevelXp;
  const currentLevelThreshold = 100;
  const rankInfo = getRankInfo(currentLevel);
  const [aiLabsOpen, setAiLabsOpen] = React.useState(false);
  const searchParams = useSearchParams();
  const [selectedModule, setSelectedModule] = React.useState<string | null>(searchParams.get('module'));
  const [selectedSubModule, setSelectedSubModule] = React.useState<string | null>(searchParams.get('subModule'));
  const [error, setError] = React.useState<string | null>(null);
  const [showGenModal, setShowGenModal] = React.useState(false);
  const [genTopic, setGenTopic] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showLevelGlow, setShowLevelGlow] = React.useState(false);
  const [showAiFolder, setShowAiFolder] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [showRankModal, setShowRankModal] = React.useState(false);
  const prevLevelRef = React.useRef<number | null>(null);

  // Level-up effect (Persistent across navigation)
  React.useEffect(() => {
    if (user?.level) {
      const lastCelebrated = localStorage.getItem('lastCelebratedLevel');
      const currentLevel = user.level;
      
      // If we haven't celebrated this level yet, and it's higher than the last one we knew about
      if (lastCelebrated) {
        if (currentLevel > parseInt(lastCelebrated)) {
          // Level up!
          const audio = new Audio('https://www.myinstants.com/media/sounds/tadaaa-8960.mp3');
          audio.play().catch(e => console.log("Audio play failed:", e));
          
          setShowLevelGlow(true);
          setTimeout(() => setShowLevelGlow(false), 8000); // Glow for 8 seconds
          localStorage.setItem('lastCelebratedLevel', currentLevel.toString());
        }
      } else {
        // First time initialization - don't celebrate, just record current
        localStorage.setItem('lastCelebratedLevel', currentLevel.toString());
      }
    }
  }, [user?.level]);

  React.useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        // Add timestamp to bypass caching
        const response = await fetch(`${apiUrl}/lessons?t=${Date.now()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) { logout(); return; }
        if (!response.ok) throw new Error('Failed to fetch lessons');
        const data = await response.json();
        setLessons(data);
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchLessons();
  }, [token]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genTopic.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ topic: genTopic })
      });
      if (response.status === 401) { logout(); return; }
      if (!response.ok) throw new Error('Failed to generate lesson');
      const data = await response.json();
      setLessons(prev => [...prev, data.lesson]);
      setShowGenModal(false);
      setGenTopic('');
    } catch (error: any) {
      setError(error.message || 'Failed to generate lesson');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefresh = async (lessonId: string) => {
    setIsGenerating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/ai/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lessonId })
      });
      if (!res.ok) throw new Error('Refresh failed');
      const data = await res.json();
      // Update local lessons state
      setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, content: data.content } : l));
    } catch (err: any) {
      console.error(err);
      alert('Failed to refresh lesson content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteLesson = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this AI lesson?')) return;
    
    setIsDeleting(id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const resp = await fetch(`${apiUrl}/lessons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (resp.ok) {
        setLessons(prev => prev.filter(l => l.id !== id));
      } else {
        const data = await resp.json();
        alert(data.message || 'Error deleting lesson');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete lesson');
    } finally {
      setIsDeleting(null);
    }
  };

  if (authLoading || (loading && lessons.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAFA' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#E63946', borderTopColor: 'transparent' }} />
          <p style={{ color: '#9696A8', fontSize: 14 }}>Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (!token && !authLoading) {
    window.location.href = '/login';
    return null;
  }

  const officialLessons = lessons.filter(l => l.category !== 'AI Generated');
  const aiLessons = lessons.filter(l => l.category === 'AI Generated');
  
  const completedCount = officialLessons.filter(l => l.completed).length;
  const totalLessons = officialLessons.length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>

      {/* ── Top Navigation ── */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        position: 'sticky', top: 0, zIndex: 500,
        boxShadow: '0 4px 15px -10px rgba(0,0,0,0.05)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link 
            href="/dashboard" 
            style={{ textDecoration: 'none' }}
            onClick={() => {
              setSelectedModule(null);
              setSelectedSubModule(null);
            }}
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'linear-gradient(135deg, #E63946 0%, #D62828 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, color: '#fff', fontWeight: 800,
                boxShadow: '0 8px 16px rgba(230,57,70,0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '100%', height: '100%', background: 'rgba(255,255,255,0.2)', filter: 'blur(8px)', borderRadius: '50%' }} />
                日
              </div>
              <span style={{ fontWeight: 900, fontSize: 20, color: '#1A1A1A', letterSpacing: '-0.04em' }}>NihonGo</span>
            </motion.div>
          </Link>

          {/* Stats Container */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            background: 'rgba(0,0,0,0.03)',
            padding: '4px 8px 4px 16px',
            borderRadius: 99,
            border: '1px solid rgba(0,0,0,0.03)',
            height: 48
          }}>
            <StatBadge icon={<GlowingFlame size={18} />} value={user?.streak ?? 0} label="streak" color="#E63946" />
            <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.08)' }} />
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              padding: '0 8px',
              height: '100%'
            }}>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                boxShadow: '0 4px 10px rgba(16,185,129,0.25)',
                border: '2px solid #fff'
              }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span style={{ 
                fontSize: 13, 
                fontWeight: 750, 
                color: '#2B2B2B',
                maxWidth: 80,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user?.name || 'User'}
              </span>
            </div>

            <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.08)' }} />
            <HeartsDisplay count={user?.hearts ?? 5} nextHeartIn={nextHeartIn} />
          </div>

          {/* Sign out */}
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: '#5A5A6E', background: 'rgba(0,0,0,0.04)', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, padding: '10px 16px', borderRadius: 12,
              transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
            }}
            onMouseEnter={e => { 
              (e.currentTarget as HTMLButtonElement).style.color = '#E63946'; 
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(230,57,70,0.08)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => { 
              (e.currentTarget as HTMLButtonElement).style.color = '#5A5A6E'; 
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </nav>

      {/* ── Rank Overview Modal ── */}
      <AnimatePresence>
        {showRankModal && (
          <RankOverviewModal 
            onClose={() => setShowRankModal(false)} 
            currentLevel={currentLevel} 
          />
        )}
      </AnimatePresence>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', padding: '32px 24px', display: 'flex', gap: 28, alignItems: 'flex-start' }}>

        {/* Left Sidebar */}
        <aside style={{ width: 280, flexShrink: 0, position: 'sticky', top: 80, zIndex: 40 }} className="hidden xl:block">
          <ChartsSidebar />
        </aside>

        {/* Main lessons */}
        <main style={{ flex: 1, padding: '32px 0' }}>
          <div style={{ marginBottom: 28 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'rgba(230,57,70,0.08)', color: '#E63946',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '3px 10px', borderRadius: 9999, border: '1px solid rgba(230,57,70,0.2)',
              marginBottom: 8,
            }}>Section 1</span>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#2B2B2B', letterSpacing: '-0.03em', margin: 0 }}>
              The Basics
            </h1>
            <p style={{ color: '#5A5A6E', fontSize: 14, marginTop: 4 }}>
              Master Hiragana letters and essential greetings.
            </p>

            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <ProgressBar current={completedCount} total={Math.max(totalLessons, 1)} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#5A5A6E', whiteSpace: 'nowrap' }}>
                {completedCount} / {totalLessons} complete
              </span>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9696A8', fontSize: 14 }}>Loading lessons...</div>
          ) : (
            <div style={{ position: 'relative' }}>
              {!selectedModule ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                  <ModuleFolderCard 
                    title="Hiragana" 
                    subtitle="Learn the phonetic script"
                    lessonCount={officialLessons.filter(l => l.category === 'Hiragana').length}
                    completedCount={officialLessons.filter(l => l.category === 'Hiragana' && l.completed).length}
                    icon="あ"
                    color="#E63946"
                    onClick={() => setSelectedModule('hiragana')}
                  />
                  <ModuleFolderCard 
                    title="Katakana" 
                    subtitle="Foreign loanwords & names"
                    lessonCount={officialLessons.filter(l => l.category === 'Katakana').length}
                    completedCount={officialLessons.filter(l => l.category === 'Katakana' && l.completed).length}
                    icon="ア"
                    color="#00B4D8"
                    onClick={() => setSelectedModule('katakana')}
                  />
                  <ModuleFolderCard 
                    title="Kanji" 
                    subtitle="Chinese characters system"
                    lessonCount={officialLessons.filter(l => l.category === 'Kanji').length}
                    completedCount={officialLessons.filter(l => l.category === 'Kanji' && l.completed).length}
                    icon="日"
                    color="#8338EC"
                    onClick={() => setSelectedModule('kanji')}
                  />
                  <ModuleFolderCard 
                    title="AI Laboratory" 
                    subtitle="Custom practice lessons"
                    lessonCount={aiLessons.length}
                    completedCount={aiLessons.filter(l => l.completed).length}
                    icon="🧪"
                    color="#8B5CF6"
                    onClick={() => setShowAiFolder(true)}
                  />
                </div>
              ) : !selectedSubModule ? (
                /* Sub-modules list for the selected module */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <button 
                      onClick={() => setSelectedModule(null)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#9696A8', fontSize: 14, fontWeight: 700,
                        marginBottom: 12, padding: '8px 0',
                        transition: 'color 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#E63946'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9696A8'}
                    >
                      <ArrowLeft size={18} /> Back to Sections
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                    {selectedModule === 'hiragana' && (
                      <>
                        <ModuleFolderCard 
                          title="Module 1: Hiragana Basics" 
                          subtitle="The foundation of Japanese"
                          lessonCount={officialLessons.filter(l => l.subModule === 'hiragana-basics').length}
                          completedCount={officialLessons.filter(l => l.subModule === 'hiragana-basics' && l.completed).length}
                          icon="基礎"
                          color="#E63946"
                          onClick={() => setSelectedSubModule('hiragana-basics')}
                        />
                        <ModuleFolderCard 
                          title="Module 2: Hiragana Sounds" 
                          subtitle="Dakuten and Handakuten"
                          lessonCount={officialLessons.filter(l => l.subModule === 'hiragana-sounds').length}
                          completedCount={officialLessons.filter(l => l.subModule === 'hiragana-sounds' && l.completed).length}
                          icon="濁音"
                          color="#F59E0B"
                          onClick={() => setSelectedSubModule('hiragana-sounds')}
                        />
                        <ModuleFolderCard 
                          title="Module 3: Advanced Kana" 
                          subtitle="Combination sounds"
                          lessonCount={officialLessons.filter(l => l.subModule === 'advanced-kana').length}
                          completedCount={officialLessons.filter(l => l.subModule === 'advanced-kana' && l.completed).length}
                          icon="拗音"
                          color="#8B5CF6"
                          onClick={() => setSelectedSubModule('advanced-kana')}
                        />
                        <ModuleFolderCard 
                          title="Module 4: Word Building" 
                          subtitle="Forming simple words"
                          lessonCount={officialLessons.filter(l => l.subModule === 'word-building').length}
                          completedCount={officialLessons.filter(l => l.subModule === 'word-building' && l.completed).length}
                          icon="単語"
                          color="#10B981"
                          onClick={() => setSelectedSubModule('word-building')}
                        />
                        <ModuleFolderCard 
                          title="Module 5: Grammar Basics" 
                          subtitle="Particles and structure"
                          lessonCount={officialLessons.filter(l => l.subModule === 'grammar-basics').length}
                          completedCount={officialLessons.filter(l => l.subModule === 'grammar-basics' && l.completed).length}
                          icon="文法"
                          color="#EF4444"
                          onClick={() => setSelectedSubModule('grammar-basics')}
                        />
                        <ModuleFolderCard 
                          title="Module 6: Sentence Formation" 
                          subtitle="Verbs and SOV structure"
                          lessonCount={officialLessons.filter(l => l.subModule === 'sentence-formation').length}
                          completedCount={officialLessons.filter(l => l.subModule === 'sentence-formation' && l.completed).length}
                          icon="文章"
                          color="#3B82F6"
                          onClick={() => setSelectedSubModule('sentence-formation')}
                        />
                      </>
                    )}
                    {(selectedModule === 'katakana' || selectedModule === 'kanji') && (
                      <div style={{ gridColumn: '1 / -1', padding: '60px 0', textAlign: 'center' }}>
                        <div style={{ 
                          display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                          padding: '40px 60px', borderRadius: 24, background: '#fff', 
                          border: '1.5px dashed rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ 
                            width: 60, height: 60, borderRadius: 16, 
                            background: selectedModule === 'katakana' ? 'rgba(0,180,216,0.1)' : 'rgba(131,56,236,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 28, color: selectedModule === 'katakana' ? '#00B4D8' : '#8338EC'
                          }}>
                            {selectedModule === 'katakana' ? 'ア' : '日'}
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#2B2B2B' }}>Coming Soon</h3>
                            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#9696A8' }}>
                              We're currently preparing the {selectedModule} curriculum.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setSelectedSubModule(null)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#9696A8', fontSize: 14, fontWeight: 700,
                      marginBottom: 20, padding: '8px 0',
                      transition: 'color 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#E63946'}
                    onMouseLeave={e => e.currentTarget.style.color = '#9696A8'}
                  >
                    <ArrowLeft size={18} /> Back to Modules
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingLeft: '10%' }}>
                    <VerticalProgressPath 
                      lessons={officialLessons.filter(l => l.subModule === selectedSubModule)} 
                      onRefresh={handleRefresh} 
                      isRefreshing={isGenerating}
                      selectedModule={selectedModule}
                      selectedSubModule={selectedSubModule}
                      bossLessonId={
                        selectedSubModule === 'hiragana-basics' ? 'boss-hiragana-1' : 
                        selectedSubModule === 'word-building' ? 'boss-m4' : 
                        selectedSubModule === 'grammar-basics' ? 'boss-m5' : 
                        selectedSubModule === 'sentence-formation' ? 'boss-m6' : 
                        undefined
                      }
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <aside style={{ width: 248, flexShrink: 0, position: 'sticky', top: 94 }} className="hidden lg:block">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Level Progress */}
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div>
                        <p style={{ 
                          fontSize: 11, 
                          fontWeight: 800, 
                          color: rankInfo.color, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.08em', 
                          margin: '0 0 4px 0',
                        }}>
                          Current Rank
                        </p>
                        <h2 
                          onClick={() => { console.log("Rank Title Clicked"); setShowRankModal(true); }}
                          style={{ fontSize: 24, fontWeight: 900, color: '#2B2B2B', margin: 0, letterSpacing: '-0.03em', textTransform: 'uppercase', cursor: 'pointer' }}
                        >
                          {rankInfo.name}
                        </h2>
                      </div>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRankModal(true);
                        }} 
                        style={{ cursor: 'pointer', position: 'relative', zIndex: 10 }}
                      >
                        <LeagueEmblem iconName={rankInfo.icon} color={rankInfo.color} size={48} />
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: '6px 12px', 
                      borderRadius: 10, 
                      background: rankInfo.bg, 
                      color: rankInfo.color, 
                      fontSize: 10, 
                      fontWeight: 800,
                      border: `1px solid ${rankInfo.bg}`,
                      letterSpacing: '0.02em',
                      marginBottom: 12,
                      textAlign: 'center'
                    }}>
                      {xpInCurrentLevel >= currentLevelThreshold ? (
                        "READY TO LEVEL UP"
                      ) : (
                        `${Math.max(0, currentLevelThreshold - xpInCurrentLevel)} XP TO NEXT LEVEL`
                      )}
                    </div>

                    <ProgressBar current={xpInCurrentLevel} total={currentLevelThreshold} isGlow={showLevelGlow} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#9696A8' }}>{xpInCurrentLevel} XP</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#2B2B2B' }}>{currentLevelThreshold} XP GOAL</span>
                    </div>
            </div>

            {/* Streak */}
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 18, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <GlowingFlame size={24} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#2B2B2B', margin: 0 }}>{user?.streak ?? 0} Day Streak</p>
                <p style={{ fontSize: 12, color: '#9696A8', margin: 0 }}>Keep it going!</p>
              </div>
            </div>
            
            <VocabSidebar />

            {/* AI Generate */}
            <button
              onClick={() => setShowGenModal(true)}
              style={{
                width: '100%', padding: '13px 16px', borderRadius: 12,
                background: '#E63946', border: 'none',
                color: '#fff', fontWeight: 700, fontSize: 14,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 14px rgba(230,57,70,0.3)',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
            >
              <Sparkles size={16} />
              Generate AI Lesson
            </button>
            {/* AI Laboratory Sidebar Section */}
            {aiLessons.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8B5CF6', padding: '0 4px', marginBottom: 4 }}>
                  <Sparkles size={14} />
                  <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Laboratory</span>
                </div>
                {aiLessons.map(lesson => (
                  <Link key={lesson.id} href={`/lesson/${lesson.id}`} style={{ textDecoration: 'none' }}>
                    <motion.div
                      whileHover={{ x: 4, background: 'rgba(139, 92, 246, 0.04)' }}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid rgba(139, 92, 246, 0.12)',
                        borderRadius: 10,
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#2B2B2B', textTransform: 'capitalize' }}>
                          {lesson.title.replace('Topic: ', '').toLowerCase()}
                        </h4>
                        {lesson.completed ? (
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle2 size={12} color="white" />
                          </div>
                        ) : (
                          <div style={{ padding: '2px 6px', borderRadius: 4, background: 'rgba(139, 92, 246, 0.06)', color: '#8B5CF6', fontSize: 9, fontWeight: 800 }}>NEW</div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: '#9696A8' }}>{lesson.content.length} tasks</span>
                        {lesson.completed && (
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981' }}>{lesson.score}%</span>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── AI Laboratory Folder Modal ── */}
      <AnimatePresence>
        {showAiFolder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(43,43,43,0.4)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: 20 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ background: '#F8F9FE', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 24, width: '100%', maxWidth: 800, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 30px 90px rgba(0,0,0,0.2)', overflow: 'hidden' }}
            >
              {/* Header */}
              <div style={{ padding: '24px 32px', background: '#FFFFFF', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139, 92, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <FolderOpen size={22} color="#8B5CF6" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2B2B2B', margin: 0 }}>AI Laboratory Folder</h2>
                    <p style={{ fontSize: 13, color: '#9696A8', margin: 0 }}>Review and manage your custom generated lessons</p>
                  </div>
                </div>
                <button onClick={() => setShowAiFolder(false)} style={{ background: '#F5F5F7', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9696A8' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                  {aiLessons.map(lesson => (
                    <div key={lesson.id} style={{ position: 'relative' }}>
                      <Link href={`/lesson/${lesson.id}`} style={{ textDecoration: 'none' }}>
                        <motion.div
                          whileHover={{ y: -5, boxShadow: '0 15px 35px rgba(139, 92, 246, 0.12)' }}
                          style={{
                            background: '#FFFFFF',
                            border: '1.5px solid rgba(139, 92, 246, 0.15)',
                            borderRadius: 20,
                            padding: 24,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16,
                            transition: 'all 0.25s',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Top row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(139, 92, 246, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                              <Zap size={20} fill="currentColor" />
                            </div>
                            <StarRating stars={lesson.stars || 0} size={14} />
                          </div>

                          {/* Info */}
                          <div>
                            <h3 style={{ margin: '0 0 6px 0', fontSize: 17, fontWeight: 800, color: '#2B2B2B', textTransform: 'capitalize' }}>
                              {lesson.title.replace('Topic: ', '')}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 13, color: '#9696A8' }}>{lesson.content.length} Questions</span>
                              {lesson.completed && (
                                <>
                                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EAEAEA' }} />
                                  <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>{lesson.score}% Correct</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Footer / Action */}
                          <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: lesson.completed ? '#10B981' : '#8B5CF6', letterSpacing: '0.05em' }}>
                              {lesson.completed ? 'PRACTICE AGAIN' : 'START CHALLENGE'}
                            </span>
                          </div>
                        </motion.div>
                      </Link>

                      {/* Delete Button (Floating) */}
                      <button
                        onClick={(e) => handleDeleteLesson(lesson.id, e)}
                        disabled={isDeleting === lesson.id}
                        style={{
                          position: 'absolute', top: 16, right: 16,
                          width: 32, height: 32, borderRadius: 8,
                          background: 'rgba(230,57,75,0.05)', border: '1px solid rgba(230,57,75,0.1)',
                          color: '#E63946', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s', zIndex: 5
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(230,57,75,0.15)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(230,57,75,0.05)'; }}
                      >
                        {isDeleting === lesson.id ? (
                          <div style={{ width: 14, height: 14, border: '2px solid rgba(230,57,75,0.3)', borderTopColor: '#E63946', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        ) : <Trash2 size={16} />}
                      </button>
                    </div>
                  ))}
                </div>

                {aiLessons.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ fontSize: 50, marginBottom: 16 }}>🧪</div>
                    <h3 style={{ color: '#2B2B2B', margin: 0 }}>No AI lessons yet</h3>
                    <p style={{ color: '#9696A8', marginTop: 8 }}>Generate some custom practice to fill up your laboratory!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Gen Modal ── */}
      <AnimatePresence>
        {showGenModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(43,43,43,0.4)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: 32, maxWidth: 440, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={18} color="#E63946" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 17, fontWeight: 800, color: '#2B2B2B', margin: 0, letterSpacing: '-0.02em' }}>AI Lesson Generator</h2>
                    <p style={{ fontSize: 12, color: '#9696A8', margin: 0 }}>Powered by Gemini</p>
                  </div>
                </div>
                <button onClick={() => setShowGenModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9696A8', padding: 4 }}>
                  <X size={18} />
                </button>
              </div>

              <p style={{ fontSize: 14, color: '#5A5A6E', marginBottom: 20, lineHeight: 1.6 }}>
                Tell Gemini what you want to learn — it'll build a custom lesson just for you.
              </p>

              <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5A5A6E', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Topic</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Colors, Food, Shopping..."
                    value={genTopic}
                    onChange={e => setGenTopic(e.target.value)}
                    disabled={isGenerating}
                    autoFocus
                  />
                </div>

                {error && (
                  <div style={{ padding: '10px 14px', background: 'rgba(230,57,70,0.06)', border: '1px solid rgba(230,57,70,0.2)', borderRadius: 8, fontSize: 13, color: '#E63946' }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => !isGenerating && setShowGenModal(false)}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 8,
                      background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)',
                      color: '#5A5A6E', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                    }}
                  >Cancel</button>
                  <button
                    type="submit"
                    disabled={isGenerating || !genTopic.trim()}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 8,
                      background: '#E63946', border: 'none',
                      color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                      opacity: (isGenerating || !genTopic.trim()) ? 0.5 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    {isGenerating ? (
                      <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    ) : <><Plus size={16} /> Generate</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── Rank Overview Modal ─── */
function RankOverviewModal({ onClose, currentLevel }: { onClose: () => void; currentLevel: number }) {
  console.log("RankOverviewModal Mounting with currentLevel:", currentLevel);
  const allRanks = getAllRanks();
  
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20
    }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 600,
          maxHeight: '85vh',
          background: '#FFFFFF',
          borderRadius: 24,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ 
          padding: '24px 32px', 
          borderBottom: '1px solid rgba(0,0,0,0.06)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: '#FAFBFF'
        }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#2B2B2B', margin: 0, letterSpacing: '-0.02em' }}>Leagues & Ranks</h2>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0 0' }}>Your progression path in NihonGo</p>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.04)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: '#5A5A6E', transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ 
          flex: 1, overflowY: 'auto', padding: '24px 32px',
          background: 'linear-gradient(to bottom, #FAFBFF, #FFFFFF)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {allRanks.map((rank) => {
              const isActive = currentLevel >= rank.level;
              const isCurrent = currentLevel === rank.level;
              
              return (
                <div 
                  key={rank.level}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    padding: '16px 20px',
                    borderRadius: 16,
                    background: isCurrent ? rank.bg : (isActive ? '#F9FAFB' : '#FFFFFF'),
                    border: isCurrent ? `2px solid ${rank.color}` : '1px solid rgba(0,0,0,0.05)',
                    opacity: isActive ? 1 : 0.6,
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  <LeagueEmblem iconName={rank.icon} color={rank.color} size={42} />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h4 style={{ fontSize: 15, fontWeight: isActive ? 800 : 700, color: '#2B2B2B', margin: 0 }}>
                        {rank.name}
                      </h4>
                      {isCurrent && (
                        <span style={{ 
                          fontSize: 9, fontWeight: 800, background: rank.color, color: '#fff', 
                          padding: '2px 6px', borderRadius: 6, textTransform: 'uppercase' 
                        }}>
                          Current
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0 0', fontWeight: 500 }}>
                      Level {rank.level} • {rank.totalXP.toLocaleString()} XP
                    </p>
                  </div>

                  {isActive && !isCurrent && (
                    <div style={{ color: '#10B981' }}>
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                  {!isActive && (
                    <div style={{ color: '#D1D5DB' }}>
                      <Lock size={18} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── League Emblem Component ─── */
function LeagueEmblem({ iconName, color, size = 48 }: { iconName: string; color: string; size?: number }) {
  const icons: Record<string, any> = { Shield, Compass, BookOpen, Search, Zap, Trophy, Crown, Flame };
  const IconComponent = icons[iconName] || Trophy;

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: size / 4,
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      boxShadow: `0 4px 15px ${color}33, inset 0 0 0 2px ${color}22`,
      border: `2px solid ${color}`,
      overflow: 'visible'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: color,
        filter: 'blur(15px)',
        opacity: 0.2,
        zIndex: 0
      }} />

      {/* Polish/Shine */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '30%',
        height: '30%',
        background: 'rgba(255,255,255,0.4)',
        borderRadius: '50%',
        filter: 'blur(3px)',
        zIndex: 2
      }} />

      <IconComponent 
        size={size * 0.6} 
        color={color} 
        strokeWidth={2.5}
        style={{ 
          position: 'relative', 
          zIndex: 1,
          filter: `drop-shadow(0 2px 4px ${color}44)`
        }} 
      />
    </div>
  );
}

/* ─── Sub-components ─── */

function ModuleFolderCard({ title, subtitle, lessonCount, completedCount, icon, color, onClick }: any) {
  const isComplete = completedCount === lessonCount && lessonCount > 0;
  const progress = Math.round((completedCount / (lessonCount || 1)) * 100);

  return (
    <div 
      onClick={onClick}
      style={{
        background: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        border: '1px solid rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      }}
      className="hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
      }}
    >
      {/* Background Accent */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 140, height: 140, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: color, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, fontWeight: 800, marginBottom: 16,
          boxShadow: `0 8px 16px ${color}33`
        }}>
          {icon}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#2B2B2B', margin: 0 }}>{title}</h3>
          {isComplete && <div style={{ color: '#10B981', display: 'flex' }}><CheckCircle2 size={18} /></div>}
        </div>
        <p style={{ fontSize: 13, color: '#5A5A6E', marginBottom: 20, lineHeight: 1.4 }}>{subtitle}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#9696A8', letterSpacing: '0.02em' }}>
            {completedCount}/{lessonCount} LESSONS
          </span>
          <span style={{ fontSize: 11, fontWeight: 800, color: color }}>{progress}%</span>
        </div>
        
        <div style={{ height: 6, width: '100%', background: 'rgba(0,0,0,0.04)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${progress}%`, 
            background: color, 
            borderRadius: 10,
            transition: 'width 1s ease-out'
          }} />
        </div>
      </div>
    </div>
  );
}

function StatBadge({ icon, value, label, color }: { icon: React.ReactNode; value: string | number; label: string; color: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'default' }}
    >
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: color, filter: 'blur(8px)', opacity: 0.15, zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>{icon}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontSize: 15, fontWeight: 900, color: '#1A1A1A' }}>{value}</span>
        <span style={{ fontSize: 9, fontWeight: 800, color: '#9696A8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
    </motion.div>
  );
}

function StarRating({ stars, size = 12 }: { stars: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Sparkles 
          key={i} 
          size={size} 
          fill={i <= stars ? '#FFD93D' : 'rgba(0,0,0,0.05)'} 
          color={i <= stars ? '#FFC107' : 'rgba(0,0,0,0.1)'} 
        />
      ))}
    </div>
  );
}

function VerticalProgressPath({ lessons, onRefresh, isRefreshing, bossLessonId, selectedModule, selectedSubModule }: { 
  lessons: any[]; 
  onRefresh: (id: string) => void; 
  isRefreshing: boolean; 
  bossLessonId?: string;
  selectedModule: string | null;
  selectedSubModule: string | null;
}) {
  const displayLessons = lessons;
  const completedCount = displayLessons.filter(l => l.completed).length;
  const stepHeight = 140;

  return (
    <div style={{ position: 'relative', paddingLeft: 40, borderLeft: '4px solid #EAEAEA' }}>
      {/* Red Filling Progress Bar */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${(completedCount / (displayLessons.length || 1)) * 100}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: -4,
          top: 0,
          width: 4,
          background: '#E63946',
          zIndex: 1
        }}
      />

      {displayLessons.map((lesson, i) => {
        const isCompleted = lesson.completed;
        // A lesson is "current" if it's the first one not yet completed
        const isCurrent = !isCompleted && (i === 0 || displayLessons[i - 1].completed);
        const nextLesson = displayLessons[i + 1];
        const nextLessonId = nextLesson ? nextLesson.id : (bossLessonId && lesson.id !== bossLessonId ? bossLessonId : null);

        const queryParams = new URLSearchParams();
        if (selectedModule) queryParams.set('module', selectedModule);
        if (selectedSubModule) queryParams.set('subModule', selectedSubModule);
        if (nextLessonId) queryParams.set('nextLessonId', nextLessonId);
        
        const queryString = queryParams.toString();
        const baseHref = `/lesson/${lesson.id}${queryString ? `?${queryString}` : ''}`;

        return (
          <div 
            key={lesson.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 24, 
              minHeight: lesson.isBoss ? 100 : stepHeight,
              padding: '12px 0',
              position: 'relative'
            }}
          >
            {/* Lesson Row - No outer Link to avoid nested interactive elements */}
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 24 }}>
              
              {/* Node (the circle or Crown for boss) */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: lesson.isBoss ? 5 : 0 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: lesson.isBoss ? 52 : 44,
                  height: lesson.isBoss ? 52 : 44,
                  borderRadius: '50%',
                  background: lesson.isBoss 
                    ? 'linear-gradient(135deg, #FFD93D 0%, #FF8400 100%)'
                    : isCompleted ? '#E63946' : isCurrent ? '#FFFFFF' : '#F5F5F5',
                  border: lesson.isBoss 
                    ? '3px solid #fff'
                    : `3px solid ${isCompleted ? '#E63946' : isCurrent ? '#E63946' : '#EAEAEA'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  left: lesson.isBoss ? -68 : -64,
                  zIndex: 3,
                  boxShadow: lesson.isBoss 
                    ? '0 0 15px rgba(255,132,0,0.4)'
                    : isCurrent ? '0 0 15px rgba(230,57,70,0.3)' : 'none',
                  cursor: 'pointer'
                }}
              >
                {lesson.isBoss ? (
                  <Crown size={24} color="#fff" fill="rgba(255,255,255,0.2)" />
                ) : isCompleted ? (
                  <CheckCircle2 size={24} color="#fff" />
                ) : (
                  <span style={{ fontSize: 16, fontWeight: 800, color: isCurrent ? '#E63946' : '#9696A8' }}>
                    {i + 1}
                  </span>
                )}
              </motion.div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 800,
                    color: isCompleted ? '#1A1A1A' : isCurrent ? '#E63946' : '#4A4A4A',
                    letterSpacing: '-0.02em'
                  }}>
                    {lesson.title}
                  </h3>
                  
                  {isCompleted && (
                    <span style={{
                      fontSize: 10,
                      background: '#E63946',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: 10,
                      fontWeight: 700,
                      height: 'fit-content'
                    }}>
                      {lesson.score === 100 ? 'PERFECT' : `${lesson.score}%`}
                    </span>
                  )}
                </div>

                {/* Phase Selectors or Standard Link */}
                {lesson.phases ? (
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    {[
                      { id: 'learn', label: 'Learn', icon: '📖' },
                      { id: 'practice', label: 'Practice', icon: '🎯' },
                      { id: 'play', label: 'Play', icon: '🎮' }
                    ].filter(phase => {
                      // Only show buttons for phases that actually have content
                      const phaseData = lesson.phases[phase.id as keyof typeof lesson.phases];
                      return Array.isArray(phaseData) && phaseData.length > 0;
                    }).map(phase => (
                      <Link 
                        key={phase.id}
                        href={`${baseHref}${queryString ? '&' : '?'}mode=${phase.id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 10,
                            background: phase.id === 'play' && isCurrent ? `rgba(230,57,70,0.1)` : 'var(--bg-elevated)',
                            border: `1px solid ${phase.id === 'play' && isCurrent ? '#E63946' : 'rgba(0,0,0,0.08)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            cursor: 'pointer',
                            fontSize: 11,
                            fontWeight: 700,
                            color: phase.id === 'play' && isCurrent ? '#E63946' : 'var(--text-secondary)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                          }}
                        >
                          <span>{phase.icon}</span>
                          {phase.label}
                        </motion.button>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link 
                    href={baseHref}
                    style={{ textDecoration: 'none', marginTop: 4 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 10,
                        background: isCurrent ? '#E63946' : 'var(--bg-elevated)',
                        border: `1px solid ${isCurrent ? '#E63946' : 'rgba(0,0,0,0.08)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 700,
                        color: isCurrent ? '#FFFFFF' : 'var(--text-secondary)',
                        boxShadow: isCurrent ? '0 4px 12px rgba(230,57,70,0.2)' : '0 2px 4px rgba(0,0,0,0.02)'
                      }}
                    >
                      <Play size={14} fill={isCurrent ? "white" : "none"} />
                      {isCompleted ? 'Review Lesson' : isCurrent ? 'Start Lesson' : 'Practice'}
                    </motion.button>
                  </Link>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                  <StarRating stars={lesson.stars || 0} size={14} />
                  <span style={{ fontSize: 12, color: '#9696A8', fontWeight: 600 }}>{lesson.category}</span>
                  
                  {/* Refresh Button for Lesson 5 */}
                  {lesson.order === 5 && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isRefreshing) onRefresh(lesson.id);
                      }}
                      disabled={isRefreshing}
                      style={{
                        background: 'rgba(230,57,70,0.05)',
                        border: '1px solid rgba(230,57,70,0.2)',
                        borderRadius: 6,
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        cursor: isRefreshing ? 'wait' : 'pointer',
                        color: '#E63946',
                        fontSize: 11,
                        fontWeight: 700,
                        marginLeft: 8,
                        transition: 'all 0.15s'
                      }}
                    >
                      {isRefreshing ? <div style={{ width: 12, height: 12, border: '2px solid rgba(230,57,70,0.3)', borderTopColor: '#E63946', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : <RotateCw size={12} />}
                      {isRefreshing ? 'Refreshing...' : 'Refresh Questions'}
                    </button>
                  )}
                </div>
              </div>

              {/* Next Up Badge */}
              {isCurrent && (
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{
                    background: 'rgba(230,57,70,0.1)',
                    color: '#E63946',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}
                >
                  Next Up
                </motion.div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
