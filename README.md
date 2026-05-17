# jain-shivirOS

A full-featured **camp management web app** built for Jain Shivir camps. Handles student points & rewards, attendance, leaderboard, coin distribution, exam marks, and volunteer management — with offline-first support and a bilingual (English / Hindi) interface.

---

## Features

- **Role-based portals** — Admin, Zone Mentor, Class Teacher, Coordinator, Coinkeeper, Collection
- **Point award system** — 25+ configurable reasons across Coin, Behaviour, and Digital categories
- **Attendance** — 3 sessions/day, per-class isolation, 30-min grace period, automatic +5 pts on submit
- **Leaderboard** — real-time ranking with category tiers (High / Mid-High / Mid / Low)
- **Exam marks** — multi-student entry, point delta calculation, grouped by class in admin
- **Coin pool tracking** — distribution, return, and slot locking
- **Offline-first** — pending queue syncs automatically when back online
- **QR scan** — student lookup via QR code
- **CSV import** — bulk import students and volunteers
- **Bilingual** — English and Hindi throughout

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Tailwind CSS |
| State | Zustand (with persist middleware) |
| Backend | Supabase (PostgreSQL + Realtime) |
| Build | Vite 5, PWA plugin |
| i18n | i18next |

---

## Quick Start

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a new project, then run the schema:

```
supabase/schema.sql   ← run this in the Supabase SQL Editor
```

This creates all tables, indexes, and the `add_student_points` RPC.

### 2. Clone and configure

```bash
git clone https://github.com/Darshika482/jain_shivirOS.git
cd jain_shivirOS
cp .env.example .env
```

Edit `.env` with your values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

VITE_CAMP_START_DATE=2026-05-03
VITE_CAMP_END_DATE=2026-05-09
VITE_CAMP_TOTAL_DAYS=7

VITE_ADMIN_PASSWORD=choose-a-strong-password
VITE_COINKEEPER_PIN=1234
```

### 3. Install and run

```bash
npm install
npm run dev
```

### 4. Seed initial data

- Go to **Admin > Operations** → import your student CSV
- Go to **Admin > Volunteers** → add your volunteer team with roles and PINs
- Update `src/lib/classTeachers.js` with your actual class teacher names

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `VITE_CAMP_START_DATE` | Yes | Camp start date (YYYY-MM-DD) |
| `VITE_CAMP_END_DATE` | Yes | Camp end date (YYYY-MM-DD) |
| `VITE_CAMP_TOTAL_DAYS` | Yes | Number of camp days |
| `VITE_ADMIN_PASSWORD` | Yes | Admin login password |
| `VITE_COINKEEPER_PIN` | Yes | Coinkeeper portal PIN |

---

## Roles & Portals

| Role | Route | Access |
|------|-------|--------|
| Admin | `/admin` | Full access — students, volunteers, transactions, reports |
| Zone Mentor | `/mentor/actions` | Award/deduct points, enter exam marks, view log |
| Class Teacher | `/teacher` | Mark attendance for assigned classes (3 sessions) |
| Coordinator | `/coordinator` | Activity coordination |
| Coinkeeper | `/coinkeeper` | Coin pool distribution and returns |
| Collection | `/collection` | Coin collection station |
| Check-in | `/checkin` | Mark student check-in (no PIN required) |

---

## Student CSV Format

The CSV importer (Admin > Operations) accepts these columns:

```
Roll Number, Child Name, Name (Hindi), Class, Allotted Book, Group,
Father Name, Mother Name, Mobile, Gender, Age, DOB, City, Reg ID,
Health Issue, Health Detail, Pathshala, Prev Shivir, Kit Given
```

---

## Supabase Setup Notes

- All tables are in `supabase/schema.sql`
- The `add_student_points` RPC atomically updates `total_points` and `day_points` from the sum of all transactions — never update these columns directly
- Run migration files in `supabase/` in order if upgrading from an older version

---

## Adapting for Your Camp

| What to change | Where |
|----------------|-------|
| Camp dates | `.env` → `VITE_CAMP_START_*` |
| Class codes and teacher names | `src/lib/classTeachers.js` |
| Admin password / coinkeeper PIN | `.env` |
| Point award reasons | `src/pages/volunteer/VolunteerApp.jsx` → `COIN_REASONS`, `BEHAVIOUR_REASONS`, `DIGITAL_REASONS` |
| Coin pool size | `src/store/useCoinStore.js` → `TOTAL_COINS` |
| Behaviour cap per day | `src/pages/volunteer/VolunteerApp.jsx` → `BEHAVIOUR_CAP` |
| Exam max marks | `src/pages/volunteer/VolunteerApp.jsx` → `EXAM_MAX` |

---

## License

MIT — free to use, fork, and adapt for your camp.
