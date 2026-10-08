"use client";

import { useEffect, useState } from "react";
import { type Post } from "./mocks/posts";
import { useRouter } from "next/navigation";
import { fetchPosts, toggleLike } from "./lib/posts";
import PostCard from "./components/PostCard";

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts({ orderBy: "created_at" }).then(setPosts);
  }, []);

  const handleLike = async (postId: number | string) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;

    const toggle = (list: Post[]) =>
      list.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      );

    // Actualiza la pantalla al instante y revierte si falla en la base de datos
    setPosts(toggle);
    const result = await toggleLike(postId, target.isLiked);
    if (!result.ok) {
      setPosts(toggle);
      if (result.needsLogin) router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card-bg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Supagram
          </h1>
        </div>
      </header>

      {/* Feed de posts */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))}
        </div>
      </main>
    </div>
  );
}