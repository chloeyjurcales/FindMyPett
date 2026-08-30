import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

// Custom secure storage adapter for Supabase Auth
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

// 1. Paste your project URL here
const supabaseUrl = "https://rvniostsxilvlidyyalh.supabase.co";

// 2. Paste your publishable anon key right here
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bmlvc3RzeGlsdmxpZHl5YWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNzgxNTksImV4cCI6MjEwMzY1NDE1OX0.V9VH-aLYU6OImRvw3rTAiyU3gEI9xAx_17xOHi6PcgQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
