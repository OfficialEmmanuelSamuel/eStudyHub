# eStudy Hub

eStudy Hub is an AI-powered Nigerian educational platform designed to help students prepare for WAEC, NECO, and JAMB examinations through smart learning tools, CBT practice, quizzes, and interactive study materials.

---

## Features

### Student Features
- User Authentication
- Email & Google Login
- Dashboard
- WAEC/JAMB Study Materials
- Topic-Based Learning
- Quiz & CBT Practice
- AI Learning Assistant
- Student Progress Tracking
- Responsive Mobile Design
- Password Reset System

### Admin Features
- Secure Admin Authentication
- Admin Dashboard
- Subject Management
- Topic & Content Upload
- Quiz Management
- Student Monitoring
- Protected Admin Routes

---

## Tech Stack

### Frontend
- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend & Database
- Firebase Authentication
- Firestore Database
- Supabase PostgreSQL
- Supabase Realtime

### Other Tools
- React Hot Toast
- React Icons
- Zustand
- Firebase SDK

---

## Folder Structure

```bash
frontend/
│
├── app/
│   ├── admin/
│   ├── auth/
│   ├── dashboard/
│   └── landing/
│
├── components/
├── context/
├── lib/
├── public/
├── styles/
└── utils/
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/estudyhub.git
```

Move into the project:

```bash
cd estudyhub/frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Firebase Setup

1. Create a Firebase project
2. Enable Authentication
3. Enable Firestore Database
4. Add your localhost and production domain to Authorized Domains

Example:

```txt
localhost
yourapp.vercel.app
```

---

## Firestore Collections

### Users
```txt
users/
```

### Admin Users
```txt
adminUsers/
```

### Subject Topics
```txt
subjects/
topics/
```

### Quiz Data
```txt
quizzes/
```

---

## Deployment

### Frontend
Deploy easily with Vercel:

https://vercel.com

### Backend
Optional backend deployment:
- Render
- Railway

---

## Security Features

- Protected Admin Routes
- Firebase Authentication
- Firestore Security Rules
- Role-Based Access Control
- Secure API Handling

---

## Future Improvements

- AI Exam Tutor
- Live Classes
- Video Lessons
- Student Leaderboards
- Payment Integration
- PDF Notes Download
- Push Notifications
- Offline Learning

---

## Author

Emanel Travels & eStudy Hub Team

---

## License

This project is licensed under the MIT License.