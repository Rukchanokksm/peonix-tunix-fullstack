"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SHARE_ENABLED } from "@/lib/share";

// ─── Social Icons ────────────────────────────────────────────────────────────
function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
function BugIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 2 1.88 1.88" />
      <path d="M14.12 3.88 16 2" />
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
      <path d="M12 20v-9" />
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
      <path d="M6 13H2" />
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
      <path d="M22 13h-4" />
      <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

const APP_VERSION = "0.1.0";

// ─── Game data (labels don't translate — game names are proper nouns) ────────
const GAME_LINKS = [
  { label: "Forza Horizon 5", href: "/games/forza-horizon-5" },
  { label: "Forza Horizon 6", href: "/games/forza-horizon-6" },
  { label: "The Crew Motorfest", href: "/games/the-crew-motorfest" },
  { label: "NFS Unbound", href: "/games/nfs-unbound" },
];

// ─── Component ───────────────────────────────────────────────────────────────
export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const PLATFORM_LINKS = SHARE_ENABLED
    ? [
        { label: t.footer.browseTunes, href: "/tunes" },
        { label: t.footer.tuneCalculator, href: "/calculator" },
        { label: t.footer.forums, href: "/forums" },
        { label: t.footer.uploadTune, href: "/tunes/new" },
      ]
    : [
        { label: t.footer.tuneCalculator, href: "/calculator" },
        { label: "Blog", href: "/blog" },
        { label: "Guideline", href: "/guideline" },
      ];

  return (
    <footer
      style={{
        background: "#0d0f14",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        color: "#94a3b8",
      }}
    >
      {/* Main grid */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "48px 24px 40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "40px",
        }}
      >
        {/* Col 1 — Brand */}
        <div>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                background: "linear-gradient(135deg, #facc15, #eab308)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
                fontSize: "17px",
                letterSpacing: "-0.3px",
              }}
            >
              Tunix
            </span>
          </Link>
          <p
            style={{
              marginTop: "12px",
              fontSize: "13px",
              lineHeight: "1.65",
              color: "#64748b",
              maxWidth: "220px",
            }}
          >
            {t.footer.tagline}
          </p>
          {/* Social icons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            {[
              {
                icon: <DiscordIcon />,
                href: "#",
                label: "Discord",
              },
              {
                icon: <FacebookIcon />,
                href: "#",
                label: "Facebook",
              },
              {
                icon: <GithubIcon />,
                href: "#",
                label: "GitHub",
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#64748b",
                  textDecoration: "none",
                  transition:
                    "color 0.15s, background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "#e2e8f0";
                  el.style.background = "rgba(255,255,255,0.08)";
                  el.style.borderColor = "rgba(255,255,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "#64748b";
                  el.style.background = "rgba(255,255,255,0.05)";
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 — Platform */}
        <div>
          <h4 style={colHeadingStyle}>{t.footer.platformTitle}</h4>
          <ul style={ulStyle}>
            {PLATFORM_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  style={footerLinkStyle}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#64748b";
                  }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Games */}
        {SHARE_ENABLED && (
          <div>
            <h4 style={colHeadingStyle}>{t.footer.gamesTitle}</h4>
            <ul style={ulStyle}>
              {GAME_LINKS.map((l) => (
                <li
                  key={l.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Link
                    href={l.href}
                    style={{
                      ...footerLinkStyle,
                      color: "#64748b",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#64748b";
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Col 4 — Contact */}
        <div>
          <h4 style={colHeadingStyle}>{t.footer.contactTitle}</h4>
          <ul style={ulStyle}>
            <li>
              <a
                href="mailto:peonic07@gmail.com"
                style={{
                  ...footerLinkStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#64748b";
                }}
              >
                <MailIcon /> peonic07@gmail.com
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...footerLinkStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#64748b";
                }}
              >
                <DiscordIcon /> {t.footer.discord}
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...footerLinkStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#64748b";
                }}
              >
                <FacebookIcon /> {t.footer.facebook}
              </a>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...footerLinkStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  color: "#f87171",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#fca5a5";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#f87171";
                }}
              >
                <BugIcon /> {t.footer.reportBug}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "12px", color: "#475569" }}>
            © {year} Tunix — {t.footer.copyright}
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 7px",
              borderRadius: "5px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#475569",
              letterSpacing: "0.02em",
              fontFamily: "monospace",
            }}
          >
            v{APP_VERSION}
          </span>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          {[
            { label: t.footer.privacy, href: "/privacy" },
            { label: t.footer.terms, href: "/terms" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: "12px",
                color: "#475569",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#94a3b8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#475569";
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Style helpers ────────────────────────────────────────────────────────────
const colHeadingStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#475569",
  marginBottom: "14px",
};
const ulStyle: React.CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
const footerLinkStyle: React.CSSProperties = {
  fontSize: "13.5px",
  color: "#64748b",
  textDecoration: "none",
  transition: "color 0.15s",
};
