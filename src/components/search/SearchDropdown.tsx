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
