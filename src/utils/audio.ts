export type FeedbackType = 'correct' | 'wrong';

const CORRECT_SOUNDS = [
  '/sounds/correct.mp3',      // Onii-chan
  '/sounds/chalo.mp3',        // Chalo
  '/sounds/damn-son.mp3',     // Damn Son
  '/sounds/romance.mp3',      // Romance
  '/sounds/rizz.mp3',         // Rizz
  '/sounds/dun-dun-dun.mp3'   // Dun Dun Dun
];

const WRONG_SOUNDS = [
  '/sounds/wrong.mp3',      // Cat Laugh
  '/sounds/tuco.mp3',       // Tuco Get Out
  '/sounds/vine-boom.mp3',  // Vine Boom
  '/sounds/fahh.mp3',       // Fahhh
  '/sounds/bruh.mp3',       // Bruh
  '/sounds/spongebob.mp3',  // Spongebob Fail
  '/sounds/tehelka.mp3'     // Tehelka Omlette
];

export const playFeedbackSound = async (type: FeedbackType, isAudioEnabled: boolean = true) => {
  // Sound effects removed per user request
  return;
};

export const playLevelCompleteSound = async () => {
  if (typeof window === 'undefined') return;

  try {
    const audio = new Audio('/sounds/complete.mp3');
    audio.volume = 1.0;
    await audio.play();
  } catch (err) {
    console.warn('Local complete sound failed, falling back to synthesis:', err);
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [
      { freq: 523.25, time: 0 },
      { freq: 659.25, time: 0.1 },
      { freq: 783.99, time: 0.2 },
      { freq: 1046.50, time: 0.3 },
      { freq: 1318.51, time: 0.45 }
    ];
    notes.forEach(n => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);
      g.gain.setValueAtTime(0.4, ctx.currentTime + n.time);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + 0.8);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(ctx.currentTime + n.time);
      o.stop(ctx.currentTime + n.time + 1.0);
    });
  }
};
