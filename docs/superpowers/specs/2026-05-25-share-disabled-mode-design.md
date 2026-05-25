# Share-Disabled Mode — Design

**Date:** 2026-05-25
**Status:** Draft for review
**Author:** rukchanok krumsamer

## Problem

PhoenixTune ปัจจุบันมีทั้ง community/share features (tunes, forums, profiles, saved, search) และ Forza Horizon auto-tune calculator. Community feature ยังไม่มี traction พอ — แต่ calculator เป็น utility ที่ใช้ได้ทันทีและมีศักยภาพดึง traffic + ad revenue ได้เลย.

เป้าหมาย: ปิด share/community ชั่วคราว, focus ขาย calculator เป็น product หลัก. ตอน user base โตพอค่อยเปิดกลับ.

## Goals

1. ปิด share feature ทั้งหมดด้วย env flag — ไม่ต้องลบ code, ไม่แตะ DB
2. Calculator เปิดให้ใช้ฟรี ไม่ต้อง login — ลด friction, เพิ่ม conversion สำหรับ ads
3. Homepage redesign เป็น calculator-first landing — ดึง CTA ไป /calculator
4. กลับมาเปิด share feature ได้ทันทีโดยเปลี่ยน env เดียว
5. เก็บ blog/guideline read-only ไว้สำหรับ SEO traffic

## Non-Goals

- ไม่ลบ code share feature ออกจาก codebase
- ไม่ migrate/drop DB tables
- ไม่เพิ่ม game support (calculator ยังเป็น FH6 v2.0 เหมือนเดิม)
- ไม่แตะ Stripe / premium logic (premium flag ปิดอยู่แล้ว)
- ไม่ทำ ad placement ใหม่ — ใช้ AdUnit slots ที่มีอยู่
- ไม่เพิ่ม analytics หรือ tracking ใหม่
- ไม่เปลี่ยน calculator logic / output

## Architecture

### Feature flag

ใช้ pattern เดียวกับ `NEXT_PUBLIC_PREMIUM_ENABLED` ที่มีอยู่:

```ts
// src/lib/share.ts
export const SHARE_ENABLED =
  process.env.NEXT_PUBLIC_SHARE_ENABLED !== "false";

// Routes ที่ปิดเมื่อ flag = false
export const SHARE_ROUTE_PREFIXES = [
  "/tunes",
  "/saved",
  "/profile",
  "/forums",
  "/games",
] as const;

// Sub-routes ที่ปิดแม้ keep route หลักไว้
export const SHARE_ROUTE_EXACT_PREFIXES = [
  "/blog/new",
  "/guideline/new",
] as const;

// API prefixes ที่ปิดเมื่อ flag = false
export const SHARE_API_PREFIXES = [
  "/api/tunes",
  "/api/saves",
  "/api/forum",
  "/api/search",
] as const;
```

Default = `true` (พฤติกรรมเดิม) — ต้อง set `NEXT_PUBLIC_SHARE_ENABLED=false` ใน production เท่านั้น

### Defense in depth (3 layers)

1. **Edge gate (`src/proxy.ts`)** — redirect share routes → `/` ที่ Next.js proxy. ป้องกันการเข้า URL ตรง + Google indexing
2. **API gate** — share API routes return `404` ถ้า flag off (ผ่าน helper `assertShareEnabled()` ตอนต้น handler)
3. **UI gate** — Navbar, Footer, Home, blog/guideline pages เช็ค `SHARE_ENABLED` ก่อน render link/widgets

### Scope of changes

#### Hidden เมื่อ `SHARE_ENABLED=false`

| Area | Detail |
|---|---|
| Routes | `/tunes`, `/tunes/[id]`, `/tunes/new`, `/saved`, `/profile/[username]`, `/forums/*`, `/games/*`, `/blog/new`, `/guideline/new` |
| APIs | `/api/tunes/*`, `/api/saves`, `/api/forum/*`, `/api/search` (all return 404) |
| Blog/Guideline mutating APIs | `POST /api/blog/posts`, `/api/blog/comments`, `POST /api/guideline/posts`, `/api/guideline/comments` |
| Navbar | Forums link, Games dropdown, Search bar, Login/Register CTAs, user menu items (Profile, MyTunes, SavedTunes) |
| Footer | Share-related links |
| Home | tune count, latest forum posts, games widget |
| Blog/Guideline pages | "New post" buttons, comment form, upvote/like ปุ่ม |
| Calculator | Login wall (`showLoginPrompt` + gating logic) |

#### Kept (functioning normally)

| Area | Notes |
|---|---|
| `/calculator` | Core product — กลายเป็น public/no-login |
| `/blog`, `/blog/[id]` | Read-only — content + SEO |
| `/guideline`, `/guideline/[id]` | Read-only — content + SEO |
| `/login`, `/register` | Auth ยังเข้าได้ direct (ไม่มี nav link), keep existing user revival path |
| `/settings` | Keep password change. Avatar upload + public-profile fields hide |
| `/terms`, `/privacy` | Static pages |
| User menu (when logged in) | Settings + Sign out only |
| Stripe webhook | Idle (PREMIUM_ENABLED off) |
| Auth flow, Supabase clients, DB schema | ไม่แตะ |
| Calculator logic (`src/lib/calculator.ts`) | ไม่แตะ |

### Homepage redesign (`src/components/home/HomeClient.tsx`)

โครงสร้างใหม่:

1. **Hero** — product name + tagline "Auto-tune calculator for Forza Horizon 5/6" + CTA "Calculate now" → `/calculator`
2. **How it works** — 3 ขั้นตอนสั้น ๆ
3. **Features** — รองรับ FH6 / drivetrain ทั้งหมด / discipline 6 แบบ / ฟรี / ไม่ต้อง login
4. **Latest tips** — preview 3 blog posts + 3 guideline posts (ลิงก์ภายในเพื่อ SEO)
5. **Footer CTAs** — ลิงก์ Blog, Guideline, Terms, Privacy

`src/app/page.tsx` (server component): ดึง DB query ออก — เหลือเฉพาะ query blog/guideline posts สำหรับ "Latest tips". ตัด `tuneCount`, `tunerCount`, `gameCount`, `latestPostsRaw`, `games` queries.

### Calculator changes (`src/app/(main)/calculator/page.tsx`)

**Important:** การถอด login wall ออกจาก calculator เป็น **permanent change** ไม่ผูกกับ `SHARE_ENABLED` flag. ตอนเปิด share กลับมาในอนาคต ถ้าอยากบังคับ login อีกครั้งให้เป็น decision แยกต่างหาก.

- ลบ state `showLoginPrompt` + `setShowLoginPrompt` + login prompt UI block
- ปุ่ม Calculate: เปลี่ยน condition จาก `isLoggedIn ? "#facc15" : "#1e293b"` → ใช้สีเหลืองตลอด (active สีเดียว)
- ลบ branch `if (!user) { setShowLoginPrompt(true); return; }` ใน `handleCalc`
- เก็บ `useUserStore` ไว้สำหรับ loading state (เผื่อ logged-in user เข้ามา) — แต่ไม่ gate การคำนวณ
- AdUnit 2 จุดยังอยู่: `calculator-form-bottom`, `calculator-result-bottom`

## Component Boundaries

| Unit | Responsibility | Dependencies |
|---|---|---|
| `src/lib/share.ts` | Flag + route lists (pure constants) | none |
| `src/proxy.ts` | Edge redirect logic | `share.ts` |
| `src/lib/api/share-gate.ts` (new helper) | `assertShareEnabled()` → returns 404 NextResponse | `share.ts` |
| Each share API route | calls `assertShareEnabled()` at top | helper |
| `Navbar.tsx`, `Footer.tsx`, `HomeClient.tsx` | conditional render ตาม `SHARE_ENABLED` | `share.ts` |
| Calculator page | ลบ login wall (ไม่เกี่ยวกับ flag เลย — เป็น direct change) | none |

## Error Handling

- API ที่ปิด: return `NextResponse.json({ error: "Not found" }, { status: 404 })` — เหมือน resource ไม่มีอยู่จริง ไม่ leak ว่า feature flag ปิดอยู่
- Proxy redirect: ใช้ 307 (temporary) ไม่ใช่ 308 — เพื่อให้กลับมาเปิดได้ไม่มี cache permanent ใน browser
- หน้า blog/guideline single post ที่ user ยังเข้าได้: comments section ถ้า flag off → render placeholder "Comments are temporarily disabled"
- Existing user ที่ทำ session อยู่: bind หน้าเดิม (`/profile/[username]`) → redirect ไป `/` — ไม่ error, ไม่ flash

## Testing

### Unit / integration

- `src/lib/share.test.ts` — verify default = `true`, `"false"` → `false`, อื่น ๆ → `true`
- ไม่ต้อง mock API routes — ใช้ `npm run check` (typecheck + existing tests) เป็น regression net

### Manual

1. **Flag off** (`NEXT_PUBLIC_SHARE_ENABLED=false`)
   - Navbar: ไม่มี Forums, Games, Search, Login/Register
   - Home: calculator-first landing ไม่มี community widgets
   - `/calculator`: ใช้งานได้ไม่ต้อง login, ปุ่มสีเหลืองทันที
   - `/tunes`, `/forums`, `/saved`, `/profile/x`, `/games/forza-horizon-5` → redirect ไป `/`
   - `/blog`, `/blog/[id]`, `/guideline`, `/guideline/[id]` → เปิดอ่านได้, ไม่มีปุ่ม "New post" / comments
   - `/blog/new`, `/guideline/new` → redirect ไป `/`
   - `/api/tunes`, `/api/forum/posts`, `/api/saves`, `/api/search` → 404
   - `POST /api/blog/posts`, `POST /api/guideline/posts` → 404
   - `/login`, `/register` → เข้าได้ direct (สำหรับ admin/user เก่า)
2. **Flag on** (unset หรือ `true`)
   - ทุกอย่างกลับมาเหมือนเดิม — Navbar เต็ม, home เต็ม, /tunes ใช้งาน, calculator login wall กลับมา? — **ไม่** (calculator login wall ถอดออกแยกจาก flag — เป็น permanent change)

### CI

`npm run check` (lint + typecheck + format + tests) ต้องผ่านทั้งสอง state ของ flag

## Rollout

1. Branch `chore/share-disabled-mode`
2. Implement ตาม plan
3. Run `npm run check` locally
4. Manual test ด้วย `.env.local` set `NEXT_PUBLIC_SHARE_ENABLED=false`
5. Merge → main → Vercel preview deploy
6. ตั้ง `NEXT_PUBLIC_SHARE_ENABLED=false` ใน Vercel production env (preview ทดสอบ flag both states)
7. Promote to production
8. Verify production URLs ตาม checklist Manual
9. ตอนพร้อมเปิด share กลับ: เปลี่ยน Vercel env → unset หรือ `true` → redeploy

## Open Questions

ไม่มี — ทุก section ได้รับ approval แล้ว
