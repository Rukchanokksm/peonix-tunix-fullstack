import { createClient } from "@/lib/supabase/server";
import {
  HomeClient,
  type LatestContentPost,
  type GameCover,
} from "@/components/home/HomeClient";

const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/image-games`;

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: blogRows }, { data: guidelineRows }, { data: gameRows }] =
    await Promise.all([
      supabase
        .from("blog_posts")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("guideline_posts")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("games")
        .select("slug, cover_url")
        .in("slug", ["forza-horizon-5", "forza-horizon-6"]),
    ]);

  const coverBySlug = new Map(
    ((gameRows ?? []) as { slug: string; cover_url: string | null }[]).map(
      (g) => [g.slug, g.cover_url ? `${STORAGE_BASE}/${g.cover_url}` : null],
    ),
  );

  const gameCovers: Record<"fh5" | "fh6", GameCover> = {
    fh6: { url: coverBySlug.get("forza-horizon-6") ?? null },
    fh5: { url: coverBySlug.get("forza-horizon-5") ?? null },
  };

  const latestPosts: LatestContentPost[] = [
    ...(
      (blogRows ?? []) as { id: string; title: string; created_at: string }[]
    ).map((p) => ({ ...p, source: "blog" as const })),
    ...(
      (guidelineRows ?? []) as {
        id: string;
        title: string;
        created_at: string;
      }[]
    ).map((p) => ({ ...p, source: "guideline" as const })),
  ]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  return <HomeClient latestPosts={latestPosts} gameCovers={gameCovers} />;
}
