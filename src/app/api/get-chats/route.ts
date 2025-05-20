import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { user_id, pdf_id } = await req.json();
  let query = supabase.from('chat_history').select('*').eq('user_id', user_id);
  if (pdf_id) query = query.eq('pdf_id', pdf_id);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ chats: data });
} 