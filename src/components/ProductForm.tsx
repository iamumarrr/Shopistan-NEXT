'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Upload, X, Save, Image as ImageIcon, ChevronLeft } from 'lucide-react';

export default function ProductForm({ product }: { product?: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || 'electronics',
    brand: product?.brand || '',
    stock: product?.stock || 0,
    images: product?.images || [],
  });
  const [uploading, setUploading] = useState(false);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      
      if (res.ok && data.url) {
        setForm({ ...form, images: [...form.images, data.url] });
        toast.success('Image uploaded');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      toast.error('Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.images.length === 0) return toast.error('Add at least one image');

    const url = product ? `/api/products/${product._id}` : '/api/products';
    const method = product ? 'PUT' : 'POST';
    
    const loadingToast = toast.loading(product ? 'Updating...' : 'Creating...');
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(product ? 'Product updated successfully' : 'Product created successfully', { id: loadingToast });
        router.push('/admin/products');
      } else {
        toast.error('Something went wrong', { id: loadingToast });
      }
    } catch (err) {
      toast.error('Operation failed', { id: loadingToast });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium"
      >
        <ChevronLeft size={18} /> Back to products
      </button>

      <form onSubmit={submit} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {product ? 'Edit' : 'New'} Product
            </h1>
            <p className="text-slate-500 text-sm mt-1">Fill in the details below to {product ? 'update' : 'create'} your product.</p>
          </div>
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Save size={20} />
            {product ? 'Update' : 'Create'} Product
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 ml-1">Product Name</label>
              <input 
                required 
                placeholder="e.g. Premium Wireless Headphones" 
                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400"
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 ml-1">Brand Name</label>
              <input 
                placeholder="e.g. Sony" 
                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400"
                value={form.brand} 
                onChange={(e) => setForm({ ...form, brand: e.target.value })} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 ml-1">Description</label>
            <textarea 
              required 
              placeholder="Describe the features and benefits of this product..." 
              className="w-full min-h-[150px] bg-slate-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400 resize-none"
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 ml-1">Price ($)</label>
              <input 
                required 
                type="number" 
                placeholder="0.00" 
                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 font-bold"
                value={form.price} 
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} 
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 ml-1">Inventory (Stock)</label>
              <input 
                required 
                type="number" 
                placeholder="0" 
                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 font-bold"
                value={form.stock} 
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} 
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 ml-1">Category</label>
              <select 
                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 font-bold appearance-none cursor-pointer"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
                <option value="home">Home</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 ml-1 flex justify-between items-center">
              Product Images
              <span className="text-xs font-normal text-slate-400">Add up to 5 images</span>
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {form.images.map((img: string, i: number) => (
                <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <img src={img} className="w-full h-full object-cover" alt={`Product ${i}`} />
                  <button 
                    type="button" 
                    onClick={() => setForm({ ...form, images: form.images.filter((_: any, idx: number) => idx !== i) })}
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              
              {form.images.length < 5 && (
                <label className={`aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:border-indigo-500 hover:bg-indigo-50/50 hover:text-indigo-600 text-slate-400 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input type="file" accept="image/*" className="hidden" onChange={upload} disabled={uploading} />
                  {uploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent" />
                  ) : (
                    <>
                      <Upload size={24} />
                      <span className="text-xs font-bold uppercase tracking-wider">Upload</span>
                    </>
                  )}
                </label>
              )}

              {form.images.length === 0 && !uploading && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                  <ImageIcon size={48} className="mb-4 opacity-20" />
                  <p className="font-medium">No images uploaded yet</p>
                  <p className="text-xs mt-1">Recommended size: 1000x1000px</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}