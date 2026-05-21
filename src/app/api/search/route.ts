import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

async function safe<T>(label: string, fn: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fn();
  } catch (e) {
    console.error(`[search] ${label} query failed:`, e);
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = (searchParams.get("q") ?? "").trim();
  const limit = Math.min(
    20,
    Math.max(1, Number(searchParams.get("limit") ?? "5")),
  );

  if (q.length < 2) return NextResponse.json(EMPTY);

  const supabase = await createClient();
  const pattern = `%${q}%`;

  // Resolve cars + users in parallel
  const [cars, users] = await Promise.all([
    safe<CarResult>("cars", async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("id, make, model, year, pi_class, game:games(slug)")
        .or(`make.ilike.${pattern},model.ilike.${pattern}`)
        .order("make", { ascending: true })
        .order("model", { ascending: true })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as unknown as CarResult[];
    }),
    safe<UserResult>("users", async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, username, avatar_url")
        .or(`username.ilike.${pattern},bio.ilike.${pattern}`)
        .order("username", { ascending: true })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as UserResult[];
    }),
  ]);

  // Tunes: text match OR car_id IN (matched cars)
  const carIds = cars.map((c) => c.id);
  const carFilter = carIds.length ? `,car_id.in.(${carIds.join(",")})` : "";

  const tunes = await safe<TuneResult>("tunes", async () => {
    const { data, error } = await supabase
      .from("tunes")
      .select(
        `id, title, discipline, upvotes,
         car:cars(make, model, pi_class),
         game:games(name, slug)`,
      )
      .or(`title.ilike.${pattern},description.ilike.${pattern}${carFilter}`)
      .order("upvotes", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as TuneResult[];
  });

  return NextResponse.json({ tunes, users, cars });
}
