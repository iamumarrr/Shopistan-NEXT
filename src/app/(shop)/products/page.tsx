'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Search } from 'lucide-react';
import ProductGrid from '@/components/products/ProductGrid';

function ProductsContent() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paymentStatus === 'success') {
      toast.success('Payment successful! Your order is being processed.', {
        duration: 5000,
        icon: '🎉',
      });
    }
  }, [paymentStatus]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [search, category, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams({ search, category, sort });
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products);
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Shop All Products</h1>
        <p className="text-gray-500 mt-1">Discover our latest collection</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none bg-white"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
          <option value="home">Home</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-11 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none bg-white"
        >
          <option value="-createdAt">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-rating">Top Rated</option>
        </select>
      </div>

      <ProductGrid products={products} loading={loading} columns={4} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center animate-pulse">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}