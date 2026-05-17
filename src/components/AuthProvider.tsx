'use client';
import { SessionProvider, useSession } from 'next-auth/react';
import { useAuth } from '@/store/authStore';
import { useEffect } from 'react';

function SessionSync() {
  const { data: session, status } = useSession();
  const setUser = useAuth((s) => s.setUser);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser({
        id: (session.user as any).id,
        name: session.user.name!,
        email: session.user.email!,
        role: (session.user as any).role || 'customer',
      });
    } else if (status === 'unauthenticated') {
      setUser(null);
    }
  }, [session, status, setUser]);

  return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  );
}