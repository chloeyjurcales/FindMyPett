import { useSyncExternalStore } from "react";

export type ReportKind = "Lost Pet" | "Found Pet";

export type Comment = {
  id: string;
  author: string;
  text: string;
  createdAt: number;
};

export type Post = {
  id: string;
  kind: ReportKind;
  petName: string;
  petType: string;
  breed: string;
  sex: string;
  colorDescription: string;
  description: string;
  location: string;
  photos: string[];
  createdAt: number;
  likes: number;
  liked: boolean;
  comments: Comment[];
};

// TODO: replace with the real signed-in user's name once auth is wired up
const CURRENT_USER_NAME = "You";

// ---- In-memory state (module-level so every screen shares it) ----

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

export function addPost(params: {
  kind: ReportKind;
  petName: string;
  petType: string;
  breed: string;
  sex: string;
  colorDescription: string;
  description: string;
  location: string;
  photos: string[];
}): Post {
  const newPost: Post = {
    id: Date.now().toString(),
    kind: params.kind,
    petName: params.petName.trim(),
    petType: params.petType,
    breed: params.breed,
    sex: params.sex,
    colorDescription: params.colorDescription.trim(),
    description: params.description.trim(),
    location: params.location.trim(),
    photos: params.photos,
    createdAt: Date.now(),
    likes: 0,
    liked: false,
    comments: [],
  };

  posts = [newPost, ...posts];
  emitChange();
  return newPost;
}

export function toggleLike(postId: string) {
  posts = posts.map((p) =>
    p.id === postId
      ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
      : p,
  );
  emitChange();
}

// ---- Comments ----

export function addComment(
  postId: string,
  text: string,
  author: string = CURRENT_USER_NAME,
): Comment | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;

  const newComment: Comment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author,
    text: trimmed,
    createdAt: Date.now(),
  };

  posts = posts.map((p) =>
    p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p,
  );
  emitChange();
  return newComment;
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
