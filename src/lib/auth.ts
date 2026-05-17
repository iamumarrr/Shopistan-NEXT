import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { verifyToken, JWTPayload } from './auth-utils';

export * from './auth-utils';

export async function getCurrentUser(): Promise<JWTPayload | null> {
  // 1. Check NextAuth Session
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return {
      userId: (session.user as any).id,
      email: session.user.email!,
      role: (session.user as any).role,
    };
  }

  // 2. Fallback to Custom JWT
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  return user;
}