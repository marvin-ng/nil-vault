import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import { DEMO_PROFILE } from "@/lib/mockData";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  sport: string | null;
  school: string | null;
  division: string | null;
  role: "athlete" | "admin";
  program_id: string | null;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  demoMode: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  fetchProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  enterDemo: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: true,
  demoMode: false,

  setSession: (session) => {
    set({ session, user: session?.user ?? null });
  },

  setProfile: (profile) => {
    set({ profile });
  },

  enterDemo: () => {
    set({ demoMode: true, profile: DEMO_PROFILE, loading: false });
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (data) set({ profile: data as Profile });
  },

  signOut: async () => {
    const { demoMode } = get();
    if (demoMode) {
      set({ demoMode: false, session: null, user: null, profile: null });
      return;
    }
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
  },

  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    set({ session, user: session?.user ?? null, loading: false });

    if (session?.user) {
      await get().fetchProfile();
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) {
        await get().fetchProfile();
      } else {
        set({ profile: null });
      }
    });
  },
}));
