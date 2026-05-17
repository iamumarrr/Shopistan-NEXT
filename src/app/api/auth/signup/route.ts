import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { hashPassword, signToken } from '@/lib/auth';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = signupSchema.parse(body);

    const exists = await User.findOne({ email: data.email });
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashed = await hashPassword(data.password);
    const user = await User.create({ ...data, password: hashed });

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