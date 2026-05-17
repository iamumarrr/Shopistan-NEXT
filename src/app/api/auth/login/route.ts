import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const valid = await comparePassword(password, user.password);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}