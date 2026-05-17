import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';

export const metadata = { title: 'Shopistan', description: 'Modern E-commerce' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen antialiased selection:bg-indigo-200 selection:text-indigo-900 overflow-x-hidden`}>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
          <Toaster position="top-right" toastOptions={{
            style: { background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }
          }} />
        </AuthProvider>
      </body>
    </html>
  );
}