# 🕌 Anamta Institute — Frontend

> A modern, premium Quran learning platform where students can browse, enroll, and learn from certified teachers online.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-latest-ff0055?style=flat-square)

---

## 📌 Project Overview

**Anamta Institute** is a full-stack Quran learning platform built for a real client. The frontend is built with Next.js 15 (App Router) and connects to a NestJS backend.

Students can browse Quran courses (Tajweed, Hifz, Arabic, Tafsir, Kids), purchase/enroll online, and access their learning through a student dashboard. An admin panel allows the institute to manage courses and services.

---

## ⚙️ Tech Stack

| Tool | Purpose |
|---|---|
| **Next.js 15** (App Router) | Framework |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling |
| **Framer Motion** | Animations |
| **Embla Carousel** | Hero slider |
| **Lucide React** | Icons |
| **Redux Toolkit** | State management *(upcoming)* |
| **RTK Query / Axios** | API integration *(upcoming)* |
| **React Hook Form + Zod** | Forms & validation *(upcoming)* |

---

## 🗂️ Folder Structure

```
client/
├── app/
│   ├── layout.tsx               # Root layout (fonts, metadata)
│   ├── page.tsx                 # Home page (all sections assembled)
│   ├── globals.css              # Theme tokens, Tailwind config
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx           # Protected layout
│   │   ├── dashboard/page.tsx
│   │   └── my-courses/page.tsx
│   ├── courses/
│   │   ├── page.tsx             # Course listing
│   │   └── [slug]/page.tsx      # Course detail
│   ├── teachers/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── pricing/page.tsx
│   ├── about/page.tsx
│   └── admin/
│       ├── login/page.tsx       # Admin login (separate)
│       ├── layout.tsx           # Admin protected layout
│       └── dashboard/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           ✅
│   │   └── Footer.tsx           ✅
│   ├── marketing/               # Landing page sections
│   │   ├── HeroCarousel.tsx     ✅
│   │   ├── TrustBar.tsx         ✅
│   │   ├── Features.tsx         ✅
│   │   ├── PopularCourses.tsx   ✅
│   │   ├── HowItWorks.tsx       ✅
│   │   ├── Teachers.tsx         ✅
│   │   ├── Testimonials.tsx     ✅
│   │   ├── PricingPreview.tsx   ✅
│   │   ├── FAQ.tsx              ✅
│   │   └── CTABanner.tsx        ✅
│   ├── course/
│   │   └── CourseCard.tsx       ✅
│   ├── teacher/
│   │   └── TeacherCard.tsx      ✅
│   └── ui/
│       ├── SectionHeading.tsx   ✅
│       └── ThemeToggle.tsx      ✅
│
├── hooks/
│   └── useTheme.ts              ✅
│
├── types/
│   ├── course.ts                ✅
│   ├── teacher.ts               ✅
│   ├── user.ts                  ✅
│   └── api.ts                   ✅
│
└── public/
    ├── logo/
    │   └── logo.jpeg
    └── hero/
```

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#070b0e` | Page background |
| `--color-surface` | `#0d131a` | Cards, navbar, footer |
| `--color-primary` | `#0b3a55` | Primary actions, tints |
| `--color-gold` | `#c5a880` | Accents, highlights, CTAs |
| `--color-text` | `#f3f4f6` | Headings, body |
| `--color-text-secondary` | `#9ca3af` | Subtitles, descriptions |

### Typography

| Role | Font | Usage |
|---|---|---|
| Display | **Cinzel** | Logo, headings, section titles |
| Body | **Poppins** | Paragraphs, UI text, buttons |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/Quranic-studies-Anamta-.git

# Go to client folder
cd Quranic-studies-Anamta-/client

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 Pages & Status

### ✅ Done
| Page / Component | Status |
|---|---|
| Landing Page (all sections) | ✅ Complete |
| Navbar (sticky, scroll effect, mobile menu) | ✅ Complete |
| Hero Carousel (Ken Burns, animated text, progress dots) | ✅ Complete |
| Trust Bar | ✅ Complete |
| Features Section | ✅ Complete |
| Popular Courses | ✅ Complete |
| How It Works | ✅ Complete |
| Teachers Section | ✅ Complete |
| Testimonials | ✅ Complete |
| Pricing Preview | ✅ Complete |
| FAQ Accordion | ✅ Complete |
| CTA Banner | ✅ Complete |
| Footer (newsletter, links, socials) | ✅ Complete |

### 🔜 Coming Next
| Page | Status |
|---|---|
| Courses Listing (`/courses`) | 🔜 |
| Course Detail (`/courses/[slug]`) | 🔜 |
| Teachers Page (`/teachers`) | 🔜 |
| Login / Register | 🔜 |
| Student Dashboard | 🔜 |
| Checkout + Payment | 🔜 |
| Admin Panel | 🔜 |
| API Integration (NestJS) | 🔜 |

---

## 🔐 Auth & Roles

| Role | Access |
|---|---|
| **Visitor** | Public pages — no login required |
| **Student** | Login required for enrollment, dashboard, my courses |
| **Admin** | Separate `/admin/login` → admin dashboard (CRUD for courses/services) |

---

## 🌐 Backend Integration

This frontend connects to a **NestJS** backend (built separately).

Expected API endpoints:

```
GET    /courses              → Course listing
GET    /courses/:slug        → Course detail
GET    /teachers             → Teachers listing
POST   /auth/login           → User login (returns JWT)
POST   /auth/register        → User registration
POST   /orders/checkout      → Create order
GET    /users/me             → Current user profile
GET    /users/me/courses     → Enrolled courses
```

> API base URL is configured via `.env.local`:
> ```
> NEXT_PUBLIC_API_URL=http://localhost:3001
> ```

---

## 📦 Key Packages

```bash
npm install lucide-react framer-motion embla-carousel-react embla-carousel-autoplay
```

Coming soon (install when needed):
```bash
npm install @reduxjs/toolkit react-redux axios react-hook-form zod
```

---

## 🤝 Contributing

This is a client project. Development is split between:
- **Frontend** → This repo (`/client`) — Next.js
- **Backend** → Separate repo (`/server`) — NestJS

---

## 📝 License

Private client project — all rights reserved © 2025 Anamta Institute.
