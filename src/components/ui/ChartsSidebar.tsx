"use client";

import React, { useState } from 'react';
import { BookOpen, Search, X, Volume2, ChevronLeft, ChevronRight, Maximize2, Check, Swords } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { ChartQuiz } from '@/components/game/ChartQuiz';

const HIRAGANA = [
  { k: 'あ', r: 'a', m: 'Looks like an "A" for Antenna.' },
  { k: 'い', r: 'i', m: 'Two eels "I" side by side.' },
  { k: 'う', r: 'u', m: 'Ooo! My back is bent like a "U".' },
  { k: 'え', r: 'e', m: 'An exotic bird sitting on a branch.' },
  { k: 'お', r: 'o', m: 'A golfer hitting a ball "O"ver the hole.' },
  { k: 'か', r: 'ka', m: 'A "Ka"yak paddle cutting through water.' },
  { k: 'き', r: 'ki', m: 'Looks like a "Ki"ey.' },
  { k: 'く', r: 'ku', m: 'The open beak of a "Ku"cko bird.' },
  { k: 'け', r: 'ke', m: 'A "Ke"g of sake.' },
  { k: 'こ', r: 'ko', m: 'Two "Ko"i fish swimming.' },
  { k: 'さ', r: 'sa', m: 'A "Sa"ke bottle and cup.' },
  { k: 'し', r: 'shi', m: 'She has long "Shi"ny hair.' },
  { k: 'す', r: 'su', m: 'A "Su"per loop-de-loop.' },
  { k: 'せ', r: 'se', m: 'A "Se"xy tooth.' },
  { k: 'そ', r: 'so', m: 'A "So"wing needle.' },
  { k: 'た', r: 'ta', m: 'Looks like the letters "t" and "a".' },
  { k: 'ち', r: 'chi', m: 'A "Chi"erleader.' },
  { k: 'つ', r: 'tsu', m: 'A big "Tsu"nami wave.' },
  { k: 'て', r: 'te', m: 'A "Te"nnis racket.' },
  { k: 'と', r: 'to', m: 'A "To"e with a splinter.' },
  { k: 'な', r: 'na', m: 'A "Na"nna praying at a cross.' },
  { k: 'に', r: 'ni', m: 'A "Ni"ce "Ni"dle and thread.' },
  { k: 'ぬ', r: 'nu', m: '"Nu"mismatic noodles.' },
  { k: 'ね', r: 'ne', m: 'A a "Ne"ko (cat) catching a mouse.' },
  { k: 'の', r: 'no', m: 'A "No" entry sign.' },
  { k: 'は', r: 'ha', m: 'A "Ha"ha laughing face.' },
  { k: 'ひ', r: 'hi', m: 'A "Hi"p-hooray smile.' },
  { k: 'ふ', r: 'fu', m: 'Mount "Fu"ji.' },
  { k: 'へ', r: 'he', m: 'A "He"avenly mountain.' },
  { k: 'ほ', r: 'ho', m: 'A "Ho"t "Ho"use with a chimney.' },
  { k: 'ま', r: 'ma', m: 'A "Ma"st on a ship.' },
  { k: 'み', r: 'mi', m: 'Looks like the number "21" (mi-ni-i).' },
  { k: 'む', r: 'mu', m: 'A "Mu"ooing cow.' },
  { k: 'め', r: 'me', m: 'A "Me"ssy noodle.' },
  { k: 'も', r: 'mo', m: 'A "Mo"re fish on a hook.' },
  { k: 'や', r: 'ya', m: 'A "Ya"k with horns.' },
  { k: '', r: '', m: '' },
  { k: 'ゆ', r: 'yu', m: 'A "Yu"nique fish.' },
  { k: '', r: '', m: '' },
  { k: 'よ', r: 'yo', m: 'A "Yo-yo" hanging.' },
  { k: 'ら', r: 'ra', m: 'A "Ra"bbit with long ears.' },
  { k: 'り', r: 'ri', m: '"Ri"ver reeds.' },
  { k: 'る', r: 'ru', m: 'A "Ru"by in a loop.' },
  { k: 'れ', r: 're', m: 'A "Re"sting person.' },
  { k: 'ろ', r: 'ro', m: 'A "Ro"ad with a dead end.' },
  { k: 'わ', r: 'wa', m: 'A "Wa"sp flying away.' },
  { k: '', r: '', m: '' },
  { k: '', r: '', m: '' },
  { k: '', r: '', m: '' },
  { k: 'を', r: 'wo', m: 'A "Wo"lf howling at the moon.' },
  { k: 'ん', r: 'n', m: 'Looks like the letter "n".' }
];

const KATAKANA = [
  { k: 'ア', r: 'a', m: 'An "A"ngle.' },
  { k: 'イ', r: 'i', m: 'An "I"bis bird.' },
  { k: 'ウ', r: 'u', m: 'Look "U"p!' },
  { k: 'エ', r: 'e', m: 'An "E"ngineer\'s tool.' },
  { k: 'オ', r: 'o', m: 'An "O"perator.' },
  { k: 'カ', r: 'ka', m: 'A "Ka"yak.' },
  { k: 'キ', r: 'ki', m: 'A "Ki"wi bird.' },
  { k: 'ク', r: 'ku', m: 'A "Ku"chiku (destroyer) ship bow.' },
  { k: 'ケ', r: 'ke', m: 'A "Ke"ttle.' },
  { k: 'コ', r: 'ko', m: 'A "Ko"rner.' },
  { k: 'サ', r: 'sa', m: 'A "Sa"ucer.' },
  { k: 'シ', r: 'shi', m: 'A "Shi"p\'s mast.' },
  { k: 'ス', r: 'su', m: 'A "Su"per skier.' },
  { k: 'セ', r: 'se', m: 'A "Se"at.' },
  { k: 'ソ', r: 'so', m: 'A "So"lo needle.' },
  { k: 'タ', r: 'ta', m: 'A "Ta"ll building.' },
  { k: 'チ', r: 'chi', m: 'A "Chi"pmunk.' },
  { k: 'ツ', r: 'tsu', m: '"Tsu"nami wave.' },
  { k: 'テ', r: 'te', m: 'A "Te"nt.' },
  { k: 'ト', r: 'to', m: 'A "To"tem pole.' },
  { k: 'ナ', r: 'na', m: 'A "Na"pkin.' },
  { k: 'ニ', r: 'ni', m: 'A "Ni"ce needle.' },
  { k: 'ヌ', r: 'nu', m: '"Nu"clear sign.' },
  { k: 'ネ', r: 'ne', m: 'A "Ne"t.' },
  { k: 'ノ', r: 'no', m: 'A "No" smoking sign.' },
  { k: 'ハ', r: 'ha', m: 'A "Ha"ystack.' },
  { k: 'ヒ', r: 'hi', m: 'He has a big "Hi"p.' },
  { k: 'フ', r: 'fu', m: '"Fu"ji mountain.' },
  { k: 'ヘ', r: 'he', m: 'A "He"avenly hill.' },
  { k: 'ホ', r: 'ho', m: 'A "Ho"ly cross.' },
  { k: 'マ', r: 'ma', m: 'A "Ma"sk.' },
  { k: 'ミ', r: 'mi', m: 'Three "Mi"ssiles.' },
  { k: 'ム', r: 'mu', m: '"Mu"mbling face.' },
  { k: 'メ', r: 'me', m: 'A "Me"dal.' },
  { k: 'モ', r: 'mo', m: 'A "Mo"nitor.' },
  { k: 'ヤ', r: 'ya', m: 'A "Ya"cht.' },
  { k: '', r: '', m: '' },
  { k: 'ユ', r: 'yu', m: 'A "Yu"nit.' },
  { k: '', r: '', m: '' },
  { k: 'ヨ', r: 'yo', m: 'A "Yo"ka-lay-lee.' },
  { k: 'ラ', r: 'ra', m: 'A "Ra"dar.' },
  { k: 'り', r: 'ri', m: '"Ri"ver.' },
  { k: 'ル', r: 'ru', m: 'A "Ru"eler.' },
  { k: 'レ', r: 're', m: 'A "Re"cord.' },
  { k: 'ロ', r: 'ro', m: 'A "Ro"ad.' },
  { k: 'ワ', r: 'wa', m: 'A "Wa"ll.' },
  { k: '', r: '', m: '' },
  { k: '', r: '', m: '' },
  { k: '', r: '', m: '' },
  { k: 'ヲ', r: 'wo', m: 'A "Wo"lf.' },
  { k: 'ン', r: 'n', m: 'Look at the "n" sign.' }
];

const COMMON_WORDS = [
  // Prioritize words with images for easy discovery
  { j: '山', r: 'yama', h: 'やま', e: 'Mountain', img: '/images/kanji/mountain.png' },
  { j: '水', r: 'mizu', h: 'みず', e: 'Water', img: '/images/kanji/water.png' },
  { j: '猫', r: 'neko', h: 'ねこ', e: 'Cat', img: '/images/kanji/cat.png' },
  { j: '犬', r: 'inu', h: 'いぬ', e: 'Dog', img: '/images/kanji/dog.png' },
  { j: '火', r: 'hi', h: 'ひ', e: 'Fire', img: '/images/kanji/fire.png' },
  { j: '木', r: 'ki', h: 'き', e: 'Tree', img: '/images/kanji/tree.png' },
  { j: '森', r: 'mori', h: 'もり', e: 'Forest', img: '/images/kanji/forest.png' },
  { j: '花', r: 'hana', h: 'はな', e: 'Flower', img: '/images/kanji/flower.png' },
  { j: '日', r: 'nichi', h: 'ひ', e: 'Sun / Day', img: '/images/kanji/sun.png' },
  { j: '月', r: 'getsu', h: 'つき', e: 'Moon / Month', img: '/images/kanji/moon.png' },
  { j: '雨', r: 'ame', h: 'あめ', e: 'Rain', img: '/images/kanji/rain.png' },
  { j: '雪', r: 'yuki', h: 'ゆき', e: 'Snow', img: '/images/kanji/snow.png' },
  { j: '風', r: 'kaze', h: 'かぜ', e: 'Wind', img: '/images/kanji/wind.png' },
  { j: '道', r: 'michi', h: 'みち', e: 'Road / Path', img: '/images/kanji/road.png' },
  { j: '人', r: 'hito', h: 'ひと', e: 'Person', img: '/images/kanji/person.png' },
  { j: '本', r: 'hon', h: 'ほん', e: 'Book', img: '/images/kanji/book.png' },
  { j: '目', r: 'me', h: 'め', e: 'Eye', img: '/images/kanji/eye.png' },
  
  // Standard words
  { j: '私', r: 'watashi', h: 'わたし', e: 'I / Me' },
  { j: 'あなた', r: 'anata', h: 'あなた', e: 'You' },
  { j: 'これ', r: 'kore', h: 'これ', e: 'This' },
  { j: 'それ', r: 'sore', h: 'それ', e: 'That' },
  { j: '何', r: 'nani', h: 'なに', e: 'What' },
  { j: 'はい', r: 'hai', h: 'はい', e: 'Yes' },
  { j: 'いいえ', r: 'iie', h: 'いいえ', e: 'No' },
  { j: '先生', r: 'sensei', h: 'せんせい', e: 'Teacher' },
  { j: '学生', r: 'gakusei', h: 'がくせい', e: 'Student' },
  { j: '学校', r: 'gakkou', h: 'がっこう', e: 'School' },
  { j: '日本', r: 'nihon', h: 'にほん', e: 'Japan' },
  { j: '日本語', r: 'nihongo', h: 'にほんご', e: 'Japanese' },
  { j: '食べる', r: 'taberu', h: 'たべる', e: 'To eat' },
  { j: '飲む', r: 'nomu', h: 'のむ', e: 'To drink' },
  { j: '行く', r: 'iku', h: 'いく', e: 'To go' },
  { j: '見る', r: 'miru', h: 'みる', e: 'To see' },
  { j: '愛', r: 'ai', h: 'あい', e: 'Love' },
  { j: '友', r: 'tomo', h: 'とも', e: 'Friend' },
  { j: '家族', r: 'kazoku', h: 'かぞく', e: 'Family' },
  { j: '家', r: 'ie', h: 'いえ', e: 'House' },
  { j: '今日', r: 'kyou', h: 'きょう', e: 'Today' },
  { j: '明日', r: 'ashita', h: 'あした', e: 'Tomorrow' },
  { j: '今', r: 'ima', h: 'いま', e: 'Now' },
  { j: '時間', r: 'jikan', h: 'じかん', e: 'Time' },
  { j: '子供', r: 'kodomo', h: 'こども', e: 'Child' },
  { j: '男', r: 'otoko', h: 'おとこ', e: 'Man' },
  { j: '女', r: 'onna', h: 'おんな', e: 'Woman' },
  { j: '心', r: 'kokoro', h: 'こころ', e: 'Heart' },
  { j: '空', r: 'sora', h: 'そら', e: 'Sky' },
  { j: '海', r: 'umi', h: 'うみ', e: 'Sea' },
  { j: '花', r: 'hana', h: 'はな', e: 'Flower' },
  { j: '雨', r: 'ame', h: 'あめ', e: 'Rain' },
  { j: '雪', r: 'yuki', h: 'ゆき', e: 'Snow' },
  { j: '風', r: 'kaze', h: 'かぜ', e: 'Wind' },
  { j: '森', r: 'mori', h: 'もり', e: 'Forest' },
  { j: '道', r: 'michi', h: 'みち', e: 'Road' },
  { j: '手', r: 'te', h: 'て', e: 'Hand' },
  { j: '足', r: 'ashi', h: 'あし', e: 'Leg' },
  { j: '口', r: 'kuchi', h: 'くち', e: 'Mouth' },
  { j: '耳', r: 'mimi', h: 'みみ', e: 'Ear' },
  { j: '顔', r: 'kao', h: 'かお', e: 'Face' },
  { j: '体', r: 'karada', h: 'からだ', e: 'Body' },
  { j: '朝', r: 'asa', h: 'あさ', e: 'Morning' },
  { j: '昼', r: 'hiru', h: 'ひる', e: 'Daytime' },
  { j: '夜', r: 'yoru', h: 'よる', e: 'Night' },
  { j: '青', r: 'ao', h: 'あお', e: 'Blue' },
  { j: '赤', r: 'aka', h: 'あか', e: 'Red' },
  { j: '白', r: 'shiro', h: 'しろ', e: 'White' },
  { j: '黒', r: 'kuro', h: 'くろ', e: 'Black' },
  { j: '緑', r: 'midori', h: 'みどり', e: 'Green' },
  { j: '言葉', r: 'kotoba', h: 'ことば', e: 'Word' },
  { j: '仕事', r: 'shigoto', h: 'しごと', e: 'Work' },
  { j: 'お金', r: 'okane', h: 'おかね', e: 'Money' },
  { j: '夢', r: 'yume', h: 'ゆめ', e: 'Dream' },
  { j: '歌', r: 'uta', h: 'うた', e: 'Song' },
  { j: '映画', r: 'eiga', h: 'えいが', e: 'Movie' },
  { j: '音楽', r: 'ongaku', h: 'おんがく', e: 'Music' },
  { j: '写真', r: 'shashin', h: 'しゃしん', e: 'Photo' },
  { j: '天気', r: 'tenki', h: 'てんき', e: 'Weather' },
  { j: '世界', r: 'sekai', h: 'せかい', e: 'World' },
  { j: '国', r: 'kuni', h: 'くに', e: 'Country' },
  { j: '車', r: 'kuruma', h: 'くるま', e: 'Car' },
  { j: '電車', r: 'densha', h: 'でんしゃ', e: 'Train' },
  { j: '電話', r: 'denwa', h: 'でんわ', e: 'Phone' },
  { j: '手紙', r: 'tegami', h: 'てがみ', e: 'Letter' },
  { j: '鍵', r: 'kagi', h: 'かぎ', e: 'Key' },
  { j: '机', r: 'tsukue', h: 'つくえ', e: 'Desk' },
  { j: '椅子', r: 'isu', h: 'いす', e: 'Chair' },
  { j: '料理', r: 'ryouri', h: 'りょうり', e: 'Cooking' },
  { j: '朝ご飯', r: 'asagohan', h: 'あさごはん', e: 'Breakfast' },
  { j: '昼ご飯', r: 'hirugohan', h: 'ひるごはん', e: 'Lunch' },
  { j: '晩ご飯', r: 'bangohan', h: 'ばんごはん', e: 'Dinner' },
  { j: 'お茶', r: 'ocha', h: 'おちゃ', e: 'Tea' },
  { j: '寿司', r: 'sushi', h: 'すし', e: 'Sushi' },
  { j: 'ラーメン', r: 'raamen', h: 'らーめん', e: 'Ramen' },
  { j: '美味しい', r: 'oishii', h: 'おいしい', e: 'Delicious' },
  { j: '楽しい', r: 'tanoshii', h: 'たのしい', e: 'Fun' },
  { j: '嬉しい', r: 'ureshii', h: 'うれしい', e: 'Happy' },
  { j: '悲しい', r: 'kanashii', h: 'かなしい', e: 'Sad' },
  { j: '忙しい', r: 'isogashii', h: 'いそがしい', e: 'Busy' },
  { j: '静か', r: 'shizuka', h: 'しずか', e: 'Quiet' },
  { j: '綺麗', r: 'kirei', h: 'きれい', e: 'Beautiful' },
  { j: '有名', r: 'yuumei', h: 'ゆうめい', e: 'Famous' },
  { j: '便利', r: 'benri', h: 'べんり', e: 'Convenient' },
  { j: '上手', r: 'jouzu', h: 'じょうず', e: 'Skillful' },
  { j: '下手', r: 'heta', h: 'へた', e: 'Unskillful' },
  { j: '大きい', r: 'ookii', h: 'おおきい', e: 'Big' },
  { j: '小さい', r: 'chiisai', h: 'ちいさい', e: 'Small' },
  { j: '新しい', r: 'atarashii', h: 'あたらしい', e: 'New' },
  { j: '古い', r: 'furui', h: 'ふるい', e: 'Old' },
  { j: '暑い', r: 'atsui', h: 'あつい', e: 'Hot' },
  { j: '寒い', r: 'samui', h: 'さむい', e: 'Cold' },
  { j: '終わり', r: 'owari', h: 'おわり', e: 'End' }
];

const KANA_ROWS = [
  { name: 'A-row', start: 0, end: 5 },
  { name: 'K-row', start: 5, end: 10 },
  { name: 'S-row', start: 10, end: 15 },
  { name: 'T-row', start: 15, end: 20 },
  { name: 'N-row', start: 20, end: 25 },
  { name: 'H-row', start: 25, end: 30 },
  { name: 'M-row', start: 30, end: 35 },
  { name: 'Y-row', start: 35, end: 40 },
  { name: 'R-row', start: 40, end: 45 },
  { name: 'W-row', start: 45, end: 50 },
];


function CharButton({ item, isSelected, isSelectionMode, onClick, onExpand, onMouseDown, onMouseEnter }: { 
  item: { k: string; r: string }; 
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onClick: () => void; 
  onExpand?: () => void;
  onMouseDown?: () => void;
  onMouseEnter?: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  if (!item.k) return <div />;
  return (
    <div 
      onMouseDown={onMouseDown}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.();
      }}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      <button
        onClick={onClick}
        style={{
          width: '100%',
          aspectRatio: '1',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          borderRadius: 8,
          border: `2px solid ${isSelected ? 'var(--accent)' : hovered ? 'var(--accent)' : 'var(--border)'}`,
          background: isSelected ? 'rgba(230,57,70,0.1)' : hovered ? 'var(--bg-active)' : 'var(--bg-elevated)',
          cursor: 'pointer',
          transition: 'all 0.15s',
          padding: '2px 1px',
          position: 'relative'
        }}
      >
        {isSelectionMode && (
          <div style={{
            position: 'absolute', top: 2, right: 2,
            width: 12, height: 12, borderRadius: '50%',
            border: '1px solid var(--border)',
            background: isSelected ? 'var(--accent)' : 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {isSelected && <Check size={8} color="white" strokeWidth={4} />}
          </div>
        )}
        <span style={{ fontSize: 16, color: isSelected ? 'var(--accent)' : 'var(--text-primary)', lineHeight: 1, fontWeight: isSelected ? 800 : 500 }}>{item.k}</span>
        <span style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 1, textTransform: 'uppercase' as const }}>{item.r}</span>
      </button>
      {hovered && onExpand && (
        <button
          onClick={(e) => { e.stopPropagation(); onExpand(); }}
          style={{
            position: 'absolute', top: -4, right: -4,
            width: 20, height: 20, borderRadius: '50%',
            background: 'var(--accent)', color: 'white',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 10
          }}
        >
          <Maximize2 size={10} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}

function WordButton({ word, isSelected, isSelectionMode, onClick, onExpand, onMouseDown, onMouseEnter }: { 
  word: { j: string; r: string; e: string }; 
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onClick: () => void; 
  onExpand?: () => void;
  onMouseDown?: () => void;
  onMouseEnter?: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.();
      }}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      <button
        onClick={onClick}
        style={{
          width: '100%', textAlign: 'left',
          padding: '8px 10px',
          background: isSelected ? 'rgba(230,57,70,0.05)' : hovered ? 'var(--bg-active)' : 'var(--bg-elevated)',
          border: `2px solid ${isSelected ? 'var(--accent)' : hovered ? 'var(--border-strong)' : 'var(--border)'}`,
          borderRadius: 8,
          cursor: 'pointer',
          transition: 'all 0.15s',
          display: 'flex', flexDirection: 'column', gap: 1,
          position: 'relative'
        }}
      >
        {isSelectionMode && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            width: 16, height: 16, borderRadius: '50%',
            border: '1px solid var(--border)',
            background: isSelected ? 'var(--accent)' : 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {isSelected && <Check size={10} color="white" strokeWidth={4} />}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 18, color: 'var(--text-primary)', lineHeight: 1 }}>{word.j}</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{word.r}</span>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, opacity: 0.9 }}>{word.e}</p>
      </button>
      {hovered && onExpand && (
        <button
          onClick={(e) => { e.stopPropagation(); onExpand(); }}
          style={{
            position: 'absolute', top: 4, right: 4,
            width: 20, height: 20, borderRadius: '50%',
            background: 'var(--accent)', color: 'white',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 10
          }}
        >
          <Maximize2 size={10} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}

export const ChartsSidebar = () => {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana' | 'kanji'>('hiragana');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItem, setExpandedItem] = useState<any | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'select' | 'deselect' | null>(null);

  const handleMouseDown = (item: any) => {
    if (!isSelectionMode) return;
    setIsDragging(true);
    const key = item.k || item.j;
    const isAlreadySelected = !!selectedItems.find(i => (i.k || i.j) === key);
    const newType = isAlreadySelected ? 'deselect' : 'select';
    setDragType(newType);
    applySelection(item, newType);
  };

  const handleMouseEnter = (item: any) => {
    if (isDragging && dragType) {
      applySelection(item, dragType);
    }
  };

  const applySelection = (item: any, type: 'select' | 'deselect') => {
    const key = item.k || item.j;
    const exists = selectedItems.find(i => (i.k || i.j) === key);
    
    if (type === 'select' && !exists) {
      setSelectedItems(prev => [...prev, item]);
    } else if (type === 'deselect' && exists) {
      setSelectedItems(prev => prev.filter(i => (i.k || i.j) !== key));
    }
  };

  const toggleItem = (item: any) => {
    if (!isSelectionMode) {
      speak(item.k || item.j, item.h);
      return;
    }
    // Simple click toggle is handled by handleMouseDown now for better consistency with drag
  };

  const selectRow = (rowIndices: { start: number; end: number }) => {
    const list = activeTab === 'hiragana' ? HIRAGANA : KATAKANA;
    const rowItems = list.slice(rowIndices.start, rowIndices.end).filter(i => i.k);
    
    // If all items in the row are already selected, unselect them. Otherwise, select all.
    const allSelected = rowItems.every(ri => selectedItems.find(si => si.k === ri.k));
    
    if (allSelected) {
      setSelectedItems(selectedItems.filter(si => !rowItems.find(ri => ri.k === si.k)));
    } else {
      const newItems = [...selectedItems];
      rowItems.forEach(ri => {
        if (!newItems.find(si => si.k === ri.k)) newItems.push(ri);
      });
      setSelectedItems(newItems);
    }
  };

  const speak = (text: string, phonetic?: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phonetic || text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const filteredWords = COMMON_WORDS.filter(w =>
    w.j.includes(searchTerm) ||
    w.r.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.e.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIndices = () => {
    let list: any[] = [];
    if (activeTab === 'hiragana') list = HIRAGANA.filter(i => i.k);
    else if (activeTab === 'katakana') list = KATAKANA.filter(i => i.k);
    else list = COMMON_WORDS;

    const currentKey = expandedItem?.k || expandedItem?.j;
    const currentIdx = list.findIndex(i => (i.k || i.j) === currentKey);
    return { list, currentIdx };
  };

  const handlePrev = () => {
    const { list, currentIdx } = getIndices();
    if (currentIdx > 0) {
      const newItem = list[currentIdx - 1];
      setExpandedItem(newItem);
      speak(newItem.k || newItem.j, newItem.h);
    }
  };

  const handleNext = () => {
    const { list, currentIdx } = getIndices();
    if (currentIdx < list.length - 1) {
      const newItem = list[currentIdx + 1];
      setExpandedItem(newItem);
      speak(newItem.k || newItem.j, newItem.h);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: 'calc(100vh - 120px)',
      maxHeight: 900,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <BookOpen size={15} color="#E63946" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Reference Charts
          </span>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 2,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 3,
          marginBottom: 12,
        }}>
          {(['hiragana', 'katakana', 'kanji'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '5px 4px',
                borderRadius: 6, border: 'none',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                textTransform: 'capitalize' as const,
                transition: 'background 0.15s, color 0.15s',
                background: activeTab === tab ? 'var(--bg-card)' : 'transparent',
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Selection Mode Toggle */}
        <div style={{ padding: '0 16px', marginBottom: 12 }}>
          <button
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              if (!isSelectionMode) setSelectedItems([]); // Clear selection when entering
              else setSelectedItems([]); // Clear selection when exiting
            }}
            style={{
              width: '100%', padding: '8px', borderRadius: 8,
              background: isSelectionMode ? 'rgba(230,57,70,0.1)' : 'var(--bg-elevated)',
              border: `1px solid ${isSelectionMode ? 'var(--accent)' : 'var(--border)'}`,
              color: isSelectionMode ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s'
            }}
          >
            <Check size={14} /> {isSelectionMode ? 'CANCEL SELECTION' : 'SELECT FOR TEST'}
          </button>
        </div>
      </div>

      <div 
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        style={{ flex: 1, overflowY: 'auto', padding: '0 12px 16px', userSelect: isSelectionMode ? 'none' : 'auto' }}
      >
        {activeTab === 'hiragana' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 3 }}>
              {HIRAGANA.map((item, i) => {
                const isSelected = !!selectedItems.find(si => si.k === item.k);
                return item.k
                  ? <CharButton 
                      key={`h-${i}`} 
                      item={item} 
                      isSelected={isSelected} 
                      isSelectionMode={isSelectionMode} 
                      onClick={() => toggleItem(item)} 
                      onExpand={() => setExpandedItem(item)}
                      onMouseDown={() => handleMouseDown(item)}
                      onMouseEnter={() => handleMouseEnter(item)}
                    />
                  : <div key={`h-${i}`} />;
              })}
            </div>
            {isSelectionMode && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '8px 0', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', width: '100%', marginBottom: 4 }}>QUICK SELECT ROWS</span>
                {KANA_ROWS.map(row => (
                  <button
                    key={row.name}
                    onClick={() => selectRow(row)}
                    style={{
                      padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                      color: 'var(--text-primary)', cursor: 'pointer'
                    }}
                  >
                    {row.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'katakana' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 3 }}>
              {KATAKANA.map((item, i) => {
                const isSelected = !!selectedItems.find(si => si.k === item.k);
                return item.k
                  ? <CharButton 
                      key={`k-${i}`} 
                      item={item} 
                      isSelected={isSelected} 
                      isSelectionMode={isSelectionMode} 
                      onClick={() => toggleItem(item)} 
                      onExpand={() => setExpandedItem(item)} 
                      onMouseDown={() => handleMouseDown(item)}
                      onMouseEnter={() => handleMouseEnter(item)}
                    />
                  : <div key={`h-${i}`} />;
              })}
            </div>
            {isSelectionMode && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '8px 0', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', width: '100%', marginBottom: 4 }}>QUICK SELECT ROWS</span>
                {KANA_ROWS.map(row => (
                  <button
                    key={row.name}
                    onClick={() => selectRow(row)}
                    style={{
                      padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                      color: 'var(--text-primary)', cursor: 'pointer'
                    }}
                  >
                    {row.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'kanji' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 4 }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search words..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: 32, paddingRight: 12,
                  paddingTop: 8, paddingBottom: 8,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text-primary)',
                  fontSize: 13, outline: 'none',
                }}
              />
            </div>

            {filteredWords.map((word, i) => {
              const isSelected = !!selectedItems.find(si => si.j === word.j);
              return (
                <WordButton 
                  key={`w-${i}`} 
                  word={word} 
                  isSelected={isSelected} 
                  isSelectionMode={isSelectionMode} 
                  onClick={() => toggleItem(word)} 
                  onExpand={() => setExpandedItem(word)} 
                  onMouseDown={() => handleMouseDown(word)}
                  onMouseEnter={() => handleMouseEnter(word)}
                />
              );
            })}

            {filteredWords.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {selectedItems.length > 0 ? (
          <button 
            onClick={() => {
              const shuffled = [...selectedItems].sort(() => 0.5 - Math.random());
              setSelectedItems(shuffled);
              setShowQuiz(true);
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #FFD93D 0%, #FF8400 100%)',
              color: '#3d2b1f',
              border: 'none',
              fontSize: 14,
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 12px rgba(255, 132, 0, 0.2)'
            }}
          >
            <Swords size={18} />
            START TEST ({selectedItems.length})
          </button>
        ) : (
          <button 
            onClick={() => setExpandedItem(activeTab === 'hiragana' ? HIRAGANA[0] : activeTab === 'katakana' ? KATAKANA[0] : COMMON_WORDS[0])}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: 8,
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            <Maximize2 size={14} />
            EXPAND STUDY MODE
          </button>
        )}
      </div>

      {showQuiz && (
        <ChartQuiz 
          items={selectedItems} 
          onClose={() => {
            setShowQuiz(false);
            setSelectedItems([]);
            setIsSelectionMode(false);
          }} 
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
        />
      )}

      {/* Study Mode Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {expandedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
                zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24
              }}
              onClick={() => setExpandedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%', maxWidth: 450,
                  background: '#FFFFFF',
                  borderRadius: 24,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  position: 'relative'
                }}
              >
                {/* Modal Header */}
                <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {activeTab} Study
                  </span>
                  <button 
                    onClick={() => setExpandedItem(null)}
                    style={{ background: 'var(--bg-elevated)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Content */}
                <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                  <div style={{
                    fontSize: 120, fontWeight: 700, color: 'var(--accent)', 
                    lineHeight: 1, textShadow: '0 10px 20px rgba(230, 57, 70, 0.1)'
                  }}>
                    {expandedItem.k || expandedItem.j}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{expandedItem.r}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pronunciation</div>
                    </div>
                    <div style={{ width: 1, height: 30, background: 'var(--border)' }} />
                    <button 
                      onClick={() => speak(expandedItem.k || expandedItem.j, expandedItem.h)}
                      style={{
                        width: 56, height: 56, borderRadius: '50%', background: 'var(--accent)',
                        color: 'white', border: 'none', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(230, 57, 70, 0.3)',
                        gap: 2
                      }}
                    >
                      <Volume2 size={24} />
                      <span style={{ fontSize: 9, fontWeight: 800 }}>REPEAT</span>
                    </button>
                  </div>

                  {/* Detailed Info */}
                  <div style={{ 
                    width: '100%', background: 'var(--bg-elevated)', 
                    borderRadius: 16, padding: 24, textAlign: 'center'
                  }}>
                    {activeTab === 'kanji' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {expandedItem.img ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase' }}>Visual Illustration</div>
                            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', background: '#fff', border: '1px solid var(--border)' }}>
                              <img src={expandedItem.img} alt={expandedItem.e} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Reference Icon</div>
                            <div style={{ 
                              fontSize: 72, background: '#fff', borderRadius: 12, 
                              border: '1px solid var(--border)', padding: '20px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              {(() => {
                                const e = expandedItem.e.toLowerCase();
                                if (e.includes('dog')) return '🐕';
                                if (e.includes('house')) return '🏠';
                                if (e.includes('school')) return '🏫';
                                if (e.includes('teacher')) return '👨‍🏫';
                                if (e.includes('student')) return '🧑‍🎓';
                                if (e.includes('eat')) return '🍱';
                                if (e.includes('drink')) return '🍵';
                                if (e.includes('car')) return '🚗';
                                if (e.includes('train')) return '🚄';
                                if (e.includes('phone')) return '📱';
                                if (e.includes('money')) return '💰';
                                if (e.includes('love')) return '❤️';
                                if (e.includes('friend')) return '🤝';
                                if (e.includes('family')) return '👪';
                                if (e.includes('today')) return '📅';
                                if (e.includes('morning')) return '🌅';
                                if (e.includes('night')) return '🌃';
                                if (e.includes('blue')) return '🔵';
                                if (e.includes('red')) return '🔴';
                                if (e.includes('white')) return '⚪';
                                if (e.includes('black')) return '⚫';
                                if (e.includes('green')) return '🟢';
                                if (e.includes('weather')) return '☀️';
                                if (e.includes('world')) return '🌍';
                                if (e.includes('country')) return '🎌';
                                if (e.includes('book')) return '📚';
                                if (e.includes('letter')) return '✉️';
                                if (e.includes('key')) return '🔑';
                                if (e.includes('desk')) return '🖥️';
                                if (e.includes('chair')) return '🪑';
                                if (e.includes('sushi')) return '🍣';
                                if (e.includes('ramen')) return '🍜';
                                if (e.includes('delicious')) return '😋';
                                if (e.includes('fun')) return '🎉';
                                if (e.includes('beautiful')) return '✨';
                                return '📖';
                              })()}
                            </div>
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{expandedItem.e}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Meaning</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase' }}>Mnemonic</div>
                        <div style={{ fontSize: 18, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.4 }}>
                          {expandedItem.m || "No mnemonic data yet."}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Footer */}
                <div style={{ padding: '16px 24px', display: 'flex', gap: 12, borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                  <button 
                    onClick={handlePrev}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '12px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)',
                      color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button 
                    onClick={handleNext}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '12px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)',
                      color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
