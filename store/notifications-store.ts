import { useSyncExternalStore } from "react";
import { supabase } from "../lib/supabase";

export type NotificationCategory = "Lost" | "Found" | "Updates";

export type NotificationItem = {
  id: string;
  category: NotificationCategory;
  icon: string;
  title: string;
  subtitle: string | null;
  relatedPostId: string | null;
  isRead: boolean;
  createdAt: number;
  actorId: string | null;
  actorName: string | null;
  actorAvatarUrl: string | null;
};

// ---- In-memory cache (module-level so every screen shares it) ----

let notifications: NotificationItem[] = [];

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return notifications;
}

export function useNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useUnreadNotificationCount() {
  const all = useNotifications();
  return all.filter((n) => !n.isRead).length;
}

// Pulls the signed-in user's notifications (RLS already scopes this to
// "auth.uid() = user_id", so no extra filtering needed here), along with
// the actor's name/avatar so the Alerts screen can show who did it.
export async function loadNotifications() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notifications = [];
    emitChange();
    return;
  }

  const { data, error } = await supabase
    .from("notifications")
    .select(
      "*, actor:profiles!notifications_actor_id_fkey ( name, avatar_url )",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Failed to load notifications:", error.message);
    return;
  }

  notifications = (data ?? []).map((n) => ({
    id: n.id,
    category: n.category,
    icon: n.icon,
    title: n.title,
    subtitle: n.subtitle,
    relatedPostId: n.related_post_id,
    isRead: n.is_read,
    createdAt: new Date(n.created_at).getTime(),
    actorId: n.actor_id,
    actorName: (n as any).actor?.name || null,
    actorAvatarUrl: (n as any).actor?.avatar_url || null,
  }));

  emitChange();
}

// Initial load on cold start.
loadNotifications();

// Reload whenever someone signs in or out.
supabase.auth.onAuthStateChange(() => {
  loadNotifications();
});

// Keep the Alerts screen live: refetch whenever a notifications row changes
// anywhere (RLS still only ever returns the signed-in user's own rows).
supabase
  .channel("notifications_changes")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "notifications" },
    () => loadNotifications(),
  )
  .subscribe();

// Creates a notification for the OWNER of a post — e.g. "X commented on
// your report" or "X may have seen your pet" — tagged with the CURRENT
// signed-in user as the actor, so their name/photo can show on it later.
// Silently no-ops if that would mean notifying yourself (e.g. commenting
// on your own post), and just warns (doesn't throw) if the insert fails,
// so it never blocks the action that triggered it.
export async function notifyPostOwner(params: {
  postId: string;
  postOwnerId: string;
  category: NotificationCategory;
  icon: string;
  title: string;
  subtitle?: string;
}): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id === params.postOwnerId) return;

  const { error } = await supabase.from("notifications").insert({
    user_id: params.postOwnerId,
    actor_id: user.id,
    category: params.category,
    icon: params.icon,
    title: params.title,
    subtitle: params.subtitle ?? null,
    related_post_id: params.postId,
  });

  if (error) {
    console.warn("Failed to create notification:", error.message);
  }
}

export async function markNotificationRead(id: string) {
  const notification = notifications.find((n) => n.id === id);
  if (!notification || notification.isRead) return;

  const previous = notifications;
  notifications = notifications.map((n) =>
    n.id === id ? { ...n, isRead: true } : n,
  );
  emitChange();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (error) {
    console.warn("Failed to mark notification as read:", error.message);
    notifications = previous;
    emitChange();
  }
}

export async function markAllNotificationsRead() {
  const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
  if (unreadIds.length === 0) return;

  const previous = notifications;
  notifications = notifications.map((n) => ({ ...n, isRead: true }));
  emitChange();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .in("id", unreadIds);

  if (error) {
    console.warn("Failed to mark all notifications as read:", error.message);
    notifications = previous;
    emitChange();
  }
}

// Deletes a single notification (RLS should already restrict this to rows
// where auth.uid() = user_id, matching how reads/updates are scoped above).
// Optimistically removes it from the local list first, then rolls back if
// the delete fails server-side.
export async function deleteNotification(id: string) {
  const previous = notifications;
  notifications = notifications.filter((n) => n.id !== id);
  emitChange();

  const { error } = await supabase.from("notifications").delete().eq("id", id);

  if (error) {
    console.warn("Failed to delete notification:", error.message);
    notifications = previous;
    emitChange();
  }
}

// Deletes every notification currently loaded for the signed-in user.
export async function clearAllNotifications() {
  const ids = notifications.map((n) => n.id);
  if (ids.length === 0) return;

  const previous = notifications;
  notifications = [];
  emitChange();

  const { error } = await supabase.from("notifications").delete().in("id", ids);

  if (error) {
    console.warn("Failed to clear notifications:", error.message);
    notifications = previous;
    emitChange();
  }
}
