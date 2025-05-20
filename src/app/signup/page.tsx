"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SupabaseProvider, useSupabase } from "../supabase-provider";

export default function SignUp() {
  return (
    <SupabaseProvider>
      <SignUpContent />
    </SupabaseProvider>
  );
}

function SignUpContent() {
  const supabase = useSupabase();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/chatbot");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <form onSubmit={handleSignUp} className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">Sign Up</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          className="border rounded-lg px-4 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400" 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          className="border rounded-lg px-4 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400" 
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button 
          type="submit" 
          disabled={loading} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}