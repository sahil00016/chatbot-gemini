"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from '@supabase/supabase-js';
import { SupabaseProvider, useSupabase } from "./supabase-provider";

export default function Home() {
  return (
    <SupabaseProvider>
      <HomeContent />
    </SupabaseProvider>
  );
}

function HomeContent() {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => setUser(data.user));
  }, [supabase]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">Gemini PDF Chatbot</h1>
        <p className="text-gray-600 text-center mb-4">Upload a PDF and chat with it using Google Gemini AI. Please sign in to continue.</p>
        <div className="flex flex-col gap-3 w-full">
          {!user ? (
            <>
              <Link href="/signin" className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition">Sign In</Link>
              <Link href="/signup" className="w-full text-center border border-indigo-600 text-indigo-700 font-semibold py-2 rounded-lg hover:bg-indigo-50 transition">Sign Up</Link>
            </>
          ) : (
            <>
              <Link href="/chatbot" className="w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition">Go to Chatbot</Link>
              <button onClick={async () => { await supabase.auth.signOut(); location.reload(); }} className="w-full text-center border border-red-600 text-red-700 font-semibold py-2 rounded-lg hover:bg-red-50 transition">Sign Out</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
