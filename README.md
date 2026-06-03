# CampusCompass 🎓

A full-stack **College Discovery Platform** that helps students search, compare, and save colleges using NIRF-based ranking data — built with Next.js, Prisma, and Neon PostgreSQL.

---

## Live Demo

🔗 [https://campus-compass-mocha.vercel.app/](https://campus-compass-mocha.vercel.app/)

---

## Features

- 🔐 **Google Authentication** — One-click sign-in via Google OAuth
- 🔍 **College Search & Filter** — Search by name, city, course type, ranking, fees, and placement
- 📄 **Detailed College Pages** — Overview, Courses, Placements, and Reviews for each institution
- 🔖 **Save Colleges** — Bookmark colleges to a personal shortlist for quick access
- ⚖️ **Side-by-Side Comparison** — Compare up to 4 colleges across key metrics simultaneously
- 🏆 **NIRF-Based Rankings** — All college data structured around official NIRF rankings
- ♾️ **Infinite Scroll** — Smooth pagination for browsing 50+ colleges
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | Full-stack React framework (App Router) |
| [React 19](https://react.dev/) | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Material Symbols](https://fonts.google.com/icons) | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Next.js Server Actions | Type-safe server-side data fetching |
| [Prisma ORM v7](https://www.prisma.io/) | Database access layer |

### Database & Auth
| Technology | Purpose |
|---|---|
| [Neon PostgreSQL](https://neon.tech/) | Serverless cloud-hosted relational database |
| [Google Identity Services](https://developers.google.com/identity) | OAuth 2.0 authentication |

---

## Architecture

```
Browser (Next.js Client Components)
        │
        ▼
Next.js App Router (Server Components + Server Actions)
        │
        ▼
Prisma ORM (Type-safe query builder)
        │
        ▼
Neon PostgreSQL (Cloud database)
```

Data flows from the Neon database through Prisma Server Actions directly into React Server Components, with client-side state managed in React for interactive features like search, filters, save, and compare.

---

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  name      String?
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model College {
  id              String   @id @default(cuid())
  name            String
  city            String
  state           String
  nirfRank        Int
  nirfScore       Float
  fees            Int
  averagePackage  Int
  rating          Float
  overview        String
  establishedYear Int
  website         String
  courses         Course[]
  reviews         Review[]
}

model Course {
  id         String  @id @default(cuid())
  name       String
  duration   String
  degreeType String
  college    College @relation(...)
}

model Review {
  id        String  @id @default(cuid())
  userName  String
  rating    Float
  comment   String
  college   College @relation(...)
}
```

---

## Key Features Explained

### 🔍 Search & Filter System
Users can search colleges by name, city, or course type using a debounced live search. Filter chips allow narrowing by category: Engineering, Management, Science, Design, High Placement (≥15 LPA), and Affordable (≤₹1L fees). Results load from the database with infinite scroll pagination (9 per page).

### 📄 College Detail Pages
Each college has a dedicated `/college/[id]` page with four tabs:
- **Overview** — Institution description and key details
- **Courses** — Full course catalog with duration and degree type
- **Placements** — Average/highest packages, placement rate, and top recruiters
- **Reviews** — Verified student reviews with ratings

### 🔖 Save / Shortlist
Authenticated users can bookmark colleges. Saved colleges are stored in **localStorage** for instant, zero-latency updates. Users can open their full shortlist from the header and apply directly from it.

### ⚖️ College Comparison
Users can add up to 4 colleges to a compare list. A slide-up comparison panel displays them side-by-side with rankings, fees, placement figures, and rating scores, making it easy to evaluate options.

---

## Data Source

> College ranking data is based on publicly available **NIRF (National Institutional Ranking Framework)** rankings published by India's Ministry of Education.

Additional metadata such as descriptions, placement statistics, and student reviews were generated for demonstration purposes and do not represent official institutional data.

---

## Local Setup

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech/) PostgreSQL database
- A [Google Cloud](https://console.cloud.google.com/) project with OAuth 2.0 credentials

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/shreyamahalingshetti/campuscompass.git
cd campuscompass

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

Edit `.env` with your credentials:

```env
DATABASE_URL=postgresql://...@...neon.tech/neondb?sslmode=require

NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

```bash
# 4. Push schema to database
npx prisma db push

# 5. Seed the database with 50 colleges
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

| Service | Provider |
|---|---|
| Frontend & Backend | [Vercel](https://vercel.com/) |
| Database | [Neon PostgreSQL](https://neon.tech/) |

To deploy on Vercel:
1. Push your code to GitHub
2. Import the repository on Vercel
3. Add all environment variables in the Vercel dashboard
4. Deploy — Vercel auto-detects Next.js and configures the build

---

## Engineering Decisions

| Decision | Rationale |
|---|---|
| **Next.js App Router** | Unified frontend and backend in a single framework; Server Actions eliminate the need for a separate REST API layer |
| **Prisma ORM** | Type-safe database queries with auto-generated TypeScript types; schema-as-code approach makes refactoring safe |
| **Neon PostgreSQL** | Serverless PostgreSQL with connection pooling — scales to zero when idle, ideal for projects with variable traffic |
| **Google OAuth** | Eliminates password management complexity; users trust Google sign-in, reducing friction at signup |
| **localStorage for Save feature** | Instant UI feedback without a database round-trip; appropriate for a shortlist that is per-device by nature |
| **Tailwind CSS v4** | CSS-first configuration with no config file; faster build times and direct CSS variable integration for theming |

---

## Future Improvements

- 🎯 **Admission Predictor** — Estimate admission chances based on JEE/CAT scores and cutoffs
- 💬 **Discussion Forum** — Per-college Q&A threads for students and alumni
- 🔬 **Advanced Filters** — Filter by campus type, accreditation, entrance exam, scholarship availability
- 🤖 **AI-Based Recommendations** — Suggest colleges based on a student's profile and preferences
- 📊 **CSV / PDF Export** — Download comparison tables for offline use
- 📅 **Application Deadline Tracker** — Notify users about upcoming admission deadlines for saved colleges

---

## License

This project is open-source and available under the [MIT License](LICENSE).
