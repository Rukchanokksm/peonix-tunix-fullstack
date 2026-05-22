"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { PREMIUM_ENABLED } from "@/lib/premium";
import { SearchDropdown } from "@/components/search/SearchDropdown";
import { LanguageSwitcher } from "./LanguageSwitcher";
import tunixLogo from "@/app/tunix_wall.png";
import type { UserProfile } from "@/types";

// ─── Games list ─────────────────────────────────────────────────────────────
const GAMES = [
  { name: "Forza Horizon 5", slug: "forza-horizon-5", active: true },
  { name: "Forza Horizon 6", slug: "forza-horizon-6", active: true },
  { name: "The Crew Motorfest", slug: "the-crew-motorfest", active: true },
  { name: "NFS Unbound", slug: "nfs-unbound", active: true },
];

// ─── Icons ──────────────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.15s",
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function UserCircleIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const gamesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // ── Auth state ──────────────────────────────────────────────────────────
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setUser(profile ?? null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Close dropdowns on outside click ───────────────────────────────────
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (gamesRef.current && !gamesRef.current.contains(e.target as Node))
        setGamesOpen(false);
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      )
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // ── Sign out ────────────────────────────────────────────────────────────
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.refresh();
  };

  return (
    <nav
      style={{
        background: "#0d0f14",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: "56px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 16px",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* ── LEFT: Logo + Nav ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              src={tunixLogo}
              alt="Tunix"
              height={36}
              style={{ width: "auto", display: "block" }}
              priority
            />
          </Link>

          {/* Nav links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Link href="/" style={navLinkStyle}>
              {t.nav.home}
            </Link>

            {/* Games dropdown */}
            <div ref={gamesRef} style={{ position: "relative" }}>
              <button
                onClick={() => setGamesOpen((o) => !o)}
                style={{
                  ...navLinkStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t.nav.games} <ChevronIcon open={gamesOpen} />
              </button>

              {gamesOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    background: "#161820",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    padding: "6px",
                    minWidth: "210px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}
                >
                  {GAMES.map((g) => (
                    <Link
                      key={g.slug}
                      href={g.active ? `/games/${g.slug}` : "#"}
                      onClick={() => setGamesOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        color: g.active ? "#e2e8f0" : "#64748b",
                        fontSize: "13.5px",
                        transition: "background 0.1s",
                        cursor: g.active ? "pointer" : "default",
                      }}
                      onMouseEnter={(e) => {
                        if (g.active)
                          (e.currentTarget as HTMLElement).style.background =
                            "rgba(255,255,255,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                      }}
                    >
                      {g.name}
                      {!g.active && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: "rgba(250,204,21,0.15)",
                            color: "#facc15",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {t.nav.soon}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/forums" style={navLinkStyle}>
              {t.nav.forums}
            </Link>

            <Link href="/guideline" style={navLinkStyle}>
              {t.nav.guideline}
            </Link>

            <Link href="/blog" style={navLinkStyle}>
              {t.nav.blog}
            </Link>
          </div>
        </div>

        {/* ── CENTER: Search ── */}
        <div style={{ position: "relative", width: "320px" }}>
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!searchOpen) setSearchOpen(true);
            }}
            onFocus={(e) => {
              setSearchOpen(true);
              (e.target as HTMLElement).style.borderColor =
                "rgba(250,204,21,0.5)";
            }}
            onBlur={(e) => {
              (e.target as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.1)";
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
        </div>

        {/* ── RIGHT: Lang switcher + Auth ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <LanguageSwitcher />
          {loading ? (
            <div
              style={{
                width: "80px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
              }}
            />
          ) : user ? (
            /* Logged-in user menu */
            <div ref={userMenuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  padding: "4px 10px 4px 6px",
                  cursor: "pointer",
                  color: "#e2e8f0",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.05)";
                }}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    width={28}
                    height={28}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ color: "#94a3b8" }}>
                    <UserCircleIcon />
                  </span>
                )}
                <span
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 500,
                  }}
                >
                  {user.username}
                </span>
                {PREMIUM_ENABLED && user.isPremium && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "1px 5px",
                      borderRadius: "4px",
                      background: "linear-gradient(135deg, #facc15, #eab308)",
                      color: "#000",
                      letterSpacing: "0.5px",
                    }}
                  >
                    PRO
                  </span>
                )}
                <ChevronIcon open={userMenuOpen} />
              </button>

              {userMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    background: "#161820",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    padding: "6px",
                    minWidth: "180px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}
                >
                  {[
                    {
                      label: t.nav.profile,
                      href: `/profile/${user.username}`,
                    },
                    {
                      label: t.nav.myTunes,
                      href: `/profile/${user.username}?tab=tunes`,
                    },
                    // Saved Tunes is a premium-gated feature — hide while premium is held
                    ...(PREMIUM_ENABLED
                      ? [
                          {
                            label: t.nav.savedTunes,
                            href: `/saved`,
                          },
                        ]
                      : []),
                    {
                      label: t.nav.settings,
                      href: "/settings",
                    },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setUserMenuOpen(false)}
                      style={dropdownItemStyle}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(255,255,255,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div
                    style={{
                      height: "1px",
                      background: "rgba(255,255,255,0.07)",
                      margin: "6px 0",
                    }}
                  />
                  <button
                    onClick={handleSignOut}
                    style={{
                      ...dropdownItemStyle,
                      width: "100%",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#f87171",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(248,113,113,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                    }}
                  >
                    {t.nav.signOut}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest buttons */
            <>
              <Link
                href="/login"
                style={{
                  padding: "6px 14px",
                  borderRadius: "7px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#cbd5e1",
                  textDecoration: "none",
                  fontSize: "13.5px",
                  fontWeight: 500,
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.3)";
                  el.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.15)";
                  el.style.color = "#cbd5e1";
                }}
              >
                {t.nav.signIn}
              </Link>
              <Link
                href="/register"
                style={{
                  padding: "6px 14px",
                  borderRadius: "7px",
                  background: "#facc15",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#b45309";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#facc15";
                }}
              >
                {t.nav.register}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── Style helpers ───────────────────────────────────────────────────────────
const navLinkStyle: React.CSSProperties = {
  color: "#94a3b8",
  textDecoration: "none",
  fontSize: "13.5px",
  fontWeight: 500,
  padding: "5px 10px",
  borderRadius: "6px",
  transition: "color 0.15s, background 0.15s",
  whiteSpace: "nowrap",
};

const dropdownItemStyle: React.CSSProperties = {
  display: "block",
  padding: "8px 12px",
  borderRadius: "6px",
  textDecoration: "none",
  color: "#cbd5e1",
  fontSize: "13.5px",
  transition: "background 0.1s",
};
