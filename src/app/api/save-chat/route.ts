import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { user_id, pdf_id, question, answer } = await req.json();
  const { error } = await supabase.from('chat_history').insert([{ user_id, pdf_id, question, answer }]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 