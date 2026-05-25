"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { timeAgo } from "@/lib/i18n/timeAgo";
import { AdUnit } from "@/components/ads/AdUnit";
import { SHARE_ENABLED } from "@/lib/share";

export interface LatestContentPost {
  id: string;
  title: string;
  created_at: string;
  source: "blog" | "guideline";
}

interface Props {
  latestPosts: LatestContentPost[];
}

export function HomeClient({ latestPosts }: Props) {
  const { t, locale } = useLanguage();
  const h = t.home;

  // Calculator-first landing (share-disabled mode). If share comes back online,
  // the legacy community homepage can be reintroduced here under SHARE_ENABLED.
  if (SHARE_ENABLED) {
    // Share-enabled mode: lightweight community placeholder. The full community
    // homepage was removed when share went into hibernation; rebuild it here
    // when re-enabling share.
    return (
      <div
        style={{
          background: "#0d0f14",
          minHeight: "100vh",
          color: "#e2e8f0",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#94a3b8" }}>{h.heroDesc}</p>
        <Link
          href="/tunes"
          style={{
            display: "inline-block",
            marginTop: "16px",
            padding: "10px 22px",
            borderRadius: "8px",
            background: "#facc15",
            color: "#0d0f14",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          {h.browseTunes}
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0d0f14",
        minHeight: "100vh",
        color: "#e2e8f0",
      }}
    >
      {/* HERO */}
      <section
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "96px 24px 56px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#facc15",
            background: "rgba(250,204,21,0.1)",
            border: "1px solid rgba(250,204,21,0.2)",
            padding: "4px 14px",
            borderRadius: "100px",
            marginBottom: "24px",
          }}
        >
          {h.landingBadge}
        </span>
        <h1
          style={{
            fontSize: "clamp(36px,5vw,60px)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-1px",
            margin: "0 0 20px",
            color: "#f1f5f9",
          }}
        >
          {h.landingHeroTitle}{" "}
          <span
            style={{
              background: "linear-gradient(135deg,#facc15,#fbbf24)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {h.landingHeroTitleAccent}
          </span>
        </h1>
        <p
          style={{
            fontSize: "17px",
            lineHeight: 1.7,
            color: "#94a3b8",
            maxWidth: "560px",
            margin: "0 auto 36px",
          }}
        >
          {h.landingHeroDesc}
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/calculator"
            style={{
              padding: "14px 32px",
              borderRadius: "9px",
              background: "#facc15",
              color: "#0d0f14",
              fontWeight: 800,
              fontSize: "16px",
              textDecoration: "none",
            }}
          >
            {h.landingCtaCalculate}
          </Link>
          <Link
            href="/guideline"
            style={{
              padding: "14px 28px",
              borderRadius: "9px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#cbd5e1",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            {h.landingCtaSecondary}
          </Link>
        </div>
      </section>

      {/* AD */}
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "0 24px 56px",
        }}
      >
        <AdUnit slot="homepage-hero-banner" format="horizontal" />
      </div>

      {/* HOW IT WORKS */}
      <section
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "0 24px 72px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#f1f5f9",
            margin: "0 0 28px",
            textAlign: "center",
          }}
        >
          {h.landingHowTitle}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            { title: h.landingHow1Title, desc: h.landingHow1Desc },
            { title: h.landingHow2Title, desc: h.landingHow2Desc },
            { title: h.landingHow3Title, desc: h.landingHow3Desc },
          ].map((step) => (
            <div
              key={step.title}
              style={{
                background: "#13151c",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                padding: "22px 20px",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#facc15",
                }}
              >
                {step.title}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "13.5px",
                  lineHeight: 1.6,
                  color: "#94a3b8",
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#f1f5f9",
            margin: "0 0 28px",
            textAlign: "center",
          }}
        >
          {h.landingFeaturesTitle}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "14px",
          }}
        >
          {[
            { title: h.landingFeatFree, desc: h.landingFeatFreeDesc },
            { title: h.landingFeatNoLogin, desc: h.landingFeatNoLoginDesc },
            { title: h.landingFeatFh6, desc: h.landingFeatFh6Desc },
            { title: h.landingFeatAllDriv, desc: h.landingFeatAllDrivDesc },
          ].map((feat) => (
            <div
              key={feat.title}
              style={{
                background: "rgba(250,204,21,0.04)",
                border: "1px solid rgba(250,204,21,0.15)",
                borderRadius: "10px",
                padding: "18px 18px",
              }}
            >
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#fbbf24",
                }}
              >
                {feat.title}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  lineHeight: 1.55,
                  color: "#94a3b8",
                }}
              >
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST TIPS — read-only blog/guideline mix */}
      {latestPosts.length > 0 && (
        <section
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
            padding: "0 24px 96px",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#f1f5f9",
              margin: "0 0 24px",
            }}
          >
            {h.landingTipsTitle}
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {latestPosts.map((post) => (
              <Link
                key={`${post.source}-${post.id}`}
                href={`/${post.source}/${post.id}`}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "14px 18px",
                  background: "#111318",
                  border: "1px solid #1e2130",
                  borderRadius: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: post.source === "blog" ? "#60a5fa" : "#4ade80",
                    background:
                      post.source === "blog"
                        ? "rgba(96,165,250,0.1)"
                        : "rgba(74,222,128,0.1)",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                  }}
                >
                  {post.source}
                </span>
                <span
                  style={{
                    flex: 1,
                    color: "#e2e8f0",
                    fontWeight: 600,
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {post.title}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#475569",
                    whiteSpace: "nowrap",
                  }}
                >
                  {timeAgo(post.created_at, locale)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
