'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Edit, Trash2, Plus, Search, ExternalLink, Package } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/products?limit=100');
      const d = await r.json();
      setProducts(d.products);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted');
        load();
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Products</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your inventory and product listings.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus size={20} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent mb-4" />
            <p className="font-bold">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400">
            <Package size={64} className="mb-4 opacity-20" />
            <p className="text-xl font-bold text-slate-900">No products found</p>
            <p className="mt-1">Get started by adding your first product.</p>
            <Link href="/admin/products/new" className="mt-6 text-indigo-600 font-bold hover:underline">Add New Product</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-500">Product</th>
                  <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-500">Category</th>
                  <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-500">Price</th>
                  <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-500">Stock</th>
                  <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 flex-shrink-0">
                          <img src={p.images[0]} className="w-full h-full object-cover" alt={p.name} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{p.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5 font-mono uppercase tracking-tighter">ID: {p._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-5">
                      <p className="font-black text-slate-900 text-lg">${p.price.toFixed(2)}</p>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${p.stock < 10 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                        <span className={`font-bold ${p.stock < 10 ? 'text-amber-600' : 'text-slate-700'}`}>
                          {p.stock} <span className="text-[10px] font-normal text-slate-400 ml-1">UNITS</span>
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/products/${p.slug}`} 
                          target="_blank"
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          title="View on site"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link 
                          href={`/admin/products/${p._id}`} 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          title="Edit product"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => del(p._id)} 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Delete product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}