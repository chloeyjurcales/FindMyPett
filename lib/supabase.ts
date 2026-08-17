import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

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
const supabaseUrl = 'https://djaungxpyjcjbesnpnzy.supabase.co';

// 2. Paste your publishable anon key right here
const supabaseAnonKey = 'sb_publishable_4BZtVE8ZdVLUChyyeiqz2Q_N3dgmX6u';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});