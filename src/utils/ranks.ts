export interface RankInfo {
  name: string;
  color: string;
  bg: string;
  icon: string;
}

export const getRankInfo = (level: number): RankInfo => {
  if (level >= 33) return { name: "Grandmaster Immortal", color: "#FF1F1F", bg: "rgba(255, 31, 31, 0.1)", icon: "Flame" };
  if (level === 32) return { name: "Grandmaster Elite", color: "#FF4D4D", bg: "rgba(255, 77, 77, 0.1)", icon: "Flame" };
  if (level === 31) return { name: "Grandmaster Honor", color: "#FF7070", bg: "rgba(255, 112, 112, 0.1)", icon: "Flame" };
  if (level === 30) return { name: "Grandmaster", color: "#FF8F8F", bg: "rgba(255, 143, 143, 0.1)", icon: "Flame" };
  
  if (level >= 25) {
    const tier = ["I", "II", "III", "IV", "V"][Math.min(4, level - 25)];
    return { name: `Master ${tier}`, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", icon: "Crown" };
  }
  if (level >= 20) {
    const tier = ["I", "II", "III", "IV", "V"][Math.min(4, level - 20)];
    return { name: `Expert ${tier}`, color: "#D946EF", bg: "rgba(217, 70, 239, 0.1)", icon: "Trophy" };
  }
  if (level >= 15) {
    const tier = ["I", "II", "III", "IV", "V"][Math.min(4, level - 15)];
    return { name: `Specialist ${tier}`, color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)", icon: "Zap" };
  }
  if (level >= 11) {
    const tier = ["I", "II", "III", "IV"][Math.min(3, level - 11)];
    return { name: `Analyst ${tier}`, color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)", icon: "Search" };
  }
  if (level >= 7) {
    const tier = ["I", "II", "III", "IV"][Math.min(3, level - 7)];
    return { name: `Scholar ${tier}`, color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", icon: "BookOpen" };
  }
  if (level >= 4) {
    const tier = ["I", "II", "III"][Math.min(2, level - 4)];
    return { name: `Explorer ${tier}`, color: "#84CC16", bg: "rgba(132, 204, 22, 0.1)", icon: "Compass" };
  }
  
  const tier = ["I", "II", "III"][Math.min(2, level - 1)];
  return { name: `Beginner ${tier}`, color: "#64748B", bg: "rgba(100, 116, 139, 0.1)", icon: "Shield" };
};

export const getAllRanks = () => {
  const ranks = [];
  
  // Levels 1 to 35
  for (let level = 1; level <= 35; level++) {
    const info = getRankInfo(level);
    ranks.push({
      level,
      totalXP: (level - 1) * 100,
      ...info
    });
  }
  return ranks;
};
