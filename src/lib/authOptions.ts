import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabaseAdmin } from './supabase';
import { comparePassword } from '@/lib/auth';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data: user, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .maybeSingle();

        if (error || !user || !user.password) return null;

        const isValid = await comparePassword(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === 'google') {
        if (!user.email) return false;

        const { data: existingUser, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();

        if (error) return false;

        if (!existingUser) {
          const { error: insertError } = await supabaseAdmin.from('users').insert({
            name: user.name || user.email.split('@')[0],
            email: user.email,
            image: user.image || undefined,
            role: 'customer',
          });
          if (insertError) return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'customer';
      }

      if (trigger === 'update' && session?.name) {
        token.name = session.name;
      }

      if (!token.role && token.email) {
        const { data: dbUser } = await supabaseAdmin
          .from('users')
          .select('role')
          .eq('email', token.email)
          .maybeSingle();
        if (dbUser) token.role = dbUser.role;
      }

      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
};
