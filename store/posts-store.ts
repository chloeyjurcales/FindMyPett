import { useSyncExternalStore } from "react";
import { supabase } from "../lib/supabase";
import { notifyPostOwner } from "./notifications-store";

export type ReportKind = "Lost Pet" | "Found Pet";

export type Comment = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  text: string;
  createdAt: number;
};

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  kind: ReportKind;
  petName: string;
  petType: string;
  breed: string;
  sex: string;
  colorDescription: string;
  description: string;
  location: string;
  claimLocation: string | null;
  photos: string[];
  createdAt: number;
  likes: number;
  liked: boolean;
  comments: Comment[];
};

// ---- In-memory cache (module-level so every screen shares it) ----
// This mirrors what's in the pet_posts / post_likes / post_comments tables
// in Supabase. loadPosts() below is what keeps it in sync.

let posts: Post[] = [];

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ---- Posts ----

function getPostsSnapshot() {
  return posts;
}

export function usePosts() {
  return useSyncExternalStore(subscribe, getPostsSnapshot, getPostsSnapshot);
}

export function usePostById(postId: string | undefined): Post | undefined {
  const allPosts = usePosts();
  return postId ? allPosts.find((p) => p.id === postId) : undefined;
}

export function getPostById(postId: string): Post | undefined {
  return posts.find((p) => p.id === postId);
}

// Pulls every pet_posts row (with its author's PUBLIC profile info only —
// name + avatar_url, nothing else), plus its comments (with each
// commenter's name + avatar) and whether the current signed-in user has
// liked it, and rebuilds the local `posts` array from that.
export async function loadPosts() {
  const { data: postsData, error: postsError } = await supabase
    .from("pet_posts")
    .select("*, profiles ( name, avatar_url )")
    .order("created_at", { ascending: false });

  if (postsError) {
    console.warn("Failed to load posts:", postsError.message);
    return;
  }

  const rows = postsData ?? [];
  const postIds = rows.map((p) => p.id);

  const commentsByPost: Record<string, Comment[]> = {};
  if (postIds.length > 0) {
    const { data: commentsData, error: commentsError } = await supabase
      .from("post_comments")
      .select(
        "id, post_id, author_id, text, created_at, profiles ( name, avatar_url )",
      )
      .in("post_id", postIds)
      .order("created_at", { ascending: true });

    if (commentsError) {
      console.warn("Failed to load comments:", commentsError.message);
    } else {
      for (const c of commentsData ?? []) {
        const comment: Comment = {
          id: c.id,
          authorId: c.author_id,
          authorName: (c as any).profiles?.name || "Pet Parent",
          authorAvatarUrl: (c as any).profiles?.avatar_url || null,
          text: c.text,
          createdAt: new Date(c.created_at).getTime(),
        };
        commentsByPost[c.post_id] = [
          ...(commentsByPost[c.post_id] ?? []),
          comment,
        ];
      }
    }
  }

  let likedPostIds = new Set<string>();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && postIds.length > 0) {
    const { data: likesData, error: likesError } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", user.id)
      .in("post_id", postIds);

    if (likesError) {
      console.warn("Failed to load likes:", likesError.message);
    } else {
      likedPostIds = new Set((likesData ?? []).map((l) => l.post_id));
    }
  }

  posts = rows.map((p) => ({
    id: p.id,
    authorId: p.author_id,
    authorName: (p as any).profiles?.name || "Pet Parent",
    authorAvatarUrl: (p as any).profiles?.avatar_url || null,
    kind: p.kind,
    petName: p.pet_name,
    petType: p.pet_type,
    breed: p.breed,
    sex: p.sex,
    colorDescription: p.color_description,
    description: p.description,
    location: p.location,
    claimLocation: p.claim_location ?? null,
    photos: p.photo_urls ?? [],
    createdAt: new Date(p.created_at).getTime(),
    likes: p.likes_count ?? 0,
    liked: likedPostIds.has(p.id),
    comments: commentsByPost[p.id] ?? [],
  }));

  emitChange();
}

// Initial load on cold start.
loadPosts();

// Reload (mainly to refresh each post's "liked" flag for the right user)
// whenever someone signs in or out.
supabase.auth.onAuthStateChange(() => {
  loadPosts();
});

// Keep every screen live: whenever any pet_posts/post_comments/post_likes
// row changes anywhere (this device or anyone else's), just refetch.
supabase
  .channel("pet_posts_changes")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "pet_posts" },
    () => loadPosts(),
  )
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "post_comments" },
    () => loadPosts(),
  )
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "post_likes" },
    () => loadPosts(),
  )
  .subscribe();

// Uploads one local photo (a file:// URI from ImagePicker) to the
// pet-photos storage bucket and returns its public URL.
async function uploadPetPhoto(
  userId: string,
  localUri: string,
): Promise<string> {
  const response = await fetch(localUri);
  const arrayBuffer = await response.arrayBuffer();

  const rawExt = localUri.split(".").pop()?.split("?")[0]?.toLowerCase();
  const fileExt = rawExt && rawExt.length <= 5 ? rawExt : "jpg";
  const contentType = `image/${fileExt === "jpg" ? "jpeg" : fileExt}`;
  const filePath = `${userId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("pet-photos")
    .upload(filePath, arrayBuffer, { contentType });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("pet-photos").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function addPost(params: {
  kind: ReportKind;
  petName: string;
  petType: string;
  breed: string;
  sex: string;
  colorDescription: string;
  description: string;
  location: string;
  claimLocation?: string;
  photos: string[]; // local file:// URIs from ImagePicker
}): Promise<Post> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in to submit a report.");

  const photoUrls: string[] = [];
  for (const localUri of params.photos) {
    photoUrls.push(await uploadPetPhoto(user.id, localUri));
  }

  const { data, error } = await supabase
    .from("pet_posts")
    .insert({
      author_id: user.id,
      kind: params.kind,
      pet_name: params.petName.trim(),
      pet_type: params.petType,
      breed: params.breed,
      sex: params.sex,
      color_description: params.colorDescription.trim(),
      description: params.description.trim(),
      location: params.location.trim(),
      claim_location: params.claimLocation?.trim() || null,
      photo_urls: photoUrls,
    })
    .select("*, profiles ( name, avatar_url )")
    .single();

  if (error) throw error;

  const newPost: Post = {
    id: data.id,
    authorId: data.author_id,
    authorName: (data as any).profiles?.name || "Pet Parent",
    authorAvatarUrl: (data as any).profiles?.avatar_url || null,
    kind: data.kind,
    petName: data.pet_name,
    petType: data.pet_type,
    breed: data.breed,
    sex: data.sex,
    colorDescription: data.color_description,
    description: data.description,
    location: data.location,
    claimLocation: data.claim_location ?? null,
    photos: data.photo_urls ?? [],
    createdAt: new Date(data.created_at).getTime(),
    likes: data.likes_count ?? 0,
    liked: false,
    comments: [],
  };

  posts = [newPost, ...posts];
  emitChange();
  return newPost;
}

// Deletes a pet_posts row (RLS only allows the author to do this — the
// .eq("author_id", user.id) below is belt-and-suspenders on top of that).
// Cascades to that post's comments and likes automatically via the
// "on delete cascade" foreign keys in the schema.
export async function deletePost(postId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in to delete a report.");

  const previousPosts = posts;

  // Optimistic update so the post disappears from the UI immediately.
  posts = posts.filter((p) => p.id !== postId);
  emitChange();

  const { error } = await supabase
    .from("pet_posts")
    .delete()
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) {
    // Roll back if Supabase refused the delete.
    posts = previousPosts;
    emitChange();
    throw error;
  }
}

export async function toggleLike(postId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  const wasLiked = post.liked;

  // Optimistic update so the heart responds instantly.
  posts = posts.map((p) =>
    p.id === postId
      ? { ...p, liked: !wasLiked, likes: wasLiked ? p.likes - 1 : p.likes + 1 }
      : p,
  );
  emitChange();

  if (wasLiked) {
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);

    if (error) {
      console.warn("Failed to unlike post:", error.message);
      posts = posts.map((p) =>
        p.id === postId ? { ...p, liked: true, likes: p.likes + 1 } : p,
      );
      emitChange();
    }
  } else {
    const { error } = await supabase
      .from("post_likes")
      .insert({ post_id: postId, user_id: user.id });

    if (error) {
      console.warn("Failed to like post:", error.message);
      posts = posts.map((p) =>
        p.id === postId ? { ...p, liked: false, likes: p.likes - 1 } : p,
      );
      emitChange();
    }
  }
}

// ---- Comments ----

export async function addComment(
  postId: string,
  text: string,
): Promise<Comment | undefined> {
  const trimmed = text.trim();
  if (!trimmed) return undefined;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in to comment.");

  // Grab the post's owner BEFORE the insert so we know who to notify.
  const targetPost = posts.find((p) => p.id === postId);

  const { data, error } = await supabase
    .from("post_comments")
    .insert({ post_id: postId, author_id: user.id, text: trimmed })
    .select(
      "id, post_id, author_id, text, created_at, profiles ( name, avatar_url )",
    )
    .single();

  if (error) throw error;

  const authorName = (data as any).profiles?.name || "Pet Parent";
  const authorAvatarUrl = (data as any).profiles?.avatar_url || null;

  const newComment: Comment = {
    id: data.id,
    authorId: data.author_id,
    authorName,
    authorAvatarUrl,
    text: data.text,
    createdAt: new Date(data.created_at).getTime(),
  };

  posts = posts.map((p) =>
    p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p,
  );
  emitChange();

  // Let the post's owner know someone commented (no-ops if you're
  // commenting on your own post).
  if (targetPost) {
    notifyPostOwner({
      postId,
      postOwnerId: targetPost.authorId,
      category: "Updates",
      icon: "chatbubble-outline",
      title: `${authorName} commented on your report`,
      subtitle: trimmed.length > 80 ? `${trimmed.slice(0, 80)}…` : trimmed,
    });
  }

  return newComment;
}

// Deletes a single comment (RLS only allows the comment's own author to do
// this, matching "Users can delete their own comments" in the schema).
export async function deleteComment(
  postId: string,
  commentId: string,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in to delete a comment.");

  const previousPosts = posts;

  // Optimistic update so the comment disappears from the UI immediately.
  posts = posts.map((p) =>
    p.id === postId
      ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
      : p,
  );
  emitChange();

  const { error } = await supabase
    .from("post_comments")
    .delete()
    .eq("id", commentId)
    .eq("author_id", user.id);

  if (error) {
    // Roll back if Supabase refused the delete.
    posts = previousPosts;
    emitChange();
    throw error;
  }
}

// ---- Helpers ----

export function getRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
