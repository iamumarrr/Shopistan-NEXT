import { NextResponse } from 'next/server';
import { supabaseAdmin, mapUser } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ user: null });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      );
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', session.userId)
      .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        { user: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: mapUser(user),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}