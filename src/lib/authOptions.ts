import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
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
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) return null;
        const isValid = await comparePassword(credentials.password, user.password);
        if (!isValid) return null;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === 'google') {
        if (!user.email) return false;
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name || user.email.split('@')[0],
            email: user.email,
            image: user.image || undefined,
            role: 'customer',
          });
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'customer';
      }
      
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      
      if (!token.role && token.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
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
