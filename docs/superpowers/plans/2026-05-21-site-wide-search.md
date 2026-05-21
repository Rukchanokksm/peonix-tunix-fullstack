# Site-wide Instant Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a navbar dropdown that searches tunes, users, and cars instantly as the user types, replacing the current redirect-to-tunes behavior.

**Architecture:** New `GET /api/search` endpoint runs 3 parallel Supabase queries (cars + users in parallel, then tunes filtered by matching car IDs) using ILIKE accelerated by `pg_trgm` GIN indexes. A new client `SearchDropdown` component owns the input wiring (debounced fetch, AbortController, keyboard nav, mobile overlay) and is mounted from the existing Navbar input.

**Tech Stack:** Next.js 16 App Router + Supabase (Postgres + RLS) + Postgres `pg_trgm` extension + React 19 + Vitest (node env). i18n via existing `useLanguage()`.

**Spec:** `docs/superpowers/specs/2026-05-21-site-wide-search-design.md`

---

## File map

| Path                                         | Action | Responsibility                                                                                                                                                                                            |
| -------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `supabase/migrations/012_search_indexes.sql` | create | Enable `pg_trgm`; add 6 GIN trigram indexes on tunes/user_profiles/cars searchable columns.                                                                                                               |
| `src/lib/useDebounce.ts`                     | create | Generic `useDebounce<T>(value, ms)` hook.                                                                                                                                                                 |
| `src/lib/useDebounce.test.ts`                | create | Vitest tests using fake timers.                                                                                                                                                                           |
| `src/app/api/search/route.ts`                | create | `GET` handler. Validates `q`/`limit`, runs cars+users in parallel, then tunes with `car_id IN (matched ids)` OR text match, returns grouped JSON. Per-query try/catch returns `[]` on failure.            |
| `src/components/search/SearchDropdown.tsx`   | create | Client component. Owns dropdown lifecycle (focus, click-outside, Esc), fetches debounced, keyboard nav (↑↓ Enter Esc), renders 3 grouped sections + "See all tunes" footer, responsive overlay at <640px. |
| `src/lib/i18n/messages.ts`                   | modify | Add `search` section to `Schema`, `en`, `th`.                                                                                                                                                             |
| `src/components/layout/Navbar.tsx`           | modify | Replace `<form onSubmit={handleSearch}>` with a `<div>` that holds the input + mounts `<SearchDropdown />`. Remove `handleSearch` function.                                                               |

---

## Task 1: Database migration (apply via Supabase Dashboard)

**Files:**

- Create: `supabase/migrations/012_search_indexes.sql`

- [ ] **Step 1: Create migration file**

Create `supabase/migrations/012_search_indexes.sql`:

```sql
-- Site-wide instant search (2026-05-21)
-- Enable trigram extension and add GIN indexes for ILIKE acceleration
-- on tunes, user_profiles, and cars searchable columns.

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

- [ ] **Step 2: Apply to Supabase (user-driven)**

Open Supabase Dashboard → SQL Editor → paste the migration contents → Run.

Verify it succeeded by running:

```sql
select indexname from pg_indexes
where indexname in (
  'tunes_title_trgm_idx', 'tunes_description_trgm_idx',
  'user_profiles_username_trgm_idx', 'user_profiles_bio_trgm_idx',
  'cars_make_trgm_idx', 'cars_model_trgm_idx'
);
```

Expected: 6 rows returned.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/012_search_indexes.sql
git commit -m "feat(db): add trigram indexes for site-wide search"
```

---

## Task 2: Add i18n keys

**Files:**

- Modify: `src/lib/i18n/messages.ts`

- [ ] **Step 1: Add `search` to the `Schema` type**

In `src/lib/i18n/messages.ts`, find the `Schema` type definition and add a `search` field after the existing top-level sections (the file has `nav`, `footer`, `auth`, `home`, `tunes`, `tuneDetail`, `forums`, `calc`, `settings`, `saved`).

Add this block to the `Schema` type:

```ts
search: Record<
  | "hint"
  | "loading"
  | "noResults"
  | "groupTunes"
  | "groupUsers"
  | "groupCars"
  | "seeAllTunes"
  | "closeOverlay",
  string
>;
```

- [ ] **Step 2: Add `search` translations to `en`**

Find the `en` object in the same file and add:

```ts
  search: {
    hint: "Type to search tunes, users, cars",
    loading: "Searching...",
    noResults: "No matches for",
    groupTunes: "Tunes",
    groupUsers: "Users",
    groupCars: "Cars",
    seeAllTunes: "See all tunes →",
    closeOverlay: "Close search",
  },
```

- [ ] **Step 3: Add `search` translations to `th`**

Find the `th` object and add:

```ts
  search: {
    hint: "พิมพ์เพื่อค้นหา tunes, users, cars",
    loading: "กำลังค้นหา...",
    noResults: "ไม่พบผลลัพธ์สำหรับ",
    groupTunes: "Tunes",
    groupUsers: "Users",
    groupCars: "Cars",
    seeAllTunes: "ดู Tunes ทั้งหมด →",
    closeOverlay: "ปิดการค้นหา",
  },
```

- [ ] **Step 4: Verify typecheck passes**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/i18n/messages.ts
git commit -m "feat(i18n): add search dropdown translations"
```

---

## Task 3: useDebounce hook (TDD)

**Files:**

- Create: `src/lib/useDebounce.ts`
- Test: `src/lib/useDebounce.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/useDebounce.test.ts`:

```ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 200));
    expect(result.current).toBe("hello");
  });

  it("delays updates by the given ms", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      { initialProps: { value: "a" } },
    );
    expect(result.current).toBe("a");

    rerender({ value: "b" });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("b");
  });

  it("resets the timer when the value changes again before the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    rerender({ value: "c" });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current).toBe("c");
  });
});
```

Note: this uses `@testing-library/react`. If that package isn't installed, the test will fail at import — install it first:

```bash
npm install --save-dev @testing-library/react
```

The `vitest.config.ts` currently uses node env. Hook tests need a DOM. Update it (Step 2).

- [ ] **Step 2: Switch vitest to jsdom for this test only**

Vitest supports per-file environment via `// @vitest-environment jsdom` comment. Add as the first line of `src/lib/useDebounce.test.ts`:

```ts
// @vitest-environment jsdom
```

This keeps the global vitest config as node env (per project-tooling memory) and only opts this one test into jsdom. Install jsdom:

```bash
npm install --save-dev jsdom
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- useDebounce`
Expected: FAIL with "Cannot find module './useDebounce'" or similar import error.

- [ ] **Step 4: Implement the hook**

Create `src/lib/useDebounce.ts`:

```ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- useDebounce`
Expected: all 3 tests PASS.

- [ ] **Step 6: Run the full gate**

Run: `npm run check`
Expected: lint passes (or unchanged warnings only), typecheck passes, format:check passes, all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/useDebounce.ts src/lib/useDebounce.test.ts package.json package-lock.json
git commit -m "feat(lib): add useDebounce hook with tests"
```

---

## Task 4: Search API route

**Files:**

- Create: `src/app/api/search/route.ts`

- [ ] **Step 1: Create the route file**

Create `src/app/api/search/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type TuneResult = {
  id: string;
  title: string;
  discipline: string;
  upvotes: number;
  car: { make: string; model: string; pi_class: string } | null;
  game: { name: string; slug: string } | null;
};

type UserResult = {
  id: string;
  username: string;
  avatar_url: string | null;
};

type CarResult = {
  id: string;
  make: string;
  model: string;
  year: number;
  pi_class: string;
  game: { slug: string } | null;
};

type SearchResponse = {
  tunes: TuneResult[];
  users: UserResult[];
  cars: CarResult[];
};

const EMPTY: SearchResponse = { tunes: [], users: [], cars: [] };

async function safe<T>(label: string, fn: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fn();
  } catch (e) {
    console.error(`[search] ${label} query failed:`, e);
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = (searchParams.get("q") ?? "").trim();
  const limit = Math.min(
    20,
    Math.max(1, Number(searchParams.get("limit") ?? "5")),
  );

  if (q.length < 2) return NextResponse.json(EMPTY);

  const supabase = await createClient();
  const pattern = `%${q}%`;

  // Resolve cars + users in parallel
  const [cars, users] = await Promise.all([
    safe<CarResult>("cars", async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("id, make, model, year, pi_class, game:games(slug)")
        .or(`make.ilike.${pattern},model.ilike.${pattern}`)
        .order("make", { ascending: true })
        .order("model", { ascending: true })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as unknown as CarResult[];
    }),
    safe<UserResult>("users", async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, username, avatar_url")
        .or(`username.ilike.${pattern},bio.ilike.${pattern}`)
        .order("username", { ascending: true })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as UserResult[];
    }),
  ]);

  // Tunes: text match OR car_id IN (matched cars)
  const carIds = cars.map((c) => c.id);
  const carFilter = carIds.length ? `,car_id.in.(${carIds.join(",")})` : "";

  const tunes = await safe<TuneResult>("tunes", async () => {
    const { data, error } = await supabase
      .from("tunes")
      .select(
        `id, title, discipline, upvotes,
         car:cars(make, model, pi_class),
         game:games(name, slug)`,
      )
      .or(`title.ilike.${pattern},description.ilike.${pattern}${carFilter}`)
      .order("upvotes", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as TuneResult[];
  });

  return NextResponse.json({ tunes, users, cars });
}
```

- [ ] **Step 2: Smoke-test the route**

Start dev server: `npm run dev`

In a separate terminal:

```bash
curl "http://localhost:3000/api/search?q=a"
```

Expected: `{"tunes":[],"users":[],"cars":[]}` (q is 1 char, gated client/server).

```bash
curl "http://localhost:3000/api/search?q=su"
```

Expected: a JSON response with the three keys, populated with real data from Supabase (assumes Supabase has cars/tunes/users containing "su"). Inspect manually.

- [ ] **Step 3: Run the full gate**

Run: `npm run check`
Expected: passes (no new lint errors).

- [ ] **Step 4: Commit**

```bash
git add src/app/api/search/route.ts
git commit -m "feat(api): add /api/search route for entity search"
```

---

## Task 5: SearchDropdown component

**Files:**

- Create: `src/components/search/SearchDropdown.tsx`

This task builds the dropdown with: fetch + debounce + AbortController, 3 grouped result sections, empty/loading/no-result states, click navigation, "See all tunes" footer link. Keyboard nav and mobile overlay are added in Tasks 6 and 7.

- [ ] **Step 1: Create the file**

Create `src/components/search/SearchDropdown.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useDebounce } from "@/lib/useDebounce";

type TuneResult = {
  id: string;
  title: string;
  discipline: string;
  upvotes: number;
  car: { make: string; model: string; pi_class: string } | null;
  game: { name: string; slug: string } | null;
};

type UserResult = {
  id: string;
  username: string;
  avatar_url: string | null;
};

type CarResult = {
  id: string;
  make: string;
  model: string;
  year: number;
  pi_class: string;
  game: { slug: string } | null;
};

type SearchResponse = {
  tunes: TuneResult[];
  users: UserResult[];
  cars: CarResult[];
};

const EMPTY: SearchResponse = { tunes: [], users: [], cars: [] };

export function SearchDropdown({
  query,
  open,
  onClose,
}: {
  query: string;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const T = t.search;
  const debounced = useDebounce(query.trim(), 200);
  const [data, setData] = useState<SearchResponse>(EMPTY);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch when debounced query changes
  useEffect(() => {
    if (debounced.length < 2) {
      setData(EMPTY);
      setLoading(false);
      return;
    }
    const ac = new AbortController();
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debounced)}`, {
      signal: ac.signal,
    })
      .then((r) => r.json())
      .then((json: SearchResponse) => {
        setData(json);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          console.warn("[search] fetch failed", e);
          setData(EMPTY);
          setLoading(false);
        }
      });
    return () => ac.abort();
  }, [debounced]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const showHint = debounced.length < 2;
  const hasResults =
    data.tunes.length + data.users.length + data.cars.length > 0;

  function go(href: string) {
    onClose();
    router.push(href);
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        left: 0,
        right: 0,
        background: "#13151c",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {showHint && (
        <div
          style={{
            padding: "16px",
            color: "#475569",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          {T.hint}
        </div>
      )}

      {!showHint && loading && (
        <div
          style={{
            padding: "16px",
            color: "#64748b",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          {T.loading}
        </div>
      )}

      {!showHint && !loading && !hasResults && (
        <div
          style={{
            padding: "16px",
            color: "#64748b",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          {T.noResults}{" "}
          <strong style={{ color: "#f1f5f9" }}>{debounced}</strong>
        </div>
      )}

      {!showHint && !loading && hasResults && (
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {data.tunes.length > 0 && (
            <Section title={T.groupTunes}>
              {data.tunes.map((tune) => (
                <Row
                  key={tune.id}
                  onClick={() => go(`/tunes/${tune.id}`)}
                  primary={tune.title}
                  secondary={
                    tune.car
                      ? `${tune.car.make} ${tune.car.model} · ${tune.car.pi_class}`
                      : tune.discipline
                  }
                  badge={tune.game?.slug
                    ?.replace("forza-horizon-", "FH")
                    .replace("the-crew-motorfest", "TCM")
                    .replace("nfs-unbound", "NFS")
                    .toUpperCase()}
                />
              ))}
            </Section>
          )}

          {data.users.length > 0 && (
            <Section title={T.groupUsers}>
              {data.users.map((u) => (
                <Row
                  key={u.id}
                  onClick={() => go(`/profile/${u.username}`)}
                  primary={u.username}
                  secondary="User"
                />
              ))}
            </Section>
          )}

          {data.cars.length > 0 && (
            <Section title={T.groupCars}>
              {data.cars.map((c) => (
                <Row
                  key={c.id}
                  onClick={() =>
                    go(
                      `/games/${c.game?.slug ?? ""}/${encodeURIComponent(
                        c.make,
                      )}/${c.id}`,
                    )
                  }
                  primary={`${c.make} ${c.model}`}
                  secondary={`${c.year} · ${c.pi_class}`}
                />
              ))}
            </Section>
          )}

          <Link
            href={`/tunes?search=${encodeURIComponent(debounced)}`}
            onClick={onClose}
            style={{
              display: "block",
              padding: "12px 14px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "#facc15",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            {T.seeAllTunes}
          </Link>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          padding: "8px 14px 4px",
          fontSize: "10px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          color: "#475569",
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({
  primary,
  secondary,
  badge,
  onClick,
}: {
  primary: string;
  secondary?: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        gap: "10px",
        padding: "8px 14px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        color: "#e2e8f0",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.background =
          "rgba(255,255,255,0.04)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.background = "transparent")
      }
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#f1f5f9",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {primary}
        </div>
        {secondary && (
          <div
            style={{
              fontSize: "11px",
              color: "#64748b",
              marginTop: "2px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {secondary}
          </div>
        )}
      </div>
      {badge && (
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#94a3b8",
            background: "rgba(255,255,255,0.06)",
            padding: "2px 6px",
            borderRadius: "4px",
            flexShrink: 0,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Run the gate**

Run: `npm run check`
Expected: passes.

(The component is not yet mounted anywhere — Task 8 wires it into Navbar. This step just verifies the component compiles.)

- [ ] **Step 3: Commit**

```bash
git add src/components/search/SearchDropdown.tsx
git commit -m "feat(search): add SearchDropdown component"
```

---

## Task 6: Keyboard navigation

**Files:**

- Modify: `src/components/search/SearchDropdown.tsx`

- [ ] **Step 1: Add a flat-index navigation model**

In `SearchDropdown.tsx`, just above the `return` statement (right after the `function go(...)` declaration), add a flat list of all clickable items and an active-index state:

```tsx
const flatItems: { onClick: () => void }[] = [
  ...data.tunes.map((tune) => ({
    onClick: () => go(`/tunes/${tune.id}`),
  })),
  ...data.users.map((u) => ({
    onClick: () => go(`/profile/${u.username}`),
  })),
  ...data.cars.map((c) => ({
    onClick: () =>
      go(`/games/${c.game?.slug ?? ""}/${encodeURIComponent(c.make)}/${c.id}`),
  })),
];

const [activeIdx, setActiveIdx] = useState(0);

// Reset active index whenever results change
useEffect(() => {
  setActiveIdx(0);
}, [data]);

// Keyboard handlers (attach to window while open)
useEffect(() => {
  if (!open) return;
  const handler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (flatItems.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % flatItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + flatItems.length) % flatItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      flatItems[activeIdx]?.onClick();
    }
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, [open, flatItems, activeIdx, onClose]);
```

- [ ] **Step 2: Pass active state to Row**

Update each `Row` rendering inside the three groups. Replace the existing 3 group blocks with these versions that compute a row index and pass `active`:

```tsx
{
  data.tunes.length > 0 && (
    <Section title={T.groupTunes}>
      {data.tunes.map((tune, i) => (
        <Row
          key={tune.id}
          active={activeIdx === i}
          onClick={() => go(`/tunes/${tune.id}`)}
          primary={tune.title}
          secondary={
            tune.car
              ? `${tune.car.make} ${tune.car.model} · ${tune.car.pi_class}`
              : tune.discipline
          }
          badge={tune.game?.slug
            ?.replace("forza-horizon-", "FH")
            .replace("the-crew-motorfest", "TCM")
            .replace("nfs-unbound", "NFS")
            .toUpperCase()}
        />
      ))}
    </Section>
  );
}

{
  data.users.length > 0 && (
    <Section title={T.groupUsers}>
      {data.users.map((u, i) => (
        <Row
          key={u.id}
          active={activeIdx === data.tunes.length + i}
          onClick={() => go(`/profile/${u.username}`)}
          primary={u.username}
          secondary="User"
        />
      ))}
    </Section>
  );
}

{
  data.cars.length > 0 && (
    <Section title={T.groupCars}>
      {data.cars.map((c, i) => (
        <Row
          key={c.id}
          active={activeIdx === data.tunes.length + data.users.length + i}
          onClick={() =>
            go(
              `/games/${c.game?.slug ?? ""}/${encodeURIComponent(
                c.make,
              )}/${c.id}`,
            )
          }
          primary={`${c.make} ${c.model}`}
          secondary={`${c.year} · ${c.pi_class}`}
        />
      ))}
    </Section>
  );
}
```

- [ ] **Step 3: Update `Row` to use `active`**

Replace the existing `Row` component with this version (adds `active` prop, applies hover background when active):

```tsx
function Row({
  primary,
  secondary,
  badge,
  onClick,
  active,
}: {
  primary: string;
  secondary?: string;
  badge?: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        gap: "10px",
        padding: "8px 14px",
        background: active ? "rgba(255,255,255,0.06)" : "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        color: "#e2e8f0",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.background =
          "rgba(255,255,255,0.06)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.background = active
          ? "rgba(255,255,255,0.06)"
          : "transparent")
      }
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#f1f5f9",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {primary}
        </div>
        {secondary && (
          <div
            style={{
              fontSize: "11px",
              color: "#64748b",
              marginTop: "2px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {secondary}
          </div>
        )}
      </div>
      {badge && (
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#94a3b8",
            background: "rgba(255,255,255,0.06)",
            padding: "2px 6px",
            borderRadius: "4px",
            flexShrink: 0,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
```

The original `Row` callers (without `active`) only existed in the old Step 2 code — Step 2 above now passes `active` everywhere, so this signature change is consistent.

- [ ] **Step 4: Run the gate**

Run: `npm run check`
Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add src/components/search/SearchDropdown.tsx
git commit -m "feat(search): add keyboard navigation to SearchDropdown"
```

---

## Task 7: Mobile overlay

**Files:**

- Modify: `src/components/search/SearchDropdown.tsx`

- [ ] **Step 1: Add a viewport-width hook inside the file**

Above the `SearchDropdown` function definition (and below the type definitions), add:

```tsx
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    const update = () => setMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return mobile;
}
```

- [ ] **Step 2: Use it in the dropdown and switch positioning**

Inside `SearchDropdown`, near the other hook calls (debounced, data, loading), add:

```tsx
const isMobile = useIsMobile();
```

Replace the existing top-level `<div ref={containerRef} style={{ position: "absolute", ... }}>` with a conditional style. Find the existing return:

```tsx
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        left: 0,
        right: 0,
        ...
      }}
    >
```

Replace with:

```tsx
    <div
      ref={containerRef}
      style={
        isMobile
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "#0d0f14",
              zIndex: 100,
              overflowY: "auto",
              padding: "12px",
            }
          : {
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              background: "#13151c",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
              zIndex: 50,
              overflow: "hidden",
            }
      }
    >
      {isMobile && (
        <button
          onClick={onClose}
          aria-label={T.closeOverlay}
          style={{
            display: "block",
            marginLeft: "auto",
            marginBottom: "8px",
            background: "rgba(255,255,255,0.06)",
            border: "none",
            color: "#94a3b8",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      )}
```

(Leave everything that was inside the original `<div>` intact.)

- [ ] **Step 3: Run the gate**

Run: `npm run check`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/components/search/SearchDropdown.tsx
git commit -m "feat(search): add mobile overlay layout for SearchDropdown"
```

---

## Task 8: Wire SearchDropdown into Navbar

**Files:**

- Modify: `src/components/layout/Navbar.tsx`

The Navbar currently has (line numbers approximate, refer to the file):

- Line 87: `const [searchQuery, setSearchQuery] = useState("");`
- Lines 130–134: `handleSearch` form-submit handler that does `router.push`.
- Lines 301–348: `<form onSubmit={handleSearch}>` wrapping the input and a submit button with `<SearchIcon />`.

We will:

1. Add an `open` state for the dropdown.
2. Replace the `<form>` with a `<div style={{ position: 'relative', ... }}>`.
3. Render `<SearchDropdown query={searchQuery} open={open} onClose={...} />` inside.
4. Remove `handleSearch` and the `<button type="submit">`.
5. Toggle `open` on input `onFocus`; close in `SearchDropdown`'s `onClose` callback.

- [ ] **Step 1: Add the import and state**

At the top of `src/components/layout/Navbar.tsx`, add to the existing imports:

```tsx
import { SearchDropdown } from "@/components/search/SearchDropdown";
```

Find the existing `searchQuery` state (around line 87) and add a new line below it:

```tsx
const [searchQuery, setSearchQuery] = useState("");
const [searchOpen, setSearchOpen] = useState(false);
```

- [ ] **Step 2: Remove `handleSearch`**

Delete the entire `handleSearch` function (around lines 129–135 — the comment block `// ── Search ──` and the function definition):

```tsx
// ── Search ──────────────────────────────────────────────────────────────
const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    router.push(`/tunes?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  }
};
```

- [ ] **Step 3: Replace the form with the new layout**

Find the existing search block (around lines 300–348):

```tsx
        {/* ── CENTER: Search ── */}
        <form
          onSubmit={handleSearch}
          style={{ position: "relative", width: "320px" }}
        >
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.nav.search}
            style={{ ...input styles... }}
            onFocus={...}
            onBlur={...}
          />
          <button type="submit" style={{ ...icon button styles... }}>
            <SearchIcon />
          </button>
        </form>
```

Replace with:

```tsx
{
  /* ── CENTER: Search ── */
}
<div style={{ position: "relative", width: "320px" }}>
  <input
    value={searchQuery}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      if (!searchOpen) setSearchOpen(true);
    }}
    onFocus={(e) => {
      setSearchOpen(true);
      (e.target as HTMLElement).style.borderColor = "rgba(250,204,21,0.5)";
    }}
    onBlur={(e) => {
      (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
    }}
    placeholder={t.nav.search}
    style={{
      width: "100%",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      padding: "7px 36px 7px 12px",
      color: "#e2e8f0",
      fontSize: "13px",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.15s",
    }}
  />
  <div
    style={{
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#64748b",
      display: "flex",
      alignItems: "center",
      pointerEvents: "none",
    }}
  >
    <SearchIcon />
  </div>
  <SearchDropdown
    query={searchQuery}
    open={searchOpen}
    onClose={() => {
      setSearchOpen(false);
      setSearchQuery("");
    }}
  />
</div>;
```

Notes:

- The `<button type="submit">` becomes a non-interactive icon (`pointerEvents: 'none'`) since there is no form to submit. The dropdown's "See all tunes" footer provides the same affordance.
- Resetting `searchQuery` to "" on close mimics the old behavior.

- [ ] **Step 4: Run the gate**

Run: `npm run check`
Expected: passes. If lint complains about unused `router` (since we removed `handleSearch`'s use of it), inspect — `router` may still be used elsewhere in Navbar (e.g., on logout). Only remove its import if it has zero uses.

- [ ] **Step 5: Manual smoke test**

Run: `npm run dev`

Open `http://localhost:3000` in a browser. With Supabase data populated:

1. Click into the navbar search input. Dropdown opens with hint text.
2. Type `a` — still shows hint (1 char).
3. Type `ab` — dropdown shows loading, then results (or "No matches for ab").
4. Type a real car name (e.g., `supra` if FH5/FH6 data exists). Verify a tune for that car appears even if its title doesn't contain "supra".
5. Click a result — navigates to the right page; dropdown closes.
6. Press Esc — dropdown closes.
7. Press ↓ / ↑ — highlight moves; Enter activates.
8. Resize window below 640px wide — dropdown becomes full-screen overlay; close button works.
9. Toggle language to Thai — UI strings update.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat(navbar): wire SearchDropdown into navbar search input"
```

---

## Task 9: Final verification

- [ ] **Step 1: Run full gate one more time**

Run: `npm run check`
Expected: lint (0 errors, ≤28 warnings — one new useEffect with deps is acceptable), typecheck passes, format:check passes, all tests pass (4 test files: existing 2 + new useDebounce.test.ts gives 3; total 74+3 = 77 tests).

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: production build succeeds. The `/api/search` route should be listed.

- [ ] **Step 3: Cross-language smoke test**

Already covered in Task 8 Step 5 — confirm both EN and TH work.

- [ ] **Step 4: Update CLAUDE.md (optional, only if a new pattern emerged)**

Currently no new patterns to document. Skip unless something surprised you during implementation.

---

## Notes for the implementer

- **Per-project rules:** the Supabase server client (`createClient` from `@/lib/supabase/server`) automatically reads the auth cookie — `/api/search` does NOT need an auth check (it returns public data only).
- **No FK hint needed for the tunes select:** the joined columns in this route (`car:cars(...)` and `game:games(...)`) are simple FKs, not ambiguous. CLAUDE.md's `tunes_user_id_fkey` hint is only required when joining `user_profiles` from `tunes`, which we don't do here.
- **`.or()` syntax gotcha:** Supabase REST `or` expects no spaces around commas inside the parameter. The route uses string interpolation; double-check that `pattern` doesn't contain a comma (it can't — `q` is URL-decoded but the `%q%` pattern is plain text from `q.trim()`).
- **Trigram index activation:** `pg_trgm` indexes are only used by the planner when the column has enough rows AND the planner picks them. With small dev datasets you may not see a measurable speedup — that's fine, it'll matter in production.
