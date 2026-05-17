'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, User, LogOut, Package, LayoutDashboard, Plus, Menu, X } from 'lucide-react';
import { useWishlist } from '@/store/wishlistStore';
import { useCart } from '@/store/cartStore';
import { useAuth } from '@/store/authStore';
import { signOut } from 'next-auth/react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const totalItems = useCart((s) => s.totalItems());
  const { user } = useAuth();
  const wishlistCount = useWishlist((s) => s.items.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between relative">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="sm:hidden p-2 -ml-2 text-slate-600 hover:text-indigo-600 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo - Centered on mobile, Left on desktop */}
        <Link
          href="/"
          className="text-2xl sm:text-3xl font-black tracking-tighter bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent hover:opacity-90 transition-opacity absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0"
        >
          Shopistan
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-6 ml-8 mr-auto">
          <Link href="/products" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Products</Link>
          {user?.role === 'admin' && (
            <Link href="/admin" className="flex items-center gap-2 px-3 py-1.5 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors font-bold text-[10px] uppercase tracking-widest border border-indigo-100 shadow-sm">
              <LayoutDashboard size={12} /> Admin
            </Link>
          )}
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-1 sm:gap-3">
          {user?.role === 'admin' && (
            <Link href="/admin/products/new" className="hidden sm:flex w-9 h-9 rounded-full bg-slate-900 text-white items-center justify-center hover:bg-indigo-600 transition-all shadow-lg hover:scale-110 active:scale-95" title="Add New Product">
              <Plus size={18} />
            </Link>
          )}
          
          <Link href="/wishlist" className="relative group flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-all hidden sm:flex">
            <Heart className="w-5 h-5 text-slate-500 group-hover:text-rose-500 group-hover:scale-110 transition-all" />
            {mounted && wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full text-[10px] font-bold w-5 h-5 flex items-center justify-center shadow-md">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative group flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-all">
            <ShoppingCart className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 group-hover:scale-110 transition-all" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full text-[10px] font-bold w-5 h-5 flex items-center justify-center shadow-md">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/orders" title="My Orders" className="hover:text-indigo-600 transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100"><Package className="w-5 h-5 text-slate-500" /></Link>
              <span className="text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 shadow-sm font-bold tracking-wide text-sm leading-none flex items-center h-9">Hi, {user.name}</span>
              <button onClick={handleLogout} title="Logout" className="text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100"><LogOut className="w-5 h-5" /></button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:block bg-slate-900 hover:bg-indigo-600 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all font-semibold text-sm">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white sm:hidden flex flex-col h-screen">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Menu</span>
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="p-2 -mr-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="flex flex-col gap-2">
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold">Home</span>
              </Link>
              
              <Link 
                href="/products" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold">Products</span>
              </Link>

              <Link 
                href="/wishlist" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-lg font-bold">Wishlist</span>
                  {mounted && wishlistCount > 0 && (
                    <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </Link>

              {user && (
                <Link 
                  href="/orders" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-bold">My Orders</span>
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/50 text-indigo-600 hover:bg-indigo-50 transition-all group mt-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-bold">Admin Dashboard</span>
                </Link>
              )}
            </div>
          </div>

          {/* Footer - Profile & Logout */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg font-black">
                    {user.name?.[0].toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-4 rounded-2xl bg-white border border-rose-100 text-rose-600 font-bold flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors shadow-sm"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center shadow-xl shadow-slate-200 active:scale-95 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}