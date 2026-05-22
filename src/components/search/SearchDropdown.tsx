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
  const [activeIdx, setActiveIdx] = useState(0);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch when debounced query changes
  useEffect(() => {
    if (debounced.length < 2) {
      setData(EMPTY);
      setLoading(false);
      setActiveIdx(0);
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
        setActiveIdx(0);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          console.warn("[search] fetch failed", e);
          setData(EMPTY);
          setLoading(false);
          setActiveIdx(0);
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

  // Keyboard navigation (Esc/Arrow/Enter) while open
  useEffect(() => {
    if (!open) return;
    const navigate = (href: string) => {
      onClose();
      router.push(href);
    };
    const items: Array<() => void> = [
      ...data.tunes.map((tune) => () => navigate(`/tunes/${tune.id}`)),
      ...data.users.map((u) => () => navigate(`/profile/${u.username}`)),
      ...data.cars.map(
        (c) => () =>
          navigate(
            `/games/${c.game?.slug ?? ""}/${encodeURIComponent(c.make)}/${c.id}`,
          ),
      ),
    ];
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (items.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % items.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + items.length) % items.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        items[activeIdx]?.();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, data, activeIdx, onClose, router]);

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
          )}

          {data.users.length > 0 && (
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
          )}

          {data.cars.length > 0 && (
            <Section title={T.groupCars}>
              {data.cars.map((c, i) => (
                <Row
                  key={c.id}
                  active={
                    activeIdx === data.tunes.length + data.users.length + i
                  }
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
