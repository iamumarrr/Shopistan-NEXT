'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/store/authStore';

export default function SignupPage() {
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);
    setUser(data.user);
    toast.success('Account created!');
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mt-16 mb-20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create an Account</h1>
        <p className="text-slate-500 mt-2">Join Shopistan to start shopping</p>
      </div>
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
          <input
            placeholder="John Doe" required
            className="w-full h-12 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
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
            type="password" placeholder="Min. 6 characters" required minLength={6}
            className="w-full h-12 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="w-full h-12 mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-600 active:scale-[0.98] transition-all shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)]">
          Create Account
        </button>
      </form>
      <p className="text-center text-sm text-slate-600 mt-8">
        Already have an account? <Link href="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}