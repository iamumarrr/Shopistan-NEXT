'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCart } from '@/store/cartStore';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);

  useEffect(() => {
    fetch(`/api/products/${id}`).then((r) => r.json()).then((d) => setProduct(d.product));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const handleAdd = () => {
    addItem({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: qty,
      stock: product.stock,
    });
    toast.success('Added to cart');
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded shadow">
      <img src={product.images[0]} className="w-full rounded" alt={product.name} />
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500 mt-2">{product.category}</p>
        <p className="text-3xl text-indigo-600 font-bold my-4">${product.price}</p>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <p className="text-sm mb-4">Stock: {product.stock}</p>
        {product.stock > 0 ? (
          <div className="flex items-center gap-3">
            <input
              type="number" min={1} max={product.stock} value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="border p-2 w-20 rounded"
            />
            <button onClick={handleAdd} className="bg-indigo-600 text-white px-6 py-2 rounded">
              Add to Cart
            </button>
          </div>
        ) : (
          <p className="text-red-500 font-semibold">Out of Stock</p>
        )}
      </div>
    </div>
  );
}