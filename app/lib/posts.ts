import { supabase } from "./supabase";
import { DEFAULT_AVATAR } from "./defaults";
import type { Post } from "../mocks/posts";

type PostRow = {
  id: number;
  user_id: string;
  image_url: string;
  caption: string | null;
  likes: number;
  created_at: string;
  updated_at: string | null;
  profiles: { username: string | null; avatar_url: string | null } | null;
};

/** Trae posts con el perfil del autor y si el usuario actual les dio like. */
export async function fetchPosts(opts: {
  orderBy: "created_at" | "likes";
  limit?: number;
}): Promise<Post[]> {
  let query = supabase
    .from("posts")
    .select(
      "id, user_id, image_url, caption, likes, created_at, updated_at, profiles(username, avatar_url)"
    )
    .order(opts.orderBy, { ascending: false });

  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) {
    console.error("Error cargando posts:", error);
    return [];
  }

  const rows = (data ?? []) as unknown as PostRow[];

  // IDs de posts a los que el usuario actual ya dio like
  const likedIds = new Set<number>();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && rows.length > 0) {
    const { data: liked } = await supabase
      .from("post_likes")
      .select("post_id")
      .in(
        "post_id",
        rows.map((r) => r.id)
      );
    liked?.forEach((l) => likedIds.add(l.post_id as number));
  }

  return rows.map((r) => ({
    id: r.id,
    user: {
      username: r.profiles?.username || "usuario",
      avatar: r.profiles?.avatar_url || DEFAULT_AVATAR,
    },
    image_url: r.image_url,
    caption: r.caption ?? "",
    likes: r.likes,
    isLiked: likedIds.has(r.id),
    created_at: new Date(r.created_at),
    updated_at: r.updated_at ? new Date(r.updated_at) : undefined,
  }));
}

/** Da o quita like en la base de datos. */
export async function toggleLike(
  postId: number | string,
  currentlyLiked: boolean
): Promise<{ ok: boolean; needsLogin?: boolean }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, needsLogin: true };

  const { error } = currentlyLiked
    ? await supabase
        .from("post_likes")
        .delete()
        .match({ post_id: postId, user_id: user.id })
    : await supabase
        .from("post_likes")
        .insert({ post_id: postId, user_id: user.id });

  if (error) console.error("Error en like:", error);
  return { ok: !error };
}
