# 🎓 EduAI — Next-Generation AI-Powered Education Platform

> A production-quality educational SaaS platform powered by Artificial Intelligence, featuring adaptive tutoring, dynamic quizzes, spaced-repetition flashcards, intelligent document synthesis, curriculum authoring, and comprehensive gamification.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node: v24+](https://img.shields.io/badge/Node-v24+-green.svg)](https://nodejs.org/)
[![React: 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TailwindCSS: 3.4](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)

---

## 🌟 Key Features

### 1. 🤖 24/7 Intelligent AI Tutor
- Multi-turn pedagogical chat with step-by-step breakdown of tough concepts.
- **Explain Simply ("Explain Like I'm 12")**: Uses intuitive real-world analogies.
- **Generate Practice Questions**: Diagnostic questions tailored to student level.
- **Multilingual Core**: Native support for **English**, **Uzbek (Oʻzbek tili)**, and **Russian (Русский язык)**.
- Integrated with Google Gemini (`gemini-1.5-flash`) & OpenAI API with local pedagogical fallback engine when API keys are not supplied.

### 2. 📝 Interactive Smart Quiz Arena
- AI-driven dynamic quiz generator by subject, topic, and difficulty.
- Question types: Multiple-choice, True/False, and Written answers.
- Countdown timer, progress stepper, instant scoring with celebratory confetti, and question-by-question explanations.
- Full quiz history and retake capabilities.

### 3. 📚 Comprehensive Curriculum & Lessons
- 8 core academic disciplines: Programming, Mathematics, Physics, Chemistry, Biology, History, English, and Geography.
- Video lecture player, structured markdown notes, downloadable supplemental resources, and progress tracking (+75 XP on completion).

### 4. 🗂️ AI Spaced-Repetition Flashcards
- Interactive 3D flip card study mode with active recall evaluation (Hard, Medium, Easy).
- AI Flashcard deck generator from any custom topic or lesson prompt.

### 5. 📑 Document Upload & Summarizer
- Drag-and-drop file upload supporting PDF, DOCX, TXT, and images (up to 10MB).
- Instant AI executive summary, key formulas extraction, and concept breakdown.

### 6. 📅 AI Study Planner
- Daily study tasks and weekly schedules with high/medium/low priority tags.
- AI Schedule Generator creates custom 5-day study plans based on focus goals and daily study hours.

### 7. 🏆 Motivating Gamification
- Real-time XP points, Level ladder (Lvl 1 to Lvl 10+), and daily study streaks.
- Global student leaderboard ranking learners worldwide.
- Badges & achievements gallery (First Step, Quiz Prodigy, Memory Guru, Modern Polymath).

### 8. 👨‍🏫 Teacher Hub & Course Authoring
- Create, edit, and delete courses with custom thumbnails and descriptions.
- Add lessons with embedded video URLs and rich markdown content.
- Publish assignments and track enrolled student completion rosters.

### 9. 🛡️ Administrator Panel & Governance
- Complete platform telemetry (total users, active learners, courses, avg score).
- User management: Add, edit roles (Student, Teacher, Admin), and remove accounts.
- Live platform settings: toggle public registration, maintenance mode, and active AI model.

### 10. 🌐 Internationalization & Themes
- Seamless language switcher: English 🇺🇸, O'zbek 🇺🇿, Русский 🇷🇺.
- Dark & Light mode toggle with smooth CSS transitions, persisted in browser localStorage.

---

## 🔑 Demo Accounts (Pre-configured)

You can instantly log in with any of these pre-seeded accounts using the fast login buttons on the Sign-in page:

| Role | Email | Password |
|---|---|---|
| **Student** | `student@eduai.com` | `Student123!` |
| **Teacher** | `teacher@eduai.com` | `Teacher123!` |
| **Admin** | `admin@eduai.com` | `Admin123!` |

---

## 🏗️ Technology Stack

- **Frontend**:
  - React 18, Vite, React Router DOM v6
  - Tailwind CSS, Lucide React Icons
  - Framer Motion, Recharts, Canvas Confetti
  - Axios with Bearer token interceptor
- **Backend**:
  - Node.js, Express.js REST API
  - JSON Web Tokens (JWT) & Bcrypt password hashing
  - Multer for secure multipart file uploads
  - Persistent, transactional file database layer (`server/data/db.json`)
  - Google Gemini API & OpenAI integration

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18 or higher (v24 tested)
- npm v9+

### 1. Clone the repository
```bash
git clone https://github.com/nur-tre/EduAI.git
cd EduAI
```

### 2. Configure Environment Variables
Copy the sample environment file in `server/`:
```bash
cp server/.env.example server/.env
```
*(Optional)* Add your Google Gemini API key from [Google AI Studio](https://aistudio.google.com):
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_key_here
```

### 3. Install Dependencies
```bash
# Install backend packages
cd server
npm install

# Install frontend packages
cd ../client
npm install
```

### 4. Run Development Servers
Open two terminal windows:

**Terminal 1 (Backend API on Port 5000):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend Client on Port 5173):**
```bash
cd client
npm run dev
```

Visit **`http://localhost:5173`** in your browser!

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate user & return JWT |
| `GET` | `/api/auth/me` | Fetch authenticated profile |
| `GET` | `/api/courses` | List courses with filters |
| `GET` | `/api/courses/:id` | Course details & syllabus |
| `POST` | `/api/ai/chat` | AI Tutor multi-turn query |
| `POST` | `/api/quizzes/generate` | AI Dynamic Quiz generator |
| `POST` | `/api/quizzes/:id/submit` | Grade quiz & award XP |
| `GET` | `/api/gamification/stats` | User XP, streak, badges |
| `POST` | `/api/documents/upload` | Upload & summarize document |
| `GET` | `/api/teacher/overview` | Faculty course & student stats |
| `GET` | `/api/admin/stats` | Admin platform metrics |

---

## 📄 License
This project is licensed under the MIT License.
