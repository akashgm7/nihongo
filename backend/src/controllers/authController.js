const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../lib/jsonDb');

const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = db.find('users', u => u.email === email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = db.create('users', {
      email,
      password: hashedPassword,
      name,
      xp: 0,
      streak: 0,
      hearts: 5,
      level: 1,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        xp: user.xp,
        hearts: user.hearts,
        streak: user.streak,
        level: user.level
      }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = db.find('users', u => u.email === email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, xp: user.xp, hearts: user.hearts, streak: user.streak, level: user.level }, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = { register, login };
