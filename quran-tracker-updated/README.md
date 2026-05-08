# 📖 Quran Learning Tracker

A peaceful, spiritual companion for tracking your Quran memorization journey. Built with Next.js 14, Tailwind CSS, and Supabase.

---

## ✨ Features

- **Role-based auth** — Student & Mentor roles with Supabase Auth
- **Student Dashboard** — Learn, Revise, History with streak tracking
- **Automatic revision scheduling** — +1, +3, +7 day spaced repetition
- **Mentor Dashboard** — Manage students, assign tasks, view progress
- **🔥 Streak system** — Stay consistent with daily streak tracking
- **Islamic-inspired UI** — Calm dark theme with emerald & gold accents

---

## 🗂 Folder Structure

```
quran-tracker/
├── app/
│   ├── layout.tsx              # Root layout with fonts
│   ├── page.tsx                # Root redirect
│   ├── globals.css             # Global styles + Islamic patterns
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── signup/
│   │   └── page.tsx            # Signup with role selection
│   └── dashboard/
│       ├── student/
│       │   ├── page.tsx        # Server component (data fetching)
│       │   └── StudentDashboardClient.tsx  # Client interactions
│       └── mentor/
│           ├── page.tsx        # Server component (data fetching)
│           └── MentorDashboardClient.tsx   # Client interactions
├── components/
│   ├── Navbar.tsx
│   ├── StreakBadge.tsx
│   ├── SuccessToast.tsx
│   ├── EmptyState.tsx
│   ├── LoadingSkeleton.tsx
│   └── SectionHeader.tsx
├── lib/
│   └── supabase/
│       ├── client.ts           # Browser Supabase client
│       ├── server.ts           # Server Supabase client
│       ├── middleware.ts       # Auth middleware
│       └── database.types.ts  # TypeScript types
├── utils/
│   ├── streak.ts               # Streak calculation logic
│   └── surahs.ts               # All 114 Surahs list
├── supabase/
│   └── schema.sql              # Database schema + RLS policies
├── middleware.ts               # Next.js middleware
└── .env.local.example          # Environment variable template
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

---

### Step 1: Clone & Install

```bash
# Navigate to project folder
cd quran-tracker

# Install dependencies
npm install
```

---

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Give it a name (e.g., `quran-tracker`) and set a database password
4. Wait for the project to provision (~1 minute)

---

### Step 3: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it into the editor and click **Run**

This creates:
- `profiles` table
- `assignments` table
- All Row Level Security (RLS) policies
- Performance indexes

---

### Step 4: Configure Environment Variables

```bash
# Copy the example env file
cp .env.local.example .env.local
```

Now fill in your Supabase credentials. Find them in:
**Supabase Dashboard → Settings → API**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Authentication Flow

### Student Flow
1. Sign up at `/signup` → select **Student** role
2. Redirected to `/dashboard/student`
3. Wait for a mentor to link them and assign tasks

### Mentor Flow
1. Sign up at `/signup` → select **Mentor** role
2. Redirected to `/dashboard/mentor`
3. Link students by their registered name
4. Assign learning and revision tasks
5. Monitor student progress

---

## 📊 How the Revision System Works

When a student marks a learning task as complete:

1. The assignment status is set to `completed`
2. Three revision tasks are automatically created:
   - **+1 day** — Quick reinforcement
   - **+3 days** — Short-term recall
   - **+7 days** — Medium-term retention

This follows the **spaced repetition** principle for effective memorization.

---

## 🔥 Streak System

- When a student completes any task:
  - If `last_active_date` was **yesterday** → streak + 1
  - If `last_active_date` was today already → no change
  - Otherwise → streak resets to 1
- `last_active_date` updates to today on every completion

---

## 🏗 Production Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# or use:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Supabase Production Checklist
- [ ] RLS policies are enabled (done in schema.sql)
- [ ] Email confirmation enabled in Auth settings (optional)
- [ ] Database backups configured
- [ ] Set appropriate rate limits

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `bg-base` | `#080f12` | Page background |
| `bg-card` | `#111f25` | Card backgrounds |
| `emerald-500` | `#10b981` | Primary actions |
| `gold` | `#d4af37` | Revision accents |
| `text-primary` | `#e5e7eb` | Main text |
| `text-muted` | `#6b7280` | Secondary text |

---

## 🛠 Customization

### Adding More Surahs
The full list of all 114 Surahs is in `utils/surahs.ts`.

### Changing Revision Schedule
Edit the revision days in `StudentDashboardClient.tsx`:
```typescript
const revisionDays = [1, 3, 7]; // Change to your preferred schedule
```

### Modifying Colors
Update `tailwind.config.js` to change the color palette.

---

## 🤲 Dua

*May Allah make this a means of blessing for those who memorize His Book, and may He make the Quran the light of our hearts.*

---

**Built with ❤️ for the Ummah**
