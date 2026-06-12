const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Japanese Learning App API is running' });
});

app.get('/api/debug-db', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  const dataDir = path.join(__dirname, '../data');
  const defaultDir = path.join(__dirname, '../../default_data');
  
  let result = {
    dataDirFiles: [],
    defaultDirFiles: [],
    lessonsContent: null,
    lessonsExists: false,
    defaultLessonsExists: false
  };

  try {
    if (fs.existsSync(dataDir)) result.dataDirFiles = fs.readdirSync(dataDir);
    if (fs.existsSync(defaultDir)) result.defaultDirFiles = fs.readdirSync(defaultDir);
    
    const lessonsFile = path.join(dataDir, 'lessons.json');
    if (fs.existsSync(lessonsFile)) {
      result.lessonsExists = true;
      result.lessonsContent = fs.readFileSync(lessonsFile, 'utf-8').substring(0, 100);
    }
    
    const defaultLessonsFile = path.join(defaultDir, 'lessons.json');
    if (fs.existsSync(defaultLessonsFile)) {
      result.defaultLessonsExists = true;
    }
    
  } catch(e) {
    result.error = e.message;
  }
  
  res.json(result);
});

app.post('/api/force-seed', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  const collections = ['lessons', 'achievements'];
  let results = [];
  
  collections.forEach(c => {
    const defaultPath = path.join(__dirname, '../../default_data', `${c}.json`);
    const filePath = path.join(__dirname, '../data', `${c}.json`);
    if (fs.existsSync(defaultPath)) {
      fs.copyFileSync(defaultPath, filePath);
      results.push(`Seeded ${c}`);
    }
  });
  
  res.json({ message: 'Seed attempted', results });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app };
