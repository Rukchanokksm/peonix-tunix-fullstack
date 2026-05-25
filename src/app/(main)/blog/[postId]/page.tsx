"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArticleBody,
  parseBlocks,
  extractSections,
} from "@/components/content/ArticleBody";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getBlogTag } from "@/lib/blogTags";
import { SHARE_ENABLED } from "@/lib/share";

type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  tags: string[];
  body: string;
  comment_count: number;
  created_at: string;
  updated_at: string;
  user: { id: string; username: string } | null;
};
type Comment = {
  id: string;
  body: string;
  created_at: string;
  user: { id: string; username: string } | null;
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

const TA: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  background: "#0d0f14",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#e2e8f0",
  fontSize: "13px",
  outline: "none",
  resize: "vertical",
  fontFamily: "inherit",
  boxSizing: "border-box",
  lineHeight: 1.7,
};

export default function BlogPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const router = useRouter();
  const { t } = useLanguage();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [me, setMe] = useState<{ id: string; role?: string } | null>(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPost, setEditingPost] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editBody, setEditBody] = useState("");
  const [savingPost, setSavingPost] = useState(false);

  const fetchPost = useCallback(async () => {
    const res = await fetch(`/api/blog/posts/${postId}`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    setPost(await res.json());
    setLoading(false);
  }, [postId]);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/blog/comments?postId=${postId}`);
    if (res.ok) setComments((await res.json()).data ?? []);
  }, [postId]);

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setMe(d?.user ?? null))
      .catch(() => {});
  }, [fetchPost, fetchComments]);

  const isAdmin = me?.role === "admin";

  function enterEdit() {
    if (!post) return;
    setEditTitle(post.title);
    setEditExcerpt(post.excerpt ?? "");
    setEditBody(post.body);
    setEditingPost(true);
  }

  async function savePost() {
    if (!post) return;
    setSavingPost(true);
    try {
      const res = await fetch(`/api/blog/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          excerpt: editExcerpt || null,
          body: editBody,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.blog.errGeneric);
        return;
      }
      setPost(data);
      setEditingPost(false);
    } finally {
      setSavingPost(false);
    }
  }

  async function deletePost() {
    if (!confirm(t.blog.confirmDelete)) return;
    const res = await fetch(`/api/blog/posts/${postId}`, { method: "DELETE" });
    if (res.ok) router.push("/blog");
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, body: newComment.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.blog.errGeneric);
        return;
      }
      setNewComment("");
      await fetchComments();
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteComment(id: string) {
    await fetch(`/api/blog/comments?id=${id}`, { method: "DELETE" });
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading) {
    return (
      <div
        style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}
      >
        <div
          style={{
            height: "32px",
            width: "60%",
            borderRadius: "6px",
            background: "#1e2130",
            marginBottom: "20px",
          }}
        />
        {[100, 90, 95, 70, 85].map((w, i) => (
          <div
            key={i}
            style={{
              height: "14px",
              borderRadius: "4px",
              background: "#161820",
              marginBottom: "12px",
              width: `${w}%`,
            }}
          />
        ))}
      </div>
    );
  }

  if (!post) {
    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
          color: "#374151",
        }}
      >
        {t.blog.notFound}
        <br />
        <Link
          href="/blog"
          style={{ color: "#60a5fa", fontSize: "13px", textDecoration: "none" }}
        >
          ← {t.blog.backList}
        </Link>
      </div>
    );
  }

  const blocks = parseBlocks(post.body);
  const sections = extractSections(blocks);

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "40px 24px 80px",
        color: "#e2e8f0",
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{ color: "#475569", fontSize: "13px", textDecoration: "none" }}
        >
          {t.blog.breadHome}
        </Link>
        <span style={{ color: "#334155" }}>›</span>
        <Link
          href="/blog"
          style={{ color: "#475569", fontSize: "13px", textDecoration: "none" }}
        >
          {t.blog.title}
        </Link>
        <span style={{ color: "#334155" }}>›</span>
        <span
          style={{
            color: "#64748b",
            fontSize: "13px",
            maxWidth: "300px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {post.title}
        </span>
      </div>

      {/* Main layout: TOC + Article */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: sections.length > 0 ? "220px 1fr" : "1fr",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* TOC */}
        {sections.length > 0 && (
          <aside
            style={{
              position: "sticky",
              top: "72px",
              background: "#111318",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#64748b",
                marginBottom: "12px",
              }}
            >
              {t.blog.tocTitle}
            </div>
            <nav
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {sections.map((s, i) => (
                <a
                  key={i}
                  href={`#section-${i + 1}`}
                  style={{
                    display: "block",
                    color: "#94a3b8",
                    fontSize: "12.5px",
                    textDecoration: "none",
                    padding: "5px 8px",
                    borderRadius: "5px",
                    lineHeight: 1.4,
                    transition: "color 0.1s, background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "#60a5fa";
                    el.style.background = "rgba(96,165,250,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "#94a3b8";
                    el.style.background = "transparent";
                  }}
                >
                  <span style={{ color: "#475569", marginRight: "6px" }}>
                    {i + 1}.
                  </span>
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>
        )}

        <div>
          <article
            style={{
              background: "#111318",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "24px",
            }}
          >
            {/* Cover */}
            {post.cover_url && !editingPost && (
              <div
                style={{
                  height: "320px",
                  overflow: "hidden",
                  background: "#0d0f14",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover_url}
                  alt={post.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            <div style={{ padding: "28px 32px" }}>
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
                {t.blog.badge}
              </div>

              {editingPost ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder={t.blog.titlePlaceholder}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "#0d0f14",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#f1f5f9",
                      fontSize: "18px",
                      fontWeight: 700,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <input
                    value={editExcerpt}
                    onChange={(e) => setEditExcerpt(e.target.value)}
                    placeholder={t.blog.excerptPlaceholder}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "#0d0f14",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#cbd5e1",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <div style={{ fontSize: "11px", color: "#475569" }}>
                    {t.blog.editBodyHint}
                  </div>
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={16}
                    style={TA}
                    placeholder={t.blog.bodyJsonPlaceholder}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => setEditingPost(false)}
                      style={{
                        padding: "7px 16px",
                        borderRadius: "7px",
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#64748b",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      {t.blog.cancel}
                    </button>
                    <button
                      onClick={savePost}
                      disabled={savingPost || !editTitle.trim()}
                      style={{
                        padding: "7px 18px",
                        borderRadius: "7px",
                        background: "#60a5fa",
                        color: "#000",
                        fontSize: "13px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        opacity: savingPost || !editTitle.trim() ? 0.5 : 1,
                      }}
                    >
                      {savingPost ? t.blog.saving : t.blog.save}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1
                    style={{
                      margin: "0 0 12px",
                      fontSize: "24px",
                      fontWeight: 800,
                      color: "#f1f5f9",
                      lineHeight: 1.3,
                    }}
                  >
                    {post.title}
                  </h1>
                  {post.excerpt && (
                    <p
                      style={{
                        margin: "0 0 16px",
                        color: "#64748b",
                        fontSize: "14px",
                        lineHeight: 1.7,
                      }}
                    >
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags?.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginBottom: "16px",
                      }}
                    >
                      {post.tags.map((id) => {
                        const tag = getBlogTag(id);
                        if (!tag) return null;
                        return (
                          <span
                            key={id}
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              padding: "3px 10px",
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
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      marginBottom: "28px",
                      flexWrap: "wrap",
                      paddingBottom: "20px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {post.user && (
                      <Link
                        href={`/profile/${post.user.username}`}
                        style={{
                          color: "#475569",
                          fontSize: "13px",
                          textDecoration: "none",
                        }}
                      >
                        @{post.user.username}
                      </Link>
                    )}
                    <span style={{ color: "#1e2130" }}>·</span>
                    <span style={{ color: "#374151", fontSize: "12px" }}>
                      {timeAgo(post.created_at)}
                    </span>
                    {sections.length > 0 && (
                      <>
                        <span style={{ color: "#1e2130" }}>·</span>
                        <span style={{ color: "#374151", fontSize: "12px" }}>
                          {sections.length} {t.blog.sections}
                        </span>
                      </>
                    )}
                  </div>
                  <ArticleBody raw={post.body} />
                </>
              )}
            </div>

            {isAdmin && !editingPost && (
              <div
                style={{
                  padding: "12px 32px",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <button
                  onClick={enterEdit}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#94a3b8",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {t.blog.editPost}
                </button>
                <button
                  onClick={deletePost}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    background: "transparent",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#ef4444",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {t.blog.deletePost}
                </button>
              </div>
            )}
          </article>

          {/* Comments */}
          {SHARE_ENABLED && (
            <div
              style={{
                background: "#111318",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "14px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {t.blog.commentsTitle} ({comments.length})
                </span>
              </div>

              {comments.length === 0 ? (
                <div
                  style={{
                    padding: "32px 24px",
                    color: "#374151",
                    fontSize: "13px",
                    textAlign: "center",
                  }}
                >
                  {t.blog.noComments}
                </div>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: "16px 24px",
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      {c.user ? (
                        <Link
                          href={`/profile/${c.user.username}`}
                          style={{
                            color: "#64748b",
                            fontSize: "13px",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          @{c.user.username}
                        </Link>
                      ) : (
                        <span style={{ color: "#64748b", fontSize: "13px" }}>
                          —
                        </span>
                      )}
                      <span style={{ color: "#374151", fontSize: "11px" }}>
                        {timeAgo(c.created_at)}
                      </span>
                      {me && c.user?.id === me.id && (
                        <button
                          onClick={() => deleteComment(c.id)}
                          style={{
                            marginLeft: "auto",
                            background: "transparent",
                            border: "1px solid rgba(239,68,68,0.3)",
                            color: "#ef4444",
                            fontSize: "11px",
                            cursor: "pointer",
                            padding: "2px 10px",
                            borderRadius: "5px",
                          }}
                        >
                          {t.blog.deleteComment}
                        </button>
                      )}
                    </div>
                    <div
                      style={{
                        color: "#cbd5e1",
                        fontSize: "14px",
                        lineHeight: "1.65",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {c.body}
                    </div>
                  </div>
                ))
              )}

              {me ? (
                <form
                  onSubmit={submitComment}
                  style={{
                    padding: "16px 24px",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t.blog.commentPlaceholder}
                    rows={3}
                    style={{ flex: 1, ...TA }}
                  />
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "7px",
                      background: "#60a5fa",
                      color: "#000",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: "none",
                      alignSelf: "flex-end",
                      opacity: submitting || !newComment.trim() ? 0.5 : 1,
                    }}
                  >
                    {submitting ? t.blog.posting : t.blog.postComment}
                  </button>
                </form>
              ) : (
                <div
                  style={{
                    padding: "16px 24px",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    color: "#475569",
                    fontSize: "13px",
                    textAlign: "center",
                  }}
                >
                  <Link
                    href="/login"
                    style={{ color: "#60a5fa", textDecoration: "none" }}
                  >
                    {t.blog.signInToComment}
                  </Link>
                </div>
              )}

              {error && (
                <div
                  style={{
                    padding: "8px 24px",
                    color: "#f87171",
                    fontSize: "13px",
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
