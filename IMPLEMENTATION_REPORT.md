# Capstone Portal — Implementation Status Report

> **Generated:** May 16, 2026
> **Project:** ISUFST CICT Integrated Student Research & Capstone Portal
> **Commit:** `be117a0` (main)
> **Stack:** Turborepo · Next.js 15 · Prisma 6 · Supabase · Tailwind CSS v4

---

## Executive Summary

| Metric | Value |
|---|---|
| **Overall Completion** | ~65% |
| **Build Status** | ✅ Passes (zero errors, warnings only) |
| **Vercel Deployment** | ✅ Configured (`vercel.json` + `rootDirectory`) |
| **Local Dev Server** | ✅ Running (`http://localhost:3000`) |
| **Test Coverage** | ❌ 0% (no tests written) |

The project has a solid architectural foundation with the monorepo, database schema, auth flow, and core UI in place. The remaining work is primarily feature completion (document annotation, kanban, panel workflow, defense grading) and polish (PWA, tests, dark mode, missing admin routes).

---

## 1. Architecture & Infrastructure

### ✅ Fully Implemented

| Component | Status | Notes |
|---|---|---|
| **Turborepo monorepo** | ✅ | `turbo.json`, `pnpm-workspace.yaml`, root `package.json` with `postinstall` hook |
| **Next.js 15 App Router** | ✅ | Route groups: `student/`, `faculty/`, `admin/` |
| **Tailwind CSS v4** | ✅ | Maroon (`#800000`) / Gold (`#FFD700`) theme via `@theme` directive |
| **Prisma 6 schema** | ✅ | 15 models, 11 enums — all relations wired |
| **Supabase Auth** | ✅ | `@supabase/ssr` with client/server split, cookie-based sessions |
| **RBAC middleware** | ✅ | Role-based redirects, protected route guards |
| **Vercel deployment** | ✅ | `vercel.json` with `rootDirectory: apps/web` |
| **Supabase Storage** | ✅ | `manuscripts` + `avatars` buckets, upload/download/delete utilities |
| **DOCX→HTML conversion** | ✅ | `mammoth.js` in `packages/storage` |
| **pg_trgm setup** | ✅ | GIN index + `search_similar_titles()` function |

### ⚠️ Partially Implemented

| Component | Gap | Priority |
|---|---|---|
| **PWA** | `@serwist/next` installed but not wired into `next.config.ts`. No `sw.ts` service worker. Manifest exists but PWA won't install. | 🔴 High |
| **Route groups** | `(public)` and `(auth)` groups not used. Public pages sit at root level. | 🟡 Medium |
| **Config packages** | Plan says `packages/config/`; reality has `packages/eslint-config/` + `packages/typescript-config/`. (Arguably better.) | 🟢 Low |
| **Prisma env vars** | Schema uses `NEXT_POSTGRES_PRISMA_URL` / `NEXT_POSTGRES_URL_NON_POOLING`; `.env` has `DATABASE_URL` / `DIRECT_URL`. Works via fallback chain but should be aligned. | 🟡 Medium |

### ❌ Not Started

| Component | Notes |
|---|---|
| **Tests** | Zero test files. No `test` scripts. No Playwright config. |
| **Dark mode** | Only light theme defined. No `dark:` variants. |
| **Email notifications** | `Notification` model exists but no delivery mechanism. |
| **Signed URLs** | Storage only returns public URLs; no expiry-based signed URLs. |

---

## 2. Pages & Routes

### ✅ Implemented Routes

| Route | Purpose | Auth |
|---|---|---|
| `/` | Landing page (redesigned — nav, hero, stats, features, CTA, footer) | Public |
| `/login` | Email/password login with Supabase | Auth page |
| `/register` | Registration with role selection (Student/Faculty/Admin) | Auth page |
| `/archive` | Public archive listing with search | Public |
| `/archive/[id]` | Project detail page | Public |
| `/student/dashboard` | Student overview | `STUDENT` |
| `/student/project/documents` | Document upload & version list | `STUDENT` |
| `/student/project/documents/view/[id]` | DOCX viewer with HTML rendering | `STUDENT` |
| `/student/project/milestones` | Kanban board (3 columns) | `STUDENT` |
| `/student/project/title-check` | Trigram similarity search | `STUDENT` |
| `/faculty/dashboard` | Advised groups + panel assignments | `FACULTY` |
| `/faculty/evaluate/[versionId]` | Document annotation interface | `FACULTY` |
| `/faculty/evaluate/project/[projectId]` | Project evaluation overview | `FACULTY` |
| `/admin/dashboard` | Analytics with 3 charts + overview cards | `ADMIN` |
| `/admin/rubrics` | Rubric viewer (read-only) | `ADMIN` |
| `/admin/defense-schedule` | Static calendar + mock schedule list | `ADMIN` |

###  Missing Routes (from plan)

| Route | Purpose | Priority |
|---|---|---|
| `/student/group` | Group creation & member management | 🔴 High |
| `/student/project/panel` | Panel nomination workflow | 🔴 High |
| `/student/project/defense/[stage]` | Defense stage detail | 🟡 Medium |
| `/faculty/advised/[groupId]` | Advised group detail | 🟡 Medium |
| `/faculty/panels/[projectId]` | Panel management | 🟡 Medium |
| `/admin/users` | User management | 🟡 Medium |
| `/admin/projects` | Project management |  Low |
| `/admin/groups` | Group management | 🟢 Low |
| `/admin/archive` | Admin archive management |  Low |
| `/admin/settings` | System settings | 🟢 Low |

---

## 3. Database Schema

### Enums — All 11 implemented

| Enum | Status | Notes |
|---|---|---|
| `UserRole` | ✅ | `STUDENT`, `FACULTY`, `ADMIN` |
| `FacultyPosition` | ✅ | `INSTRUCTOR`, `PROGRAM_CHAIR`, `DEAN` |
| `GroupStatus` | ✅ | `FORMING`, `ACTIVE`, `COMPLETED`, `DISSOLVED` |
| `DefenseStage` | ✅ | `TITLE`, `PRE_ORAL`, `TECHNICAL`, `FINAL` |
| `ProjectStatus` | ✅ | 8 statuses from `TITLE_PROPOSAL` to `ARCHIVED` |
| `MilestoneStatus` | ✅ | `TODO`, `IN_PROGRESS`, `FOR_REVIEW`, `DONE` — but UI only uses 3 columns (missing `FOR_REVIEW`) |
| `PanelStatus` | ✅ | `NOMINATED`, `CONFIRMED`, `DECLINED` |
| `DocType` | ✅ | `DOCX`, `PDF` |
| `AnnotationType` | ✅ | `COMMENT`, `SUGGESTION`, `CORRECTION`, `MUST_FIX` |
| `DefenseVerdict` | ✅ | `PASS`, `CONDITIONAL`, `FAIL` |
| `Semester` | ❌ | Missing from schema (`FIRST`, `SECOND`, `SUMMER`) |

### Models — All 15 implemented

| Model | Status | Notes |
|---|---|---|
| `User` | ✅ | Extra `uploadedDocuments` relation (not in plan) |
| `CapstoneGroup` | ✅ | `name` is nullable (plan implies required) |
| `GroupMember` | ✅ | Uses `isLeader: Boolean` instead of `role_in_group` enum — functionally equivalent |
| `CapstoneProject` | ✅ | Exact match |
| `PanelAssignment` | ✅ | Has `isMandatory` flag (good addition for chair/dean) |
| `DocumentVersion` | ✅ | `fileSize` hardcoded to `0` in upload action |
| `DocumentAnnotation` | ✅ | Exact match |
| `Milestone` | ✅ | Exact match |
| `EvaluationRubric` | ✅ | Exact match |
| `RubricCriterion` | ✅ | Exact match |
| `Evaluation` | ✅ | Exact match |
| `EvaluationScore` | ✅ | Exact match |
| `DefenseSchedule` | ✅ | Missing `status` field (Scheduled/In Progress/Completed) |
| `HistoricalTitle` | ✅ | Exact match |
| `Notification` | ✅ | Exact match |

---

## 4. Key Features Status

### Document Annotation System

| Feature | Status | Notes |
|---|---|---|
| DOCX upload → mammoth conversion → HTML storage | ✅ | Full pipeline working |
| `DocumentViewer` component | ✅ | Paragraph click handling, annotation mode |
| Text selection → annotation popover | ✅ | Sidebar with comment form |
| Annotation filtering (type, status, author) | ⚠️ | UI exists but filtering not fully wired |
| Student "Mark as Addressed" toggle | ✅ | Implemented |
| PDF rendering with `react-pdf` | ❌ | PDFs show placeholder; `react-pdf` not installed |

### Kanban Milestone Tracker

| Feature | Status | Notes |
|---|---|---|
| Drag-and-drop with `@hello-pangea/dnd` | ✅ | Optimistic updates working |
| 4 columns (TODO → In Progress → For Review → Done) | ⚠️ | Only 3 columns; `FOR_REVIEW` missing from UI |
| Due dates | ⚠️ | Schema supports it; UI displays it; no date picker |
| Assignee per milestone | ❌ | Not in schema or UI |

### Title Verification (pg_trgm)

| Feature | Status | Notes |
|---|---|---|
| `search_similar_titles()` SQL function | ✅ | Created via `setup-pg-trgm.ts` |
| Server Action calling `prisma.$queryRawUnsafe` | ✅ | Debounced input with live results |
| Severity thresholds | ⚠️ | Plan: 0.3/0.5/0.7. Reality: 0.2 API threshold, 0.4/0.7 UI thresholds |

### Defense Evaluation

| Feature | Status | Notes |
|---|---|---|
| Digital rubric scoresheet | ⚠️ | Page exists but grading form not fully wired |
| Auto-computed weighted total | ⚠️ | Calculation logic exists but not connected to UI |
| Verdict selection (PASS/CONDITIONAL/FAIL) | ⚠️ | UI exists but submission not wired |
| Submit locks evaluation | ❌ | No lock mechanism |

### Rubric Builder (Admin)

| Feature | Status | Notes |
|---|---|---|
| View rubrics per stage | ✅ | Read-only display working |
| CRUD (create/edit/delete) | ❌ | Buttons exist but non-functional |
| Weight validation (sum to 100%) | ✅ | Error shown when weights don't sum |
| Activate/deactivate toggle | ❌ | Not implemented |
| Preview-as-panelist mode | ❌ | Not implemented |

### Defense Scheduling (Admin)

| Feature | Status | Notes |
|---|---|---|
| Calendar view | ⚠️ | Static grid hardcoded to May 2026 |
| Schedule list | ⚠️ | Mock data (2 hardcoded entries), not from DB |
| DB integration | ❌ | No queries to `DefenseSchedule` model |
| Auto-notify panelists | ❌ | No notification delivery |
| Status tracking | ❌ | No Scheduled/In Progress/Completed |

### Analytics Dashboard (Admin)

| Feature | Status | Notes |
|---|---|---|
| Overview cards (Projects, Students, Faculty, Completion Rate) | ✅ | Working |
| Cohort Velocity (AreaChart) | ✅ | Working |
| Domain Distribution (PieChart) | ✅ | Working |
| Defense Pass Rates (BarChart) | ✅ | Working |
| Deliverable Delays heatmap | ❌ | Not implemented |
| Active Users engagement metrics | ❌ | Not implemented |

### Public Archive

| Feature | Status | Notes |
|---|---|---|
| SSR listing with search | ✅ | Query + domain filter |
| Project detail page | ✅ | Full details, team, panel |
| pg_trgm-powered fuzzy search | ❌ | Uses basic `contains`, not `search_similar_titles` |
| Download manuscript | ❌ | Button exists but non-functional |
| SEO metadata | ⚠️ | Basic metadata; no OG tags |

---

## 5. Dependencies Audit

### Plan-specified libraries

| Library | Status | Location |
|---|---|---|
| `mammoth` | ✅ | `packages/storage/package.json` |
| `react-pdf` | ❌ | Not installed |
| `@hello-pangea/dnd` | ✅ | `apps/web/package.json` |
| `recharts` | ✅ | `apps/web/package.json` |
| `@serwist/next` | ⚠️ | Installed but not configured |
| `zod` | ❌ | Not installed — all forms use manual validation |
| `react-hook-form` |  | Not installed — all forms use raw `useState` |
| `lucide-react` | ✅ | `packages/ui` + `apps/web` |
| `date-fns` | ✅ | `apps/web/package.json` |

### Additional dependencies (not in plan)

| Library | Purpose |
|---|---|
| `sonner` | Toast notifications (used throughout) |
| `class-variance-authority` | CVA variant system for Button/Badge |
| `clsx` + `tailwind-merge` | `cn()` utility |
| `@radix-ui/react-slot` | Button `asChild` pattern |

---

## 6. Seed Data

| Item | Plan | Reality | Gap |
|---|---|---|---|
| Faculty users | 5 (1 dean, 1 chair, 3 instructors) | 3 (1 dean, 1 chair, 1 instructor) | -2 |
| Student users | 15 across 3 groups | 5 in 1 group | -10 students, -2 groups |
| Sample projects | 3 | 1 | -2 |
| Historical titles | 50+ | 6 | -44 |
| Default rubrics (4 stages) | ✅ | ✅ | — |

---

## 7. UI Components

| Component | Status | File |
|---|---|---|
| Button | ✅ | `packages/ui/src/components/button.tsx` |
| Card | ✅ | `packages/ui/src/components/card.tsx` |
| Badge | ✅ | `packages/ui/src/components/badge.tsx` |
| DocumentViewer | ✅ | `packages/ui/src/components/document-viewer.tsx` |
| FileUpload | ✅ | `packages/ui/src/components/file-upload.tsx` |
| Input | ❌ | Forms use raw `<input>` elements |
| Modal | ❌ | Not implemented |
| Tabs | ❌ | Not implemented |
| Avatar | ❌ | Inline divs used instead |
| Dropdown | ❌ | Not implemented |

---

## 8. Critical Issues (Must Fix Before Production)

| # | Issue | Impact | Fix |
|---|---|---|---|
| 1 | **PWA not wired up** | PWA install prompt won't work; no offline support | Add `withSerwist` to `next.config.ts`, create `sw.ts` |
| 2 | **Zero tests** | No safety net for refactoring or regression | Add Vitest + Playwright |
| 3 | **No `zod` validation** | Forms accept invalid data; no schema enforcement | Install `zod` + `react-hook-form`, add validation to all forms |
| 4 | **Prisma env var mismatch** | Schema uses different env var names than `.env` | Align schema to use `DATABASE_URL` / `DIRECT_URL` |
| 5 | **Defense scheduling uses mock data** | Admin page shows fake data, not from DB | Wire up `DefenseSchedule` queries |
| 6 | **Rubric builder CRUD non-functional** | Admin can't create or edit rubrics | Implement create/edit forms with modals |
| 7 | **Missing `Semester` enum** | Can't scope projects by academic term | Add `Semester` enum to schema |
| 8 | **`react-pdf` not installed** | PDFs can't be viewed in browser | Install `react-pdf`, add PDF viewer |

---

## 9. Recommended Next Steps

### Phase A — Critical Fixes (Week 1)
1. Wire up PWA (`@serwist/next` in `next.config.ts` + `sw.ts`)
2. Add `zod` + `react-hook-form` to all forms
3. Fix Prisma env var alignment
4. Add basic unit tests for grade computation, similarity scoring, validation schemas

### Phase B — Feature Completion (Week 2-3)
5. Complete rubric builder CRUD
6. Wire defense scheduling to database
7. Implement group management (`/student/group`)
8. Implement panel nomination workflow (`/student/project/panel`)
9. Add `FOR_REVIEW` column to kanban
10. Add `Semester` enum

### Phase C — Polish (Week 4)
11. Add `react-pdf` for PDF viewing
12. Implement dark mode
13. Add missing admin routes (`/admin/users`, `/admin/projects`, etc.)
14. Expand seed data (50+ titles, 3 groups, 15 students)
15. Add E2E tests with Playwright

---

## 10. Files Modified Since Last Commit

| File | Change |
|---|---|
| `apps/web/src/app/layout.tsx` | Added `suppressHydrationWarning` to `<html>` and `<body>` |
| `apps/web/src/app/page.tsx` | Complete redesign — nav, hero, stats, features, CTA, footer |
| `apps/web/src/app/register/page.tsx` | New — registration with role selection |
| `apps/web/src/middleware.ts` | Added redirect for logged-in users on auth pages; added `/register` to matcher |
| `apps/web/.env` | Copied from repo root (Next.js needs it in app directory) |
| `apps/web/.env.local` | Copied from repo root |
| `.gitignore` | Added `.env`, `.env.local`, `*.tsbuildinfo`, `.next`, `dev-server.log` |
