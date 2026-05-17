# jain-shivirOS

An open-source **camp management web app** built for Jain Shivir camps. Manages student points & rewards, attendance, leaderboard, coin distribution, exam marks, and volunteers — with offline-first support and a bilingual (English / Hindi) interface.

Anyone can fork this repo, deploy it in minutes, and run it for their own camp — no coding required after setup.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Admin Panel Overview](#admin-panel-overview)
5. [Step-by-Step: Initial Setup Checklist](#step-by-step-initial-setup-checklist)
6. [Bulk Importing Students](#bulk-importing-students)
7. [Managing Classes & Batches](#managing-classes--batches)
8. [Setting Up Class Sessions (Schedule)](#setting-up-class-sessions-schedule)
9. [Bulk Importing Mentors / Volunteers](#bulk-importing-mentors--volunteers)
10. [Assigning Teachers to Classes](#assigning-teachers-to-classes)
11. [Role-Based Portals](#role-based-portals)
12. [Changing Passwords & PINs](#changing-passwords--pins)
13. [Admin Reset Tools](#admin-reset-tools)
14. [Adapting for Your Camp](#adapting-for-your-camp)
15. [Environment Variables](#environment-variables)
16. [Supabase Schema](#supabase-schema)
17. [License](#license)

---

## Features

- **Setup wizard** — connects your Supabase, runs the schema, and configures your camp in one guided flow
- **6 role-based portals** — Admin, Zone Mentor, Class Teacher, Coordinator, Coinkeeper, Collection
- **Point award system** — 25+ reasons across Coin, Behaviour, and Digital categories
- **Attendance** — dynamic sessions/day (driven by your schedule), per-class isolation, automatic +5 pts on submit
- **Leaderboard** — real-time ranking with tiers (High / Mid-High / Mid / Low)
- **Exam marks** — multi-student entry, grouped by class in admin
- **Coin pool tracking** — distribution, return, and slot locking
- **Offline-first** — pending queue syncs automatically when back online
- **QR scan** — student lookup by QR code
- **Bulk import** — students via CSV, mentors via XLSX (with Excel dropdowns for roles)
- **Dynamic classes** — add, rename, and remove batches and class codes from the admin panel
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

## Getting Started

### Step 1 — Create a free Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up / log in
2. Click **New project** → give it a name → wait for it to provision (~1 min)
3. Go to **Settings → API** and note down:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public key** (long string starting with `eyJ`)

### Step 2 — Deploy the app

**Option A — Vercel (recommended, free)**
1. Fork this repo on GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → import your fork
3. Click Deploy — no env vars needed (the setup wizard handles it)

**Option B — Run locally**
```bash
git clone https://github.com/Darshika482/jain_shivirOS.git
cd jain_shivirOS
npm install
npm run dev
```

### Step 3 — Open the app and follow the setup wizard

The first time anyone opens the app (with no config stored), the setup wizard appears automatically:

| Step | What happens |
|------|-------------|
| **1 — Connect Supabase** | Paste your Project URL and anon key → click Test Connection |
| **2 — Set up database** | Copy the SQL schema → paste into Supabase SQL Editor → click Run → come back and click Verify |
| **3 — Configure camp** | Enter camp name, city, dates, admin password, and coinkeeper PIN |
| **4 — Launch** | Review everything → click Launch App |

> **Default admin password:** If no password has been configured yet (wizard not completed, no env var set), the app uses **`darshika`** as the default admin password so you can log in and complete setup. Change it immediately via Admin → Settings after your first login.

---

## Admin Panel Overview

Log in at `/admin` (or click the Admin tile on the home screen) using your admin password.

> **First login:** If the password hasn't been set yet, use **`darshika`** (the default). The login screen will show a reminder when the default is active. Go to **Admin → Settings → Change Admin Password** immediately after your first login.

| Section | Purpose |
|---------|---------|
| 🏠 Dashboard | Overview stats: check-ins, points, coins |
| ✅ Check-In Records | View all check-in timestamps |
| 👨‍🎓 Students | Add, edit, search, bulk import students |
| 🏫 Classes | Class rosters, session attendance, exam marks |
| 🏆 Leaderboard | Real-time student rankings with tier badges |
| 📅 Schedule | Day-by-day camp schedule |
| 🪙 Coin Allocation | Configure coin pools per event |
| 💰 Transactions | Full audit log of all point awards |
| 👥 Mentors | Add/edit volunteers, assign roles, classes, PINs |
| 📒 Coin Register | Log coin distributions and returns |
| ⚙️ Operations | Events, assignments, classes, matrices, reports |
| 🔧 Settings | Change password, PIN, camp dates, Supabase config |

---

## Step-by-Step: Initial Setup Checklist

Follow this order after the setup wizard to get the app ready for camp day:

```
[ ] 1. Complete setup wizard (Supabase + camp config)
[ ] 2. Manage class batches and codes (Operations → Classes)
[ ] 3. Create class session events (Operations → Events)
[ ] 4. Bulk import students (Students → Import CSV)
[ ] 5. Bulk import mentors (Mentors → Bulk Import / Export)
[ ] 6. Assign class teachers to sessions (Mentors → edit each Class Teacher)
[ ] 7. Set up coin pools (Coin Allocation)
[ ] 8. Share role PINs with volunteers
```

---

## Bulk Importing Students

### Download the template

1. Go to **Admin → Students**
2. Click **⬇ CSV Template** — this downloads `student-import-template.csv` with all column headers pre-filled
3. Open the file in Excel or Google Sheets and fill in your student data

### CSV column reference

| Column | Required | Notes |
|--------|----------|-------|
| Roll Number | ✅ | Unique identifier per student |
| Child Name | ✅ | Full name |
| Gender | | `Boy` or `Girl` |
| Age | | Number |
| DOB | | Date of birth |
| Allotted Book | | Free text — the study book assigned |
| Class | | Class code (e.g. `1A`, `2B`). Must match a code in your class setup |
| Room No. | | Dormitory room number |
| Reg ID | | Registration / application ID |
| Father Name | | |
| Mother Name | | |
| Mobile | | Primary contact number |
| WhatsApp | | WhatsApp number if different |
| City | | Home city |
| Pin Code | | Postal pin code |
| Address | | Full home address |
| Pathshala | | Name of the pathshala the student attends |
| Achievements | | Notable achievements or notes |
| Class Teacher | | Name of the assigned class teacher |

> **Tip:** Only Roll Number and Child Name are mandatory. Fill in as many other columns as you have. Column order doesn't matter — the importer matches by header name.

### Import the file

1. Go to **Admin → Students**
2. Click **⬆ Import CSV**
3. Select your filled-in CSV file
4. A summary shows how many rows were imported successfully

### Common issues

| Problem | Fix |
|---------|-----|
| Class code not recognised | Make sure the class code exists in Operations → Classes before importing |
| Duplicate roll numbers | The importer skips duplicates — clean them from the CSV first |
| Encoding issues | Save the file as UTF-8 CSV from Excel (File → Save As → CSV UTF-8) |

---

## Managing Classes & Batches

Classes are grouped into **Batches** (e.g. Bhag-1, Bhag-2). Each batch contains **class codes** (e.g. 1A, 1B, 2A).

### Access

**Admin → Operations → 🏫 Classes tab**

### Add a new class code to an existing batch

1. Click inside the batch card
2. Type the new class code in the input field at the bottom of the batch
3. Press **Enter** — the code appears as a chip
4. Click **Save Changes**

### Add a new batch

1. Scroll to the bottom of the Classes tab
2. Click **+ Add Batch**
3. Enter a batch name (e.g. `Bhag-5`)
4. Add class codes to it one by one
5. Click **Save Changes**

### Remove a class code

- Click the **×** on any class code chip to remove it
- Click **Save Changes**

### Rename a batch

- Click the batch name to edit it inline
- Press Enter to confirm
- Click **Save Changes**

### Reset to defaults

- Click **Reset to Defaults** to restore the original batch/class structure
- This only affects the class config — no student data is changed

> **Note:** The class codes you define here appear as options in the Student form, Student CSV import, and Teacher assignment dropdowns. Always set up your classes before importing students.

---

## Setting Up Class Sessions (Schedule)

The number of **teaching session slots** shown to Class Teachers adapts automatically to however many Class Session events you create here.

### Create class session events

1. Go to **Admin → Operations → 📅 Events tab**
2. Click **+ Add Event**
3. Fill in the form:

| Field | What to enter |
|-------|--------------|
| **Name** | E.g. `First Teaching Class`, `Second Teaching Class`, `Afternoon Class` |
| **Event Type** | Select **Class Session** — this is what marks it as a teaching slot |
| **Time Slot** | E.g. `09:00–09:45` — shown as label in the teacher assignment UI |
| **Sort Order** | Controls the order: `1` = first session, `2` = second, etc. |
| **Responsible Role** | Set to `Teacher` |
| **Active** | Check this box — only active class sessions appear as slots |

4. Click **Save**

Repeat for each teaching period in your day. For example, if your camp has 3 teaching periods, create 3 events with sort orders 1, 2, 3.

### How this affects teachers

Once class session events are saved:
- The **Teacher portal** shows exactly that many session slots to mark attendance
- The **Mentor admin page** shows exactly that many session assignment slots when editing a Class Teacher
- Class Teachers can be assigned a different class for each session

> **Tip:** Change the sort order to reorder sessions. Toggle `is_active` off to temporarily hide a session without deleting it.

---

## Bulk Importing Mentors / Volunteers

### Download the Excel template

1. Go to **Admin → Mentors**
2. Click **Bulk Import / Export** to expand the panel
3. Click **⬇ Download XLSX Template**
4. Open the downloaded file in Microsoft Excel or Google Sheets

### Fill in the template

The template has these columns with **built-in Excel dropdowns**:

| Column | Required | Notes |
|--------|----------|-------|
| Name | ✅ | Full name of the volunteer |
| PIN | ✅ | 4-digit PIN they will use to log in |
| Mobile | | WhatsApp/phone number |
| City | | Home city |
| Roles | | Semicolon-separated from dropdown: `Activity Coordinator; Zone Mentor; Class Teacher; Collection Mentor; Admin` |
| Assigned Classes | | Semicolon-separated class codes, e.g. `1A; 1B` |
| Has Deduction Rights | | `Yes` or `No` — dropdown in Excel |
| Availability | | `Full`, `Day`, `Night`, or custom |

> **Excel dropdown tip:** Click any cell in the Roles or Has Deduction Rights columns to see the dropdown arrow. This prevents typos.

### Import the file

1. Save the filled Excel file
2. Go to **Admin → Mentors → Bulk Import / Export**
3. Click **⬆ Upload CSV** (save your Excel file as CSV first, or use the XLSX directly)
4. A toast notification confirms how many volunteers were imported

### Export existing mentors

- Click **⬇ Export All Mentors CSV** to download all current volunteer records
- Useful for backup or editing in bulk before re-importing

---

## Assigning Teachers to Classes

After importing your mentors, assign Class Teachers to their specific sessions and class codes.

### Prerequisites

- Class codes must exist in Operations → Classes
- Class Session events must be created in Operations → Events (see above)
- The volunteer must have **Class Teacher** checked in their Roles

### Assign sessions

1. Go to **Admin → Mentors**
2. Find the Class Teacher and click **✏️ Edit**
3. Scroll down to **Per-Session Class Assignment**
4. For each session slot (derived from your Class Session events), select the class code the teacher will teach in that slot
5. Leave a slot as **— Unassigned** if the teacher doesn't teach during that session
6. Click **Save**

### Quick-fill shortcut

If the teacher teaches the same class in all sessions:
1. Set the first session slot
2. Click **Apply Session 1 to all** — this copies Session 1's class to every other slot

### View assignments at a glance

In the Mentors list, each Class Teacher shows coloured chips like `S1: 1A  S2: 2B  S3: 1A` showing which class they teach in each session.

### Assignment matrix

Go to **Admin → Operations → Matrix tab** to see a full grid of all volunteers vs. all events — useful for spotting unassigned slots.

---

## Role-Based Portals

Each role gets a PIN-based login from the home screen:

| Role | Route | What they can do |
|------|-------|-----------------|
| Zone Mentor | `/mentor/actions` | Award/deduct points, enter exam marks, view log |
| Class Teacher | `/teacher` | Mark attendance for assigned classes per session |
| Activity Coordinator | `/coordinator` | Coordination tasks and activity tracking |
| Coinkeeper | `/coinkeeper` | Coin pool distribution and returns |
| Collection | `/collection` | Coin collection station |
| Check-in | `/checkin` | Mark student check-in — no PIN required (public) |

> **Note:** A volunteer can hold multiple roles. They log in via whichever portal matches their current duty (Mentor, Teacher, Coordinator, or Collection tile on the home screen).

---

## Changing Passwords & PINs

### Admin password

1. Log in to the admin panel (use **`darshika`** if you haven't set a password yet)
2. Go to **Settings** (🔧 in the left sidebar)
3. Under **Change Admin Password** — enter current password, new password, confirm → **Update Password**

### Coinkeeper PIN

1. Log in to the admin panel
2. Go to **Settings → Change Coinkeeper PIN**
3. Enter current PIN, new 4-digit PIN → **Update PIN**

### Volunteer PINs

1. Go to **Admin → Mentors**
2. Edit the volunteer → change the PIN field → Save
3. Send the new PIN to the volunteer via WhatsApp using the **📱 WhatsApp** button on their card

---

## Admin Reset Tools

Found in **Admin → Classes → Class Overview tab** under **Admin Reset Tools** (collapsible).

> ⚠️ These are destructive actions. Use only when needed (e.g. testing before camp, or correcting a data entry mistake).

### Reset Attendance by Day

Clears all attendance records, submission records, and attendance-awarded transactions for a selected camp day, then rebuilds student point totals.

1. Expand **Admin Reset Tools**
2. Expand **Reset Attendance by Day**
3. Select the day from the dropdown
4. Type `RESET ATTENDANCE` exactly in the confirmation box
5. Click **Reset Day X Attendance**

### Reset Check-In Data

Marks all students as not checked-in and clears their check-in timestamps.

1. Expand **Admin Reset Tools**
2. Expand **Reset Check-In Data (All Students)**
3. Type `RESET CHECKIN` exactly in the confirmation box
4. Click **Reset All Check-In Data**

---

## Adapting for Your Camp

| What to change | Where |
|----------------|-------|
| Camp name, city, dates | Admin → Settings → Camp Information |
| Admin password | Admin → Settings → Change Admin Password |
| Coinkeeper PIN | Admin → Settings → Change Coinkeeper PIN |
| Batch and class structure | Admin → Operations → Classes tab |
| Teaching session count/names | Admin → Operations → Events (add Class Session events) |
| Point award reasons | `src/pages/volunteer/VolunteerApp.jsx` → `COIN_REASONS`, `BEHAVIOUR_REASONS`, `DIGITAL_REASONS` |
| Coin pool size | `src/store/useCoinStore.js` → `TOTAL_COINS` |
| Exam max marks | `src/pages/volunteer/VolunteerApp.jsx` → `EXAM_MAX` (currently `80`) |
| Behaviour cap per day | `src/pages/volunteer/VolunteerApp.jsx` → `BEHAVIOUR_CAP` (currently `4`) |

---

## Environment Variables (optional)

If you prefer `.env` over the setup wizard (e.g. for CI / automated deployments):

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Camp info
VITE_CAMP_NAME=Your Camp Name
VITE_CAMP_CITY=Your City

# Camp dates
VITE_CAMP_START_DATE=2026-05-03
VITE_CAMP_END_DATE=2026-05-09
VITE_CAMP_TOTAL_DAYS=7

# Credentials — required, no hardcoded defaults
VITE_ADMIN_PASSWORD=your-strong-password
VITE_COINKEEPER_PIN=1234
```

When env vars are present, the setup wizard is skipped automatically. If `VITE_ADMIN_PASSWORD` or `VITE_COINKEEPER_PIN` are not set (and not configured via the wizard), those logins will be blocked until they are.

---

## Supabase Schema

All tables are created by `supabase/schema.sql`. Run it once in your Supabase SQL Editor.

Key tables:

| Table | Purpose |
|-------|---------|
| `students` | Student records (name, class, batch, city, points, etc.) |
| `volunteers` | Mentor/teacher records (name, PIN, roles, session assignments) |
| `attendance` | Per-student, per-session attendance rows |
| `attendance_submissions` | Tracks which sessions have been submitted |
| `transactions` | Every point award/deduction event |
| `events` | Camp events (including Class Session type for dynamic session slots) |
| `coin_registers` | Coin distribution and return logs |

The `add_student_points` RPC (in `supabase/add_points_rpc.sql`) atomically updates `total_points` and `day_points` from the sum of all transactions. Never update these columns directly — always go through the RPC or the transaction store.

---

## License

MIT — free to use, fork, and adapt for any camp.
