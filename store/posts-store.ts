import { useSyncExternalStore } from 'react';
import type { ImageSourcePropType } from 'react-native';

// Local avatar assets.
const nadithAvatar = require('../assets/images/nadith.png');
const klowieAvatar = require('../assets/images/klowe.png');

export type Post = {
  id: string;
  author: string;
  location: string;
  imageUrl: string;
  body: string;
  likes: number;
  liked: boolean;
  views: number;
  authorAvatar?: ImageSourcePropType | string;
};

export type CommentItem = {
  id: string;
  name: string;
  avatar: string | ImageSourcePropType;
  text: string;
};

// ---- In-memory state (module-level so every screen shares it) ----

let posts: Post[] = [
  {
    id: '1',
    author: 'Junrel Alipogpog',
    location: 'Banban, Bogo, Cebu • 3 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
    body: 'Our dog went missing',
    likes: 21,
    liked: false,
    views: 30,
  },
];

let commentsByPostId: Record<string, CommentItem[]> = {
  '1': [
    {
      id: 'c1',
      name: 'Nadith Marie',
      avatar: nadithAvatar,
      text:
        "hi, i think i saw your pet yesterday while i was riding my car near the parke in bogo city. i noticed it wandering around the area by itself. i wasn't able to stop for long, but i remembered it after seeing your post. maybe you can try checking around the terminal and nearby streets there. hoping you find your pet safe soon.",
    },
  ],
};

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

export function getPostById(postId: string): Post | undefined {
  return posts.find((p) => p.id === postId);
}

export function addPost(params: { imageUri: string; caption: string }): Post {
  const newPost: Post = {
    id: Date.now().toString(),
    author: 'Jurcales, Chloey Lyca',
    location: 'Cebu, Philippines • Just now',
    imageUrl: params.imageUri,
    body: params.caption,
    likes: 0,
    liked: false,
    views: 0,
    authorAvatar: klowieAvatar,
  };

  posts = [newPost, ...posts];
  commentsByPostId = { ...commentsByPostId, [newPost.id]: [] };
  emitChange();
  return newPost;
}

export function toggleLike(postId: string) {
  posts = posts.map((p) =>
    p.id === postId
      ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
      : p
  );
  emitChange();
}

// ---- Comments ----

function getCommentsSnapshot(postId: string) {
  return commentsByPostId[postId] || [];
}

export function useComments(postId: string) {
  return useSyncExternalStore(
    (listener) => subscribe(listener),
    () => getCommentsSnapshot(postId),
    () => getCommentsSnapshot(postId)
  );
}

export function addComment(postId: string, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const newComment: CommentItem = {
    id: `c${Date.now()}`,
    name: 'You',
    avatar: klowieAvatar,
    text: trimmed,
  };

  const existing = commentsByPostId[postId] || [];
  commentsByPostId = { ...commentsByPostId, [postId]: [...existing, newComment] };
  emitChange();
}