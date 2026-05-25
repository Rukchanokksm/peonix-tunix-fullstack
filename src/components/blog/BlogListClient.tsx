"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { BLOG_TAGS, getBlogTag } from "@/lib/blogTags";
import { SHARE_ENABLED } from "@/lib/share";

type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  tags: string[];
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

export function BlogListClient({
  posts,
  isAdmin,
}: {
  posts: Post[];
  isAdmin: boolean;
}) {
  const { t } = useLanguage();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const visible = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts;

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
              color: "#60a5fa",
              marginBottom: "8px",
            }}
          >
            {t.blog.badge}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 800,
              color: "#f1f5f9",
            }}
          >
            {t.blog.title}
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            {t.blog.subtitle}
          </p>
        </div>
        {isAdmin && SHARE_ENABLED && (
          <Link
            href="/blog/new"
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              background: "#60a5fa",
              color: "#000",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            + {t.blog.newPost}
          </Link>
        )}
      </div>

      {/* Tag filter bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "28px",
        }}
      >
        <button
          onClick={() => setActiveTag(null)}
          style={{
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            border: `1px solid ${activeTag === null ? "#60a5fa" : "rgba(255,255,255,0.1)"}`,
            background:
              activeTag === null ? "rgba(96,165,250,0.15)" : "transparent",
            color: activeTag === null ? "#60a5fa" : "#64748b",
            transition: "all 0.15s",
          }}
        >
          {t.blog.filterAll}
        </button>
        {BLOG_TAGS.map((tag) => (
          <button
            key={tag.id}
            onClick={() => setActiveTag(activeTag === tag.id ? null : tag.id)}
            style={{
              padding: "5px 14px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              border: `1px solid ${activeTag === tag.id ? tag.color : "rgba(255,255,255,0.1)"}`,
              background:
                activeTag === tag.id ? tag.color + "22" : "transparent",
              color: activeTag === tag.id ? tag.color : "#64748b",
              transition: "all 0.15s",
            }}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Featured first post */}
      {visible.length > 0 && visible[0].cover_url && (
        <Link
          href={`/blog/${visible[0].id}`}
          style={{ textDecoration: "none" }}
        >
          <article
            style={{
              background: "#111318",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              overflow: "hidden",
              marginBottom: "28px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              transition: "border-color 0.15s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(96,165,250,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.06)";
            }}
          >
            <div
              style={{
                height: "280px",
                overflow: "hidden",
                background: "#0d0f14",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={visible[0].cover_url}
                alt={visible[0].title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#60a5fa",
                  marginBottom: "12px",
                }}
              >
                {t.blog.featured}
              </div>
              <h2
                style={{
                  margin: "0 0 12px",
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#f1f5f9",
                  lineHeight: 1.3,
                }}
              >
                {visible[0].title}
              </h2>
              {visible[0].excerpt && (
                <p
                  style={{
                    margin: "0 0 12px",
                    color: "#64748b",
                    fontSize: "13.5px",
                    lineHeight: 1.7,
                  }}
                >
                  {visible[0].excerpt}
                </p>
              )}
              {visible[0].tags?.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginBottom: "16px",
                  }}
                >
                  {visible[0].tags.map((id) => {
                    const tag = getBlogTag(id);
                    if (!tag) return null;
                    return (
                      <span
                        key={id}
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "2px 9px",
                          borderRadius: "12px",
                          background: tag.color + "22",
                          color: tag.color,
                          border: `1px solid ${tag.color}44`,
                        }}
                      >
                        {tag.label}
                      </span>
                    );
                  })}
                </div>
              )}
              <div style={{ color: "#475569", fontSize: "12px" }}>
                {visible[0].user?.username ?? "—"} ·{" "}
                {timeAgo(visible[0].created_at)}
              </div>
            </div>
          </article>
        </Link>
      )}

      {/* Grid */}
      {visible.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#374151",
            fontSize: "14px",
            padding: "80px 0",
          }}
        >
          {t.blog.empty}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {(visible[0]?.cover_url ? visible.slice(1) : visible).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
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
                  el.style.borderColor = "rgba(96,165,250,0.3)";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.06)";
                  el.style.transform = "translateY(0)";
                }}
              >
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
                        "linear-gradient(90deg, #60a5fa 0%, #818cf8 100%)",
                    }}
                  />
                )}
                <div
                  style={{
                    padding: "20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {post.tags?.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "5px",
                        marginBottom: "8px",
                      }}
                    >
                      {post.tags.map((id) => {
                        const tag = getBlogTag(id);
                        if (!tag) return null;
                        return (
                          <span
                            key={id}
                            style={{
                              fontSize: "10px",
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: "10px",
                              background: tag.color + "22",
                              color: tag.color,
                              border: `1px solid ${tag.color}44`,
                            }}
                          >
                            {tag.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
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
                    <span style={{ color: "#475569", fontSize: "12px" }}>
                      {post.user?.username ?? "—"} · {timeAgo(post.created_at)}
                    </span>
                    <span style={{ color: "#374151", fontSize: "12px" }}>
                      {post.comment_count} {t.blog.comments}
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
