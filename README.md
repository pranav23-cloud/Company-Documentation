# My PLC Learning Journey ⚙️

A professional, editable web application for documenting your daily PLC and Industrial Automation learning journey. Built with React, Vite, Tailwind CSS, and Supabase.

**Public visitors** can view your learning timeline. **Only you (admin)** can add, edit, and delete entries through a secure dashboard.

---

## Features

- 📅 Daily learning entries with multiple topics per day
- ⚙️ Category tagging (PLC, Electrical, Sensors, Ladder Logic, etc.)
- 🔍 Search and filter by topic or category
- 📊 Auto-calculated statistics (learning days, topics, current focus)
- 🌙 Light / Dark mode with preference saved
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔐 Secure admin dashboard with Supabase Auth
- 📝 Draft support — save entries before publishing
- 🚀 Netlify-ready deployment

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd my-plc-learning-journey
npm install
```

### 2. Set Up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New Query**
3. Copy and run the entire contents of:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
4. Go to **Authentication** → **Users** → **Add User**
   - Create your admin account with email + password
   - ⚠️ Do NOT enable public sign-ups — only you should have access

5. Go to **Project Settings** → **API**
   - Copy your **Project URL** and **anon/public key**

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ Never commit `.env` to GitHub. Only the anon key goes in the frontend — it is safe for public use when RLS is configured correctly.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

- Public site: `/`
- Admin login: `/admin/login`
- Admin dashboard: `/admin/dashboard`

---

## Deploy to Netlify

### Option A: Connect GitHub Repository

1. Push this project to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Select your repository
4. Build settings (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in **Site settings → Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy!

### Option B: Manual Deploy

```bash
npm run build
# Drag the `dist/` folder to Netlify Drop
```

---

## Admin Usage

### Adding a Learning Entry

1. Go to `/admin/login` and sign in
2. Click **➕ ADD TODAY'S LEARNING**
3. Select the date
4. Fill in topic name, description, and category
5. Click **➕ ADD ANOTHER TOPIC** for multiple topics on the same day
6. Click **💾 SAVE LEARNING** (published) or **SAVE AS DRAFT**

### Editing / Deleting

In the dashboard, each entry has **✏️ EDIT** and **🗑️ DELETE** buttons.

---

## Database Structure

| Table | Purpose |
|---|---|
| `learning_days` | One row per learning date (with draft/published status) |
| `learning_topics` | Multiple topics per day |
| `categories` | Extensible category list with emojis |

## Security (RLS)

| Role | Permissions |
|---|---|
| Public (anon) | Read published entries only |
| Authenticated (admin) | Full CRUD on all entries |

Row Level Security is enforced at the database level — even if someone inspects the frontend code, they cannot write data without valid admin credentials.

---

## Project Structure

```
src/
├── components/
│   ├── Admin/         # EntryForm, ProtectedRoute
│   ├── Home/          # HeroSection
│   ├── Journey/       # Timeline, SearchFilter
│   ├── Layout/        # Navbar, Footer
│   └── UI/            # ThemeToggle, StatCard, LoadingSpinner
├── context/           # Auth, Theme providers
├── hooks/             # useLearningData
├── lib/               # Supabase client, API functions
├── pages/             # Route pages
└── types/             # TypeScript types
supabase/
└── migrations/        # Database schema + RLS
```

---

## Adding New Categories

Categories can be added directly in Supabase:

```sql
INSERT INTO categories (name, emoji) VALUES ('Robotics', '🦾');
```

Or extend the admin dashboard in the future to support this via UI.

---

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Hosting:** Netlify

---

## License

Personal learning portfolio project. Use freely for your own learning journey.
