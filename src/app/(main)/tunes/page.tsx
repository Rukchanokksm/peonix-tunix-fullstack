"use client";

import { useState, useEffect, useCallback, Fragment, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AdUnit } from "@/components/ads/AdUnit";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/image-games`;

// ─── Game config ────────────────────────────────────────────────────────────

const GAME_OPTS = [
  {
    slug: "forza-horizon-5",
    name: "Forza Horizon 5",
    short: "FH5",
    accent: "#60a5fa",
    active: true,
    note: null,
  },
  {
    slug: "forza-horizon-6",
    name: "Forza Horizon 6",
    short: "FH6",
    accent: "#c084fc",
    active: true,
    note: null,
  },
  {
    slug: "nfs-unbound",
    name: "NFS Unbound",
    short: "NFS",
    accent: "#f87171",
    active: true,
    note: null,
  },
  {
    slug: "the-crew-motorfest",
    name: "The Crew Motorfest",
    short: "TCM",
    accent: "#fb923c",
    active: true,
    note: null,
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface TuneRow {
  id: string;
  discipline: string;
  title: string;
  description?: string;
  upvotes: number;
  view_count: number;
  share_code?: string;
  created_at: string;
  updated_at: string;
  car: {
    id: string;
    make: string;
    model: string;
    pi_class: string;
    drivetrain: string;
  } | null;
  game: { id: string; name: string; slug: string } | null;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
    is_premium: boolean;
  } | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DISCIPLINES = [
  { id: "", label: "All" },
  { id: "street", label: "Street" },
  { id: "track", label: "Track" },
  { id: "drift", label: "Drift" },
  { id: "rally", label: "Rally" },
  { id: "offroad", label: "Offroad" },
  { id: "drag", label: "Drag" },
];

const PI_CLASSES = [
  { id: "", label: "All PI" },
  { id: "D", label: "D" },
  { id: "C", label: "C" },
  { id: "B", label: "B" },
  { id: "A", label: "A" },
  { id: "S1", label: "S1" },
  { id: "S2", label: "S2" },
  { id: "X", label: "X" },
  { id: "R", label: "R" },
];

const DRIVETRAINS = [
  { id: "", label: "All Drive" },
  { id: "AWD", label: "AWD" },
  { id: "RWD", label: "RWD" },
  { id: "FWD", label: "FWD" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest" },
  { id: "popular", label: "Popular" },
  { id: "trending", label: "Trending" },
];

const DISCIPLINE_STYLE: Record<string, { bg: string; color: string }> = {
  drift: { bg: "#2a0f1a", color: "#f472b6" },
  track: { bg: "#0f1a2a", color: "#60a5fa" },
  street: { bg: "#1a0f2a", color: "#c084fc" },
  rally: { bg: "#2a1f0f", color: "#fb923c" },
  offroad: { bg: "#2a2010", color: "#fbbf24" },
  drag: { bg: "#2a1010", color: "#f87171" },
};

const PI_COLORS: Record<string, string> = {
  D: "#94a3b8",
  C: "#fbbf24",
  B: "#4ade80",
  A: "#60a5fa",
  S1: "#c084fc",
  S2: "#f472b6",
  X: "#f87171",
  R: "#e879f9",
};

const GAME_ACCENT: Record<string, string> = {
  "forza-horizon-5": "#60a5fa",
  "forza-horizon-6": "#c084fc",
  "the-crew-motorfest": "#fb923c",
  "nfs-unbound": "#f87171",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function DisciplineBadge({ d }: { d: string }) {
  const s = DISCIPLINE_STYLE[d] ?? { bg: "#1e293b", color: "#94a3b8" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 9px",
        borderRadius: "5px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: s.bg,
        color: s.color,
      }}
    >
      {d}
    </span>
  );
}

function PIBadge({ pi }: { pi: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "1px 7px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 800,
        fontFamily: "monospace",
        background: "rgba(255,255,255,0.06)",
        color: PI_COLORS[pi] ?? "#94a3b8",
      }}
    >
      {pi}
    </span>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        background: active ? "#facc15" : "rgba(255,255,255,0.04)",
        color: active ? "#0d0f14" : "#94a3b8",
        border: active
          ? "1px solid #facc15"
          : "1px solid rgba(255,255,255,0.08)",
        fontSize: "13px",
        fontWeight: active ? 700 : 500,
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function TuneCardRow({ tune }: { tune: TuneRow }) {
  const [hovered, setHovered] = useState(false);
  const { t } = useLanguage();
  const T = t.tunes;
  const accent = tune.game
    ? (GAME_ACCENT[tune.game.slug] ?? "#facc15")
    : "#facc15";
  const shortGameName = (name: string) =>
    name
      .replace("Forza Horizon", "FH")
      .replace("Need for Speed", "NFS")
      .replace("The Crew Motorfest", "TCM");

  return (
    <Link
      href={`/tunes/${tune.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#13151c",
          border: `1px solid ${hovered ? accent + "55" : "rgba(255,255,255,0.06)"}`,
          borderRadius: "12px",
          padding: "18px 20px",
          display: "grid",
          gridTemplateColumns: "90px 1fr 130px 80px",
          gap: "16px",
          alignItems: "center",
          transition: "border-color 0.15s",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <DisciplineBadge d={tune.discipline} />
          {tune.car && <PIBadge pi={tune.car.pi_class} />}
        </div>

        <div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#f1f5f9",
              marginBottom: "4px",
              lineHeight: 1.3,
            }}
          >
            {tune.title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {tune.car && (
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                {tune.car.make} {tune.car.model}
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#334155",
                    fontSize: "11px",
                  }}
                >
                  {" · "}
                  {tune.car.drivetrain}
                </span>
              </span>
            )}
            {tune.game && (
              <span
                style={{
                  fontSize: "11px",
                  padding: "1px 7px",
                  borderRadius: "4px",
                  background: accent + "18",
                  color: accent,
                  fontWeight: 600,
                }}
              >
                {shortGameName(tune.game.name)}
              </span>
            )}
          </div>
          {tune.description && (
            <div
              style={{
                marginTop: "6px",
                fontSize: "12px",
                color: "#475569",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "500px",
              }}
            >
              {tune.description}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#1e3a5f,#0f2040)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: "#60a5fa",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {tune.user?.username?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#94a3b8",
              lineHeight: 1.2,
            }}
          >
            {tune.user?.username ?? T.unknown}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "17px",
              fontWeight: 800,
              color: "#f1f5f9",
            }}
          >
            <span style={{ color: "#facc15", marginRight: "3px" }}>^</span>
            {tune.upvotes}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#334155",
              marginTop: "2px",
            }}
          >
            {tune.view_count} {T.views}
          </div>
          {tune.updated_at &&
            new Date(tune.updated_at).getTime() -
              new Date(tune.created_at).getTime() >
              60_000 && (
              <div
                style={{
                  fontSize: "10px",
                  color: "#60a5fa",
                  marginTop: "4px",
                  fontWeight: 600,
                }}
              >
                {T.edited}
              </div>
            )}
        </div>
      </div>
    </Link>
  );
}

// ─── Game Picker ─────────────────────────────────────────────────────────────

const GAME_GRADIENT: Record<string, string> = {
  "forza-horizon-5": "linear-gradient(135deg,#1e3a5f,#0f2040,#0d0f1e)",
  "forza-horizon-6": "linear-gradient(135deg,#2a1f3a,#1a0f2a,#0d0f1e)",
  "the-crew-motorfest": "linear-gradient(135deg,#3a2a0f,#2a1a0a,#1a1208)",
  "nfs-unbound": "linear-gradient(135deg,#2a0f0f,#1a0808,#150a0a)",
};

function GamePicker({ onSelect }: { onSelect: (slug: string) => void }) {
  const { t } = useLanguage();
  const T = t.tunes;
  const [covers, setCovers] = useState<Record<string, string | null>>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/games")
      .then((r) => r.json())
      .then(
        (json: { games?: { slug: string; cover_url: string | null }[] }) => {
          if (cancelled) return;
          const map: Record<string, string | null> = {};
          for (const g of json.games ?? []) {
            map[g.slug] = g.cover_url ? `${STORAGE_BASE}/${g.cover_url}` : null;
          }
          setCovers(map);
        },
      )
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "48px 24px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: "28px",
            fontWeight: 900,
            color: "#f1f5f9",
          }}
        >
          {T.pickTitle}
        </h2>
        <p style={{ margin: 0, color: "#475569", fontSize: "15px" }}>
          {T.pickGameSub}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
          gap: "16px",
        }}
      >
        {GAME_OPTS.map((game) => {
          const cover = covers[game.slug] ?? null;
          const gradient =
            GAME_GRADIENT[game.slug] ??
            "linear-gradient(135deg,#1e293b,#0f172a)";
          return (
            <button
              key={game.slug}
              onClick={() => game.active && onSelect(game.slug)}
              style={{
                background: "#13151c",
                border: `1px solid ${game.active ? game.accent + "44" : "rgba(255,255,255,0.06)"}`,
                borderRadius: "14px",
                padding: 0,
                cursor: game.active ? "pointer" : "default",
                textAlign: "left",
                transition: "all 0.15s",
                opacity: game.active ? 1 : 0.5,
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (game.active)
                  (e.currentTarget as HTMLElement).style.borderColor =
                    game.accent + "99";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = game.active
                  ? game.accent + "44"
                  : "rgba(255,255,255,0.06)";
              }}
            >
              {/* Cover banner */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  background: gradient,
                  overflow: "hidden",
                }}
              >
                {cover && (
                  <Image
                    src={cover}
                    alt={game.name}
                    fill
                    sizes="(max-width: 600px) 100vw, 280px"
                    style={{ objectFit: "cover", opacity: 0.85 }}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(19,21,28,0.95) 0%, rgba(19,21,28,0.25) 55%, transparent 100%)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "12px",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    background: "rgba(13,15,20,0.7)",
                    color: game.accent,
                    border: `1px solid ${game.accent}44`,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {game.short}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: "16px 18px 18px" }}>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 800,
                    color: "#f1f5f9",
                    marginBottom: "6px",
                    lineHeight: 1.3,
                  }}
                >
                  {game.name}
                </div>

                {game.note && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#475569",
                      marginBottom: "8px",
                    }}
                  >
                    {game.note}
                  </div>
                )}

                {!game.active && (
                  <div
                    style={{
                      display: "inline-block",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: "rgba(250,204,21,0.1)",
                      color: "#facc15",
                      border: "1px solid rgba(250,204,21,0.2)",
                    }}
                  >
                    {T.comingSoon}
                  </div>
                )}
                {game.active && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: game.accent,
                      fontWeight: 600,
                    }}
                  >
                    {T.browseCta}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main inner component (needs useSearchParams) ────────────────────────────

function TunesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const T = t.tunes;
  const gameSlug = searchParams.get("game") ?? "";
  const urlSearch = searchParams.get("search") ?? "";

  const [tunes, setTunes] = useState<TuneRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [search, setSearch] = useState(urlSearch);
  const [discipline, setDiscipline] = useState("");
  const [piClass, setPiClass] = useState("");
  const [drivetrain, setDrivetrain] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const perPage = 20;
  const gameOpt = GAME_OPTS.find((g) => g.slug === gameSlug);

  // Sync search input with URL ?search= changes (e.g., from navbar)
  useEffect(() => {
    setSearchInput(urlSearch);
    setSearch(urlSearch);
  }, [urlSearch]);

  // When game changes, reset filters and page (but keep URL-provided search)
  useEffect(() => {
    setPage(1);
    setDiscipline("");
    setPiClass("");
    setDrivetrain("");
  }, [gameSlug]);

  const fetchTunes = useCallback(async () => {
    // Allow listing when EITHER a game is selected OR a search query is present
    if (!gameSlug && !search) return;
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(perPage),
      sortBy,
    });
    if (gameSlug) params.set("gameSlug", gameSlug);
    if (search) params.set("search", search);
    if (discipline) params.set("discipline", discipline);
    if (piClass) params.set("piClass", piClass);
    if (drivetrain) params.set("drivetrain", drivetrain);
    try {
      const res = await fetch(`/api/tunes?${params}`);
      const json = await res.json();
      setTunes(json.data ?? []);
      setTotal(json.total ?? 0);
    } catch {
      setTunes([]);
    } finally {
      setLoading(false);
    }
  }, [gameSlug, page, search, discipline, piClass, drivetrain, sortBy]);

  useEffect(() => {
    fetchTunes();
  }, [fetchTunes]);
  useEffect(() => {
    setPage(1);
  }, [search, discipline, piClass, drivetrain, sortBy]);

  const totalPages = Math.ceil(total / perPage);

  function resetFilters() {
    setSearch("");
    setSearchInput("");
    setDiscipline("");
    setPiClass("");
    setDrivetrain("");
  }

  function handleSelectGame(slug: string) {
    router.push(`/tunes?game=${slug}`);
  }

  // ── No game and no search → show game picker ─────────────────────────────
  if (!gameSlug && !search) {
    return (
      <div
        style={{
          background: "#0d0f14",
          minHeight: "100vh",
          color: "#e2e8f0",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "32px 24px 28px",
          }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <h1
              style={{
                margin: "0 0 6px",
                fontSize: "26px",
                fontWeight: 900,
                color: "#f1f5f9",
              }}
            >
              {T.title}
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#475569",
              }}
            >
              {T.pickSub}
            </p>
          </div>
        </div>
        <GamePicker onSelect={handleSelectGame} />
      </div>
    );
  }

  // ── Cross-game search results (no game selected, but has search) ──────────
  if (!gameSlug && search) {
    return (
      <div
        style={{
          background: "#0d0f14",
          minHeight: "100vh",
          color: "#e2e8f0",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "28px 24px 24px",
          }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => router.push("/tunes")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#475569",
                  cursor: "pointer",
                  fontSize: "13px",
                  padding: 0,
                }}
              >
                {T.backGames}
              </button>
              <span style={{ color: "#1e293b" }}>|</span>
              <h1
                style={{
                  margin: 0,
                  fontSize: "22px",
                  fontWeight: 900,
                  color: "#f1f5f9",
                }}
              >
                Search: <span style={{ color: "#facc15" }}>{search}</span>
              </h1>
              {!loading && (
                <span
                  style={{
                    fontSize: "13px",
                    color: "#334155",
                    fontWeight: 500,
                  }}
                >
                  {total.toLocaleString()} {T.results}
                </span>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "24px",
          }}
        >
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(searchInput);
                  router.push(
                    `/tunes?search=${encodeURIComponent(searchInput)}`,
                  );
                }
              }}
              placeholder={T.searchAll}
              style={{
                flex: 1,
                minWidth: "240px",
                padding: "10px 14px",
                background: "#13151c",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                color: "#f1f5f9",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: "#13151c",
                    borderRadius: "12px",
                    height: "78px",
                    opacity: 1 - i * 0.12,
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                />
              ))}
            </div>
          ) : tunes.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "72px 24px",
                background: "#13151c",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: "44px",
                  marginBottom: "14px",
                }}
              >
                🔍
              </div>
              <h3
                style={{
                  color: "#f1f5f9",
                  margin: "0 0 8px",
                  fontWeight: 700,
                }}
              >
                {T.noFound}
              </h3>
              <p
                style={{
                  color: "#475569",
                  margin: 0,
                  fontSize: "14px",
                }}
              >
                {T.noFoundTip}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {tunes.map((tune) => (
                <TuneCardRow key={tune.id} tune={tune} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "6px",
                marginTop: "32px",
              }}
            >
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: page > 1 ? "pointer" : "not-allowed",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: page > 1 ? "#94a3b8" : "#334155",
                  fontSize: "13px",
                }}
              >
                {T.prevPage}
              </button>
              <span
                style={{
                  padding: "8px 14px",
                  color: "#94a3b8",
                  fontSize: "13px",
                }}
              >
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: page < totalPages ? "pointer" : "not-allowed",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: page < totalPages ? "#94a3b8" : "#334155",
                  fontSize: "13px",
                }}
              >
                {T.nextPage}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Game selected → show tunes ──────────────────────────────────────────────
  return (
    <div
      style={{
        background: "#0d0f14",
        minHeight: "100vh",
        color: "#e2e8f0",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "28px 24px 24px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => router.push("/tunes")}
              style={{
                background: "none",
                border: "none",
                color: "#475569",
                cursor: "pointer",
                fontSize: "13px",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {T.backGames}
            </button>
            <span style={{ color: "#1e293b" }}>|</span>
            {/* Game badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.06em",
                padding: "4px 12px",
                borderRadius: "8px",
                background: (gameOpt?.accent ?? "#64748b") + "22",
                color: gameOpt?.accent ?? "#64748b",
                border: `1px solid ${gameOpt?.accent ?? "#64748b"}44`,
              }}
            >
              {gameOpt?.short ?? gameSlug.toUpperCase()}
            </span>
            <h1
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 900,
                color: "#f1f5f9",
              }}
            >
              {gameOpt?.name ?? gameSlug}
            </h1>
            {!loading && total > 0 && (
              <span
                style={{
                  fontSize: "13px",
                  color: "#334155",
                  fontWeight: 500,
                }}
              >
                {total.toLocaleString()} tunes
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "24px 24px",
        }}
      >
        {/* Search + sort */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1", minWidth: "240px" }}>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
              onBlur={() => setSearch(searchInput)}
              placeholder={T.searchTunes}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#13151c",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                color: "#f1f5f9",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {SORT_OPTIONS.map((s) => (
              <FilterChip
                key={s.id}
                label={s.label}
                active={sortBy === s.id}
                onClick={() => setSortBy(s.id)}
              />
            ))}
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            background: "#13151c",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px",
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {[
            {
              label: "STYLE",
              opts: DISCIPLINES,
              val: discipline,
              set: setDiscipline,
            },
            {
              label: "PI CLASS",
              opts: PI_CLASSES,
              val: piClass,
              set: setPiClass,
            },
            {
              label: "DRIVE",
              opts: DRIVETRAINS,
              val: drivetrain,
              set: setDrivetrain,
            },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "#334155",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  width: "64px",
                  flexShrink: 0,
                }}
              >
                {row.label}
              </span>
              {row.opts.map((o) => (
                <FilterChip
                  key={o.id}
                  label={o.label}
                  active={row.val === o.id}
                  onClick={() => row.set(o.id)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Share CTA */}
        <div
          style={{
            background: "linear-gradient(135deg,#0f2a1a,#0d0f14)",
            border: "1px solid rgba(74,222,128,0.15)",
            borderRadius: "12px",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: "13px", color: "#64748b" }}>
            <span style={{ fontWeight: 700, color: "#f1f5f9" }}>
              {T.shareCtaHighlight}{" "}
            </span>
            {T.shareCtaBody}
          </span>
          <Link
            href={`/tunes/new?game=${gameSlug}`}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              background: "#4ade80",
              color: "#0d0f14",
              fontWeight: 700,
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            {T.shareTune}
          </Link>
        </div>

        {/* Tune list */}
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "#13151c",
                  borderRadius: "12px",
                  height: "78px",
                  opacity: 1 - i * 0.1,
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              />
            ))}
          </div>
        ) : tunes.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "72px 24px",
              background: "#13151c",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ fontSize: "44px", marginBottom: "14px" }}>🏎️</div>
            <h3
              style={{
                color: "#f1f5f9",
                margin: "0 0 8px",
                fontWeight: 700,
              }}
            >
              {T.noFound}
            </h3>
            <p
              style={{
                color: "#475569",
                margin: "0 0 20px",
                fontSize: "14px",
              }}
            >
              {T.tryFilters}{" "}
              <button
                onClick={resetFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "#facc15",
                  cursor: "pointer",
                  fontSize: "14px",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                {T.resetAll}
              </button>
            </p>
            <Link
              href={`/tunes/new?game=${gameSlug}`}
              style={{
                padding: "10px 24px",
                borderRadius: "9px",
                background: "#4ade80",
                color: "#0d0f14",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              {T.beFirst}
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {tunes.map((tune, i) => (
              <Fragment key={tune.id}>
                <TuneCardRow tune={tune} />
                {(i + 1) % 8 === 0 && i < tunes.length - 1 && (
                  <AdUnit
                    slot="tune-list-infeed"
                    format="infeed"
                    style={{ margin: "4px 0" }}
                  />
                )}
              </Fragment>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "6px",
              marginTop: "32px",
              alignItems: "center",
            }}
          >
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: page > 1 ? "pointer" : "not-allowed",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: page > 1 ? "#94a3b8" : "#334155",
                fontSize: "13px",
              }}
            >
              {T.prevPage}
            </button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              const p =
                totalPages <= 7
                  ? i + 1
                  : page <= 4
                    ? i + 1
                    : page >= totalPages - 3
                      ? totalPages - 6 + i
                      : page - 3 + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background:
                      page === p ? "#facc15" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${page === p ? "#facc15" : "rgba(255,255,255,0.08)"}`,
                    color: page === p ? "#0d0f14" : "#94a3b8",
                    fontSize: "13px",
                    fontWeight: page === p ? 700 : 400,
                  }}
                >
                  {p}
                </button>
              );
            })}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: page < totalPages ? "pointer" : "not-allowed",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: page < totalPages ? "#94a3b8" : "#334155",
                fontSize: "13px",
              }}
            >
              {T.nextPage}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page export (Suspense required for useSearchParams) ─────────────────────

export default function TunesPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            background: "#0d0f14",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ color: "#475569", fontSize: "14px" }}>Loading...</div>
        </div>
      }
    >
      <TunesPageInner />
    </Suspense>
  );
}
