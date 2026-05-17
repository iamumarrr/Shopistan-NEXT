'use client';
import { useEffect, useState } from 'react';
import { useWishlist } from '@/store/wishlistStore';
import ProductGrid from '@/components/products/ProductGrid';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const items = useWishlist((s) => s.items);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    Promise.all(items.map((id) => fetch(`/api/products/${id}`).then((r) => r.json())))
      .then((results) => setProducts(results.map((r) => r.product).filter(Boolean)))
      .finally(() => setLoading(false));
  }, [items]);

  if (!loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center max-w-2xl mx-auto">
        <div className="h-24 w-24 rounded-full bg-rose-50 flex items-center justify-center mb-6 shadow-sm border border-rose-100">
          <Heart size={40} className="text-rose-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Your wishlist is empty</h2>
        <p className="text-slate-500 mt-3 text-lg max-w-md">Save items you love for later. They will be waiting for you here!</p>
        <Link
          href="/products"
          className="mt-8 inline-flex h-12 px-8 items-center justify-center rounded-xl bg-slate-900 text-white font-medium hover:bg-indigo-600 active:scale-95 transition-all shadow-md hover:shadow-xl"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">My Wishlist</h1>
        <p className="text-slate-500 text-lg font-medium">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
      </div>
      <ProductGrid products={products} loading={loading} columns={4} />
    </div>
  );
}