import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ user: null });

  await connectDB();
  const user = await User.findById(session.userId).select('-password');
  return NextResponse.json({ user });
}