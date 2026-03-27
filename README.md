<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Google_Gemini-AI_Powered-4285F4?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" />
</p>

# ✨ AI Resume Builder

> A full-stack, AI-powered resume builder that helps you craft professional, **ATS-optimized resumes** in minutes — not hours. Powered by **Google Gemini 2.5 Flash**, built with **Next.js 16** and **React 19**.

---

## 🚀 Why This Project?

Creating a resume shouldn't feel like a chore. This application merges **modern full-stack engineering** with **generative AI** to deliver a seamless resume-building experience. From AI-generated summaries to real-time ATS scoring, every feature was designed with intention — demonstrating expertise in:

- **Full-Stack Architecture** — Next.js API Routes, server-side sessions, RESTful design
- **AI/ML Integration** — Google Gemini API with structured prompt engineering
- **Database Design** — MongoDB with Prisma ORM and relational data modeling
- **State Management** — Zustand for performant, scalable client-side state
- **Modern UI/UX** — Glassmorphism, dark mode, responsive design, micro-animations

---

## 📸 Feature Highlights

### 🤖 AI-Powered Intelligence (Google Gemini 2.5 Flash)

| Feature | What It Does |
|---|---|
| **AI Summary Generator** | Generates a tailored professional summary based on your experience and target role |
| **Bullet Point Enhancer** | Rewrites experience bullet points with strong action verbs and quantifiable metrics |
| **ATS Score Checker** | Analyzes your resume against any job description — returns a match score, matched/missing keywords, and actionable suggestions |
| **AI Recommendations** | Provides an overall rating (1-10), identifies strengths, suggests missing skills, and recommends content improvements |

Each AI feature uses carefully crafted prompts with controlled temperature settings for reliable, professional output.

---

### 📝 Comprehensive Resume Editor

A **tabbed editor interface** with 10 dedicated sections for granular control over every part of your resume:

- **Personal Info** — Name, email, phone, location, LinkedIn, website, and professional summary
- **Experience** — Company, role, dates, bullet points with reordering (drag up/down)
- **Education** — School, degree, graduation year with reordering support
- **Skills** — Tag-based input with instant add/remove
- **Projects** — Name, description, live link for portfolio pieces
- **Certifications** — Certification name, issuer, and date
- **Languages** — Language name with proficiency levels (Native → Beginner)
- **Custom Sections** — Fully flexible sections for Volunteer Work, Publications, Awards, etc.
- **ATS Check** — Built-in job description analyzer
- **AI Tips** — On-demand AI-powered resume recommendations

---

### 🎨 Theme Customization Engine

Personalize your resume's appearance without leaving the editor:

- **3 Professional Templates** — Classic, Modern, and Two-Column layouts
- **6 Color Palettes** — Blue, Green, Red, Purple, Slate, and Black accent colors
- **3 Font Families** — Inter (modern), Merriweather (serif/classic), Outfit (contemporary)

Templates are implemented as standalone React components for maintainability and extensibility.

---

### 💾 Smart Auto-Save

Never lose your work. The editor implements a **debounced auto-save** mechanism (2-second delay after last change) that silently persists all data to MongoDB. Manual save is also available with visual feedback.

---

### 📄 One-Click PDF Export

Export pixel-perfect PDF resumes using `react-to-print`. The output mirrors the live preview exactly — **what you see is what employers get**. Fully ATS-parseable.

---

### 🔗 Resume Sharing

Toggle any resume between **public** and **private** with a single click. Public resumes generate a shareable link that's automatically copied to your clipboard.

---

### 🔐 Authentication & Security

- **NextAuth.js** with JWT session strategy for stateless, scalable authentication
- **Credentials Provider** with email/password login
- Dedicated registration flow with form validation
- **Server-side ownership verification** on every API call — users can only access, edit, or delete their own resumes
- Protected API routes with session guards

---

### 📊 Resume Dashboard

A centralized management hub for all your resumes:

- **Create** new resumes with one click
- **Duplicate** existing resumes to iterate on variations
- **Edit** — jump directly into the editor
- **Share/Unshare** — toggle public visibility
- **Delete** with confirmation dialog
- **Loading skeletons** for perceived performance
- Displays target job tags and last-updated timestamps

---

### 🎭 Premium UI/UX

Built with a design-first philosophy:

- **Glassmorphism** design system with backdrop blur and translucent surfaces
- **Dark/Light mode** — automatic system preference detection via `prefers-color-scheme`
- **Responsive layout** — editor stacks on mobile (`< 900px`)
- **Smooth animations** — slide-up entrance animations with staggered delays
- **Decorative gradient blobs** for ambient visual depth
- **Toast notifications** — success, error, warning, and info states
- **Shimmer loading skeletons** — polished loading states throughout

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Frontend** | React 19, Vanilla CSS, Lucide Icons |
| **State Management** | Zustand |
| **AI Engine** | Google Gemini 2.5 Flash (`@google/genai`) |
| **Authentication** | NextAuth.js (JWT Strategy) |
| **Database** | MongoDB |
| **ORM** | Prisma |
| **PDF Export** | react-to-print |
| **Typography** | Google Fonts (Inter, Outfit, Merriweather) |

---

## 📁 Project Structure

```
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/           # Sign-in page
│   │   └── register/        # Registration page
│   ├── (dashboard)/         # Resume management dashboard
│   ├── (editor)/            # Resume editor with live preview
│   │   └── editor/[id]/     # Dynamic editor per resume
│   ├── api/
│   │   ├── ai/
│   │   │   ├── enhance/     # Bullet point enhancement API
│   │   │   ├── ats-check/   # ATS scoring API
│   │   │   └── recommendations/  # AI recommendations API
│   │   ├── auth/            # NextAuth + registration APIs
│   │   ├── generate/        # AI summary generation API
│   │   └── resumes/         # CRUD API for resumes
│   └── shared/[id]/         # Public shared resume view
├── components/
│   ├── templates/           # Resume template components
│   │   ├── ClassicTemplate.jsx
│   │   ├── ModernTemplate.jsx
│   │   └── TwoColumnTemplate.jsx
│   ├── Toast.jsx            # Notification system
│   └── LoadingSkeleton.jsx  # Loading states
├── lib/
│   ├── prisma.js            # Prisma client singleton
│   └── store.js             # Zustand state management
└── prisma/
    └── schema.prisma        # Database schema (User, Resume, Account, Session)
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB** instance (local or Atlas)
- **Google Gemini API Key** — [Get one here](https://ai.google.dev/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sai-charan-g/Resume-builder-with-ai-assistance.git
cd Resume-builder-with-ai-assistance

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

### Environment Variables

```env
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<db-name>"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
```

### Run the Application

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🛠️ API Architecture

All API routes are **server-side authenticated** using NextAuth session guards.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/generate` | Generate AI professional summary |
| `POST` | `/api/ai/enhance` | Enhance experience bullet points |
| `POST` | `/api/ai/ats-check` | Analyze resume against job description |
| `POST` | `/api/ai/recommendations` | Get AI-powered resume recommendations |
| `GET` | `/api/resumes` | List all user resumes |
| `POST` | `/api/resumes` | Create / duplicate a resume |
| `GET` | `/api/resumes/[id]` | Get a specific resume |
| `PUT` | `/api/resumes/[id]` | Update a resume |
| `DELETE` | `/api/resumes/[id]` | Delete a resume |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  <b>Built with ❤️ using Next.js, React, Google Gemini AI, and MongoDB</b>
</p>
