# Site-wide Instant Search — Design

**Date:** 2026-05-21
**Status:** Approved, ready for implementation plan

## Problem

The navbar search input currently redirects to `/tunes?search=<q>`, which only searches tune titles/descriptions within the tunes listing page. Users cannot:

- Find a user profile by username from the navbar.
- Find a car directly (to browse its tune list).
- Get instant feedback while typing.

This forces multiple navigation steps and limits discoverability of users and cars as first-class entities.

## Goal

Provide an instant, cross-entity search dropdown from the navbar that surfaces **Tunes**, **Users**, and **Cars** as the user types — without requiring a page navigation.

## Non-goals

Explicitly out of scope for v1 (revisit later if engagement data justifies it):

- Searching long-form content (forum posts, blog, guideline).
- Filters inside the dropdown (game / discipline / PI class).
- Context-aware scoping (e.g., "search only inside FH6 when viewing FH6 pages") — search is always cross-game.
- Recent-searches history (localStorage or server-side).
- External search service (Algolia, Meilisearch).
- Typo correction beyond what `pg_trgm` provides natively.
- A dedicated `/search` results page. The dropdown's "See all tunes" footer link reuses the existing `/tunes?search=<q>` page.

## Approach

### Tech choice

Postgres `pg_trgm` extension with GIN trigram indexes, queried via `ILIKE '%q%'` and ranked by `similarity()`. Rationale:

- Tunix's dataset is small (community-scale, not millions of rows). Trigram is well within Postgres's comfort zone here.
- `ILIKE` handles UTF-8 (including Thai) without needing a tokenizer — Supabase's default Postgres has no Thai dictionary for `tsvector`, so full-text would degrade on Thai inputs.
- No new infrastructure or sync pipeline (vs. Algolia/Meilisearch).
- Trigram gives partial-match and minor typo tolerance for free.

### Architecture

```
Navbar input (existing)
  ↓ onChange, debounced 200ms, AbortController on stale
GET /api/search?q=<query>&limit=5
  ↓ runs 3 parallel Supabase queries
  ├─ tunes  (ILIKE on title/description, join cars for make/model match)
  ├─ users  (ILIKE on username/bio)
  └─ cars   (ILIKE on make/model)
  ↓ returns grouped JSON
SearchDropdown (new client component)
  ↓ renders 3 sections, keyboard nav, click-through
Navigate to /tunes/[id] | /profile/[username] | /games/[slug]/[brand]/[carId]
```

### API contract

```ts
GET /api/search?q=<string>&limit=<number, default 5>

200 →
{
  tunes: [{
    id: string;
    title: string;
    discipline: string;
    upvotes: number;
    car: { make: string; model: string; pi_class: string } | null;
    game: { name: string; slug: string } | null;
  }],
  users: [{
    id: string;
    username: string;
    avatar_url: string | null;
    tune_count: number;
  }],
  cars: [{
    id: string;
    make: string;
    model: string;
    year: number;
    pi_class: string;
    game: { slug: string } | null;
  }],
}

500 → { error: "Search failed" }     // all 3 sub-queries failed; client logs, shows empty state
```

- Empty / whitespace-only / `< 2 char` `q` returns `{ tunes: [], users: [], cars: [] }` (200) without hitting the DB. The client gates this too (no fetch fires when `q.trim().length < 2`), so the API check is defense-in-depth.
- `limit` is per-group, clamped to `[1, 20]`. Total max results displayed = `3 * limit`.

### Ranking

- **Tunes:** `similarity(title, q) DESC, upvotes DESC`. The car-match join uses `OR cars.make ILIKE %q% OR cars.model ILIKE %q%` so typing "supra" finds tunes for a Supra even when the tune title says "MK4 build".
- **Users:** `similarity(username, q) DESC, tune_count DESC`.
- **Cars:** `similarity(make || ' ' || model, q) DESC, make ASC`.

### Database migration

`supabase/migrations/012_search_indexes.sql`:

```sql
create extension if not exists pg_trgm;

create index if not exists tunes_title_trgm_idx
  on tunes using gin (title gin_trgm_ops);
create index if not exists tunes_description_trgm_idx
  on tunes using gin (description gin_trgm_ops);

create index if not exists user_profiles_username_trgm_idx
  on user_profiles using gin (username gin_trgm_ops);
create index if not exists user_profiles_bio_trgm_idx
  on user_profiles using gin (bio gin_trgm_ops);

create index if not exists cars_make_trgm_idx
  on cars using gin (make gin_trgm_ops);
create index if not exists cars_model_trgm_idx
  on cars using gin (model gin_trgm_ops);
```

Applied via the existing flow ([guideline_blog memory](../../../C:/Users/pepoi/.claude/projects/E--my-code-phoenixtune/memory/project_guideline_blog.md) notes Supabase CLI cannot be used from the agent shell — user runs SQL via Dashboard).

### UX states

| State | Behavior |
|---|---|
| Input empty, not focused | Show input only (current behavior). |
| Input empty, focused | Show dropdown with hint "Search tunes, users, cars". No DB call. |
| Typing, < 2 chars | Keep hint visible. No DB call. |
| Typing, ≥ 2 chars | Show loading spinner row while in-flight. Debounced 200ms. |
| Has results | 3 grouped sections (skip empty groups). Each row: avatar/badge + label + secondary text. Footer link "See all tunes matching <q> →". |
| Zero results | "No matches for **q**." (no suggestions in v1). |
| API error | Empty state + console warn. No toast (keep search non-intrusive). |
| Esc / click outside / select result | Close dropdown. |

### Keyboard navigation

- `↓` / `↑` cycle through visible items (across groups).
- `Enter` activates the focused item.
- `Esc` closes the dropdown and blurs the input.
- `Tab` closes dropdown and moves focus naturally.

### Mobile

Below 640px viewport width the dropdown becomes a full-screen overlay (top: 0, height: 100vh) with a close button. Same data and interactions.

### i18n

Add a `search` section to `src/lib/i18n/messages.ts`:

```ts
search: {
  placeholder: "Search tunes, users, cars" / "ค้นหา tunes, users, cars",
  hint: "Type to search" / "พิมพ์เพื่อค้นหา",
  loading: "Searching..." / "กำลังค้นหา...",
  noResults: "No matches for" / "ไม่พบผลลัพธ์สำหรับ",
  groupTunes: "Tunes" / "Tunes",
  groupUsers: "Users" / "Users",
  groupCars: "Cars" / "Cars",
  seeAllTunes: "See all tunes →" / "ดู Tunes ทั้งหมด →",
}
```

Per [project-patterns](../../../C:/Users/pepoi/.claude/projects/E--my-code-phoenixtune/memory/project_patterns.md), the dropdown is `"use client"`, so it can call `useLanguage()` directly.

## Components

| Path | Type | Responsibility |
|---|---|---|
| `supabase/migrations/012_search_indexes.sql` | new | Enable pg_trgm + 6 GIN indexes. |
| `src/app/api/search/route.ts` | new | `GET` handler: parse `q`/`limit`, run 3 queries in parallel, return grouped JSON. |
| `src/components/search/SearchDropdown.tsx` | new | Client component. Owns dropdown UI, focus state, keyboard nav, fetches `/api/search`, renders grouped results. |
| `src/lib/useDebounce.ts` | new | Tiny hook (`useDebounce(value, ms)`). |
| `src/components/layout/Navbar.tsx` | modified | Replace the current "Enter → /tunes?search=" handler with mounting `<SearchDropdown />` anchored to the input. Keep the input itself; the dropdown reads from it. |
| `src/lib/i18n/messages.ts` | modified | Add `search` section in `en` and `th`. |

## Error handling

- **Supabase error in any of the 3 queries:** the API catches per-query, logs server-side, and returns that group as `[]` (other groups still render). If all 3 fail, returns `500 { error }`.
- **AbortController:** the client cancels the in-flight request on every new keystroke, so out-of-order results never overwrite newer ones.
- **Invalid `limit`:** clamped to `[1, 20]`.
- **Empty `q`:** short-circuits to `{ tunes: [], users: [], cars: [] }` — no DB hit.

## Testing

- **Unit (vitest):** test `useDebounce` (timer behavior). Test a small helper that builds the grouped-results array (sort + cap-per-group).
- **Manual:** EN query (`supra`), TH query (`สึปรา` or any Thai input), partial match (`sup`), no-match (`xyzzy`), and keyboard nav (↑↓ Enter Esc). Check mobile overlay at viewport <640px.
- **Skip:** route integration tests against Supabase. Vitest scope per [project-tooling](../../../C:/Users/pepoi/.claude/projects/E--my-code-phoenixtune/memory/project_tooling.md) is node-only, no DB instance.

## Migration / rollout

1. Apply `012_search_indexes.sql` via Supabase Dashboard SQL Editor (user-driven, per existing pattern).
2. Ship the API + client code in one commit.
3. Verify on `npm run dev` against real Supabase data.
4. No feature flag — the dropdown is a strict superset of the current navbar behavior (still has "See all tunes" footer that mimics the old redirect).

## Open questions

None. Tech and UX are settled; implementation plan can proceed.
