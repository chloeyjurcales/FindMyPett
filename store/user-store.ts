import { useSyncExternalStore } from "react";
import { supabase } from "../lib/supabase";

export type UserProfile = {
  id: string | null;
  name: string;
  location: string;
  avatarUri: string | null;
};

const EMPTY_PROFILE: UserProfile = {
  id: null,
  name: "",
  location: "",
  avatarUri: null,
};

let profile: UserProfile = { ...EMPTY_PROFILE };

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return profile;
}

export function useUserProfile() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// Pulls the signed-in user's row from `profiles` and updates local state.
// The row itself is created automatically by the handle_new_user() trigger
// the moment someone signs up, so this just needs to go fetch it.
async function loadProfileFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, location, avatar_url")
    .eq("id", userId)
    .single();

  if (error) {
    console.warn("Failed to load profile:", error.message);
    return;
  }

  profile = {
    id: data.id,
    name: data.name ?? "",
    location: data.location ?? "",
    avatarUri: data.avatar_url ?? null,
  };
  emitChange();
}

function clearProfile() {
  profile = { ...EMPTY_PROFILE };
  emitChange();
}

// Keep the store in sync with whoever is signed in — this fires right after
// signUp() (so the name you typed on the Sign Up screen shows up
// immediately), right after signInWithPassword(), and on logout.
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    loadProfileFromSupabase(session.user.id);
  } else {
    clearProfile();
  }
});

// Also check on cold start, in case the app was reopened while a session
// was already active (onAuthStateChange doesn't always fire fast enough
// on first mount to beat the first render).
supabase.auth.getSession().then(({ data }) => {
  if (data.session?.user) {
    loadProfileFromSupabase(data.session.user.id);
  }
});

export async function setUserName(name: string) {
  const trimmed = name.trim();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You're not signed in.");

  const { error } = await supabase
    .from("profiles")
    .update({ name: trimmed })
    .eq("id", user.id);

  if (error) throw error;

  profile = { ...profile, name: trimmed };
  emitChange();
}

export async function setUserLocation(location: string) {
  const trimmed = location.trim();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You're not signed in.");

  const { error } = await supabase
    .from("profiles")
    .update({ location: trimmed })
    .eq("id", user.id);

  if (error) throw error;

  profile = { ...profile, location: trimmed };
  emitChange();
}

// Uploads one local photo (a file:// URI from ImagePicker) to the
// avatars storage bucket and returns its public URL. Reuses the same
// filename every time (just "avatar.<ext>") so re-uploading replaces the
// old file instead of piling up orphaned images in storage.
async function uploadAvatarPhoto(
  userId: string,
  localUri: string,
): Promise<string> {
  const response = await fetch(localUri);
  const arrayBuffer = await response.arrayBuffer();

  const rawExt = localUri.split(".").pop()?.split("?")[0]?.toLowerCase();
  const fileExt = rawExt && rawExt.length <= 5 ? rawExt : "jpg";
  const contentType = `image/${fileExt === "jpg" ? "jpeg" : fileExt}`;
  const filePath = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, arrayBuffer, { contentType, upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  // Bust the CDN/client image cache so the new photo shows up immediately
  // even though the URL path itself didn't change (upsert overwrote the
  // same file).
  return `${data.publicUrl}?updated=${Date.now()}`;
}

// Uploads the picked photo to the avatars bucket and saves the resulting
// public URL to profiles.avatar_url, so it persists across app restarts
// and shows up for other users too (e.g. next to their comments — once
// that's wired up).
export async function setUserAvatar(localUri: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You're not signed in.");

  const avatarUrl = await uploadAvatarPhoto(user.id, localUri);

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  if (error) throw error;

  profile = { ...profile, avatarUri: avatarUrl };
  emitChange();
}
