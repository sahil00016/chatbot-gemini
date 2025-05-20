"use client";
import { createClient } from '@supabase/supabase-js';
import React, { createContext, useContext } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SupabaseContext = createContext(supabase);
export const useSupabase = () => useContext(SupabaseContext);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
} 