"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SHARE_ENABLED } from "@/lib/share";

type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  comment_count: number;
  created_at: string;
  user: { username: string } | null;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d < 1) return "Today";
  if (d < 30) return `${d}d ago`;
  const m = Math.floor(d / 30);
  if (m < 12) return `${m}mo ago`;
  return `${Math.floor(m / 12)}y ago`;
}

export function GuidelineListClient({
  posts,
  isAdmin,
}: {
  posts: Post[];
  isAdmin: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "48px 24px 80px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "36px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#facc15",
              marginBottom: "8px",
            }}
          >
            {t.guideline.badge}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 800,
              color: "#f1f5f9",
            }}
          >
            {t.guideline.title}
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            {t.guideline.subtitle}
          </p>
        </div>
        {isAdmin && SHARE_ENABLED && (
          <Link
            href="/guideline/new"
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              background: "#facc15",
              color: "#000",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            + {t.guideline.newPost}
          </Link>
        )}
      </div>

      {/* Grid */}
      {posts.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#374151",
            fontSize: "14px",
            padding: "80px 0",
          }}
        >
          {t.guideline.empty}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/guideline/${post.id}`}
              style={{ textDecoration: "none" }}
            >
              <article
                style={{
                  background: "#111318",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "border-color 0.15s, transform 0.15s",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(250,204,21,0.3)";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.06)";
                  el.style.transform = "translateY(0)";
                }}
              >
                {/* Cover */}
                {post.cover_url ? (
                  <div
                    style={{
                      height: "180px",
                      overflow: "hidden",
                      background: "#0d0f14",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover_url}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      height: "4px",
                      background:
                        "linear-gradient(90deg, #facc15 0%, #f59e0b 100%)",
                    }}
                  />
                )}

                {/* Content */}
                <div
                  style={{
                    padding: "20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#facc15",
                      marginBottom: "8px",
                    }}
                  >
                    {t.guideline.badge}
                  </div>
                  <h2
                    style={{
                      margin: "0 0 8px",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#f1f5f9",
                      lineHeight: 1.4,
                    }}
                  >
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p
                      style={{
                        margin: "0 0 16px",
                        color: "#64748b",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        flex: 1,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {post.excerpt}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "auto",
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <span
                      style={{
                        color: "#475569",
                        fontSize: "12px",
                      }}
                    >
                      {post.user?.username ?? "—"} · {timeAgo(post.created_at)}
                    </span>
                    <span
                      style={{
                        color: "#374151",
                        fontSize: "12px",
                      }}
                    >
                      {post.comment_count} {t.guideline.comments}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
