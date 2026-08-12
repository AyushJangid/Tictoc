# TicToc — Timesheet Management SaaS

A production-quality Timesheet Management SaaS application built as a frontend engineering assignment. Demonstrates Next.js App Router architecture, container/component pattern, Redux Toolkit, NextAuth, API routes, form validation, and testing.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | TailwindCSS v3 |
| State Management | Redux Toolkit + React Redux |
| Authentication | NextAuth v5 (Auth.js) |
| Forms & Validation | React Hook Form + Zod |
| Testing | Jest + React Testing Library |
| Linting | ESLint |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
npm test
```

To watch for changes:

```bash
npm run test:watch
```

### Type Check

```bash
npx tsc --noEmit
```

### Lint

```bash
npm run lint
```

### Production Build

```bash
npm run build
npm start
```

---

## Demo Credentials

```
Email:    admin@tictoc.com
Password: Admin@123
```

> These are stored in `constants/index.ts` for easy identification. In production, replace with a real database-backed auth system.

---

## Architecture

```
Pages (app/)
  ↓  thin wrappers — SEO metadata only
Containers (containers/)
  ↓  business logic, API calls, Redux, state management
Services (services/)
  ↓  HTTP fetch wrappers
Internal API Routes (app/api/)
  ↓  Next.js route handlers, auth checks, validation
Mock Data (lib/mockData.ts)
     in-memory store, resets on server restart
```

### Container / Component Pattern

**Components** (`components/`) are purely presentational:
- Receive data and callbacks via props
- Render UI only
- No API calls, no Redux, no business logic

**Containers** (`containers/`) handle all logic:
- Data fetching via service layer
- Redux state management
- Modal and form orchestration
- Error and loading state

### Authentication

NextAuth v5 is the **source of truth** for authentication:
- JWT session strategy (no database required)
- `CredentialsProvider` validates against dummy credentials
- Sessions are securely handled by NextAuth — no tokens in `localStorage`
- Middleware (`middleware.ts`) protects `/dashboard` and redirects unauthenticated users to `/login`

Redux `authSlice` maintains **client-side UI state** only (loading indicator, user display) — it does not duplicate or replace NextAuth.

### Redux

Two slices:

- `authSlice` — login loading state, clear user on logout
- `timesheetSlice` — timesheet list, selected timesheet, loading/submitting/error states

### API Routes

All client-side data requests go through internal Next.js API routes:

```
GET    /api/timesheets        → list timesheets (sorted by week desc)
POST   /api/timesheets        → create timesheet
PUT    /api/timesheets/:id    → update timesheet
DELETE /api/timesheets/:id    → delete timesheet
```

All routes require an authenticated session (returns `401` if not).
Server-side Zod validation on POST/PUT.

---

## Project Structure

```
tictoc/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── timesheets/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── login/page.tsx
│   ├── dashboard/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── common/         Button, Input, Modal, Loader, ErrorMessage, EmptyState
│   ├── auth/           LoginForm
│   ├── timesheet/      TimesheetTable, TimesheetRow, TimesheetModal, TimesheetForm, StatusBadge
│   └── dashboard/      DashboardHeader
│
├── containers/
│   ├── auth/           LoginContainer
│   ├── dashboard/      DashboardContainer
│   └── timesheet/      TimesheetContainer
│
├── store/
│   ├── index.ts
│   ├── StoreProvider.tsx
│   └── slices/         authSlice, timesheetSlice
│
├── services/
│   ├── authService.ts
│   └── timesheetService.ts
│
├── lib/
│   ├── auth.ts
│   ├── mockData.ts
│   └── validations/    timesheetSchema, loginSchema
│
├── types/              auth.ts, timesheet.ts
├── constants/          index.ts
│
├── __tests__/
│   ├── components/     LoginForm, TimesheetTable, TimesheetForm
│   └── containers/     LoginContainer, TimesheetContainer
│
├── middleware.ts
├── jest.config.ts
├── jest.setup.ts
└── README.md
```

---

## Assumptions

- **In-memory store**: Data resets on server restart. This is expected for an assignment without a database.
- **Delete added**: The spec mentions Edit in the table. Delete was also added since the API has a DELETE route and it's standard CRUD behaviour.
- **NextAuth v5 (beta)**: Used as it's the recommended version for Next.js App Router.
- **JWT sessions**: No database adapter — sessions are stored in signed HTTP-only cookies.
