'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome back!');
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mt-16 mb-20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
        <p className="text-slate-500 mt-2">Enter your credentials to access your account</p>
      </div>

      <button 
        onClick={handleGoogleSignIn}
        className="w-full h-12 flex items-center justify-center gap-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-all mb-6"
      >
        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
        Sign in with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-medium">Or continue with</span></div>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
          <input
            type="email" placeholder="you@example.com" required
            className="w-full h-12 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <input
            type="password" placeholder="••••••••" required
            className="w-full h-12 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button disabled={loading} className="w-full h-12 mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-600 active:scale-[0.98] transition-all shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] disabled:opacity-50 disabled:pointer-events-none">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <p className="text-center text-sm text-slate-600 mt-8">
        Don't have an account? <Link href="/signup" className="text-indigo-600 font-semibold hover:underline">Create one</Link>
      </p>
    </div>
  );
}