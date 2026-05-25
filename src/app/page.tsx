import { createClient } from "@/lib/supabase/server";
import {
  HomeClient,
  type LatestContentPost,
} from "@/components/home/HomeClient";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: blogRows }, { data: guidelineRows }] = await Promise.all([
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
  ]);

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

  return <HomeClient latestPosts={latestPosts} />;
}
