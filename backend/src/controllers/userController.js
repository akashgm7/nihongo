const db = require('../lib/jsonDb');

const RECOVERY_TIME_MS = 15 * 60 * 1000; // 15 minutes
const MAX_HEARTS = 5;

const calculateHeartRecovery = (user) => {
  if (user.hearts >= MAX_HEARTS) {
    return { hearts: MAX_HEARTS, lastHeartRefillTime: null };
  }

  if (!user.lastHeartRefillTime) {
    return { hearts: user.hearts, lastHeartRefillTime: new Date() };
  }

  const now = new Date();
  const lastRefill = new Date(user.lastHeartRefillTime);
  const elapsed = now - lastRefill;

  if (elapsed >= RECOVERY_TIME_MS) {
    const heartsToAdd = Math.floor(elapsed / RECOVERY_TIME_MS);
    const newHearts = Math.min(MAX_HEARTS, user.hearts + heartsToAdd);
    
    // If we recovered to max, clear the timer. 
    // Otherwise, set the new refill time to the most recent 15m interval.
    const newRefillTime = newHearts >= MAX_HEARTS 
      ? null 
      : new Date(lastRefill.getTime() + (heartsToAdd * RECOVERY_TIME_MS));

    return { hearts: newHearts, lastHeartRefillTime: newRefillTime };
  }

  return { hearts: user.hearts, lastHeartRefillTime: user.lastHeartRefillTime };
};

const updateUserStreak = (userId) => {
  const user = db.find('users', u => u.id === userId);
  if (!user) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let lastActive = user.lastActive ? new Date(user.lastActive) : null;
  if (!lastActive) {
    return db.update('users', userId, { streak: 1, lastActive: now });
  }

  const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
  const diffTime = today - lastActiveDay;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let newStreak = user.streak || 0;

  if (diffDays === 1) {
    // Active yesterday, increment streak
    newStreak += 1;
  } else if (diffDays > 1) {
    // Missed a day, reset to 1
    newStreak = 1;
  } else if (diffDays === 0) {
    // Already active today, don't change streak (unless it was 0)
    if (newStreak === 0) newStreak = 1;
  }

  return db.update('users', userId, { streak: newStreak, lastActive: now });
};

const getProfile = async (req, res) => {
  try {
    // Automatically update/maintain streak when profile is fetched (e.g. on Dashboard load)
    const user = updateUserStreak(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Get progress and achievements
    const progress = db.findMany('progress', p => p.userId === req.userId);
    const achievements = db.findMany('achievements', a => a.userId === req.userId);

    // Calculate heart recovery
    const recovery = calculateHeartRecovery(user);
    let updatedUser = user;
    
    if (recovery.hearts !== user.hearts || recovery.lastHeartRefillTime !== user.lastHeartRefillTime) {
      updatedUser = db.update('users', req.userId, { 
        hearts: recovery.hearts, 
        lastHeartRefillTime: recovery.lastHeartRefillTime 
      });
    }

    // Remove password from response
    const { password, ...userData } = updatedUser;
    res.json({ 
      ...userData, 
      progress, 
      achievements,
      nextHeartIn: recovery.lastHeartRefillTime ? Math.max(0, RECOVERY_TIME_MS - (new Date() - new Date(recovery.lastHeartRefillTime))) : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

const deductHeart = async (req, res) => {
  try {
    const user = db.find('users', u => u.id === req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.hearts <= 0) {
      return res.status(400).json({ message: 'No hearts left' });
    }

    const updates = { hearts: user.hearts - 1 };
    
    // If this is the first heart lost from max, set the refill start time
    if (user.hearts === MAX_HEARTS) {
      updates.lastHeartRefillTime = new Date();
    }

    const updatedUser = db.update('users', req.userId, updates);
    res.json({ 
      hearts: updatedUser.hearts,
      lastHeartRefillTime: updatedUser.lastHeartRefillTime,
      nextHeartIn: updatedUser.lastHeartRefillTime ? RECOVERY_TIME_MS : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deducting heart', error: error.message });
  }
};

const recordActivity = async (req, res) => {
  try {
    const user = updateUserStreak(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ 
      message: 'Activity recorded', 
      streak: user.streak,
      xp: user.xp,
      level: user.level 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error recording activity', error: error.message });
  }
};

module.exports = { getProfile, deductHeart, recordActivity, updateUserStreak };
