# Japanese Learning App - Project Structure

## Architecture Overview
This project is built using a decoupled architecture with a Next.js frontend and an Express.js backend.

- **Frontend**: Next.js (App Router), TailwindCSS, Framer Motion
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## Folder Structure
```
japanese/
├── backend/
│   ├── prisma/             # Schema and migrations
│   ├── src/
│   │   ├── controllers/    # API logic
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth and validation
│   │   └── index.js       # Entry point
│   └── package.json
├── docs/
│   └── APP_STRUCTURE.md
├── src/                    # Frontend (Next.js)
│   ├── app/               # App Router pages
│   ├── components/        # UI and Game components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities
│   └── services/          # API services
└── package.json
```

## Lesson System Design
Lessons are stored as JSON in the database.
Supported types:
- Multiple choice
- Drag & drop (sentence building)
- Audio recognition
- Typing answers

## Gamification Logic
- **XP**: Earned upon lesson completion.
- **Streaks**: Incremented for daily activity.
- **Hearts**: Lost when answering incorrectly. Regenerate over time or with XP.
- **Levels**: Unlocked based on cumulative XP.

## Database Schema
- **User**: Name, email, password, XP, streak, lastActive, hearts.
- **Lesson**: Title, level, content (JSON), xpReward.
- **UserProgress**: Tracks completed lessons per user.

## Feature Roadmap
1. [x] Phase 1: Project Setup
2. [ ] Phase 2: User Auth & Database
3. [ ] Phase 3: Lesson Engine & UI
4. [ ] Phase 4: Gamification (XP, Hearts, Streaks)
5. [ ] Phase 5: Voice Recognition (Future)
