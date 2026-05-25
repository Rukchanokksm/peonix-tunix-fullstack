// ─── Share / community feature flag ──────────────────────────────────────────
//
// Share & community features (tune publishing, forum, profiles, saved, search)
// are currently DISABLED while we focus the site on the Forza Horizon
// auto-tune calculator. Re-enable once user base & ad revenue justify the
// community surface area.
//
// To disable share features site-wide:
//   1. Set env var: NEXT_PUBLIC_SHARE_ENABLED=false
//   2. Redeploy
//
// Default = enabled (true) so local dev keeps working without env config.
//
// While disabled:
//   - Share routes (/tunes, /saved, /profile, /forums, /games) redirect to /
//   - /blog/new and /guideline/new redirect to / (read-only mode)
//   - Share API routes return 404
//   - Navbar/Footer/Home hide share links & widgets
//   - Blog/Guideline pages hide comment forms, upvote, "New post" buttons
//   - DB tables & auth flow untouched — re-enabling is one env var change.

export const SHARE_ENABLED = process.env.NEXT_PUBLIC_SHARE_ENABLED !== "false";

// Top-level routes that redirect to "/" when share is disabled.
export const SHARE_ROUTE_PREFIXES = [
  "/tunes",
  "/saved",
  "/profile",
  "/forums",
  "/games",
] as const;

// Sub-routes that redirect even though their parent stays accessible.
export const SHARE_SUBROUTE_PREFIXES = ["/blog/new", "/guideline/new"] as const;

// API prefixes that return 404 when share is disabled.
export const SHARE_API_PREFIXES = [
  "/api/tunes",
  "/api/saves",
  "/api/forum",
  "/api/search",
] as const;

// Exact API routes that only block mutations (POST/PATCH/PUT/DELETE).
export const SHARE_API_MUTATION_ROUTES = [
  "/api/blog/posts",
  "/api/blog/comments",
  "/api/guideline/posts",
  "/api/guideline/comments",
] as const;

export function isShareRoute(pathname: string): boolean {
  return (
    SHARE_ROUTE_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    ) ||
    SHARE_SUBROUTE_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    )
  );
}

export function isShareApi(pathname: string): boolean {
  return SHARE_API_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function isShareMutationApi(pathname: string): boolean {
  return SHARE_API_MUTATION_ROUTES.some((p) => pathname === p);
}
