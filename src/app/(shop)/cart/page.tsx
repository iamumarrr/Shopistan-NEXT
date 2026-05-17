'use client';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useCart } from '@/store/cartStore';

export default function CartPage() {
  const { items, updateQty, removeItem, totalPrice } = useCart();

  if (items.length === 0)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl mb-4">Your cart is empty</h2>
        <Link href="/products" className="text-indigo-600">Continue shopping</Link>
      </div>
    );

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-3">
        {items.map((item) => (
          <div key={item.product} className="bg-white p-4 rounded shadow flex gap-4 items-center">
            <img src={item.image} className="w-20 h-20 object-cover rounded" alt={item.name} />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-indigo-600">${item.price}</p>
            </div>
            <input
              type="number" min={1} max={item.stock} value={item.quantity}
              onChange={(e) => updateQty(item.product, Number(e.target.value))}
              className="w-16 border p-1 rounded"
            />
            <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
            <button onClick={() => removeItem(item.product)} className="text-red-500">
              <Trash2 />
            </button>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded shadow h-fit">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <div className="flex justify-between mb-2"><span>Subtotal</span><span>${totalPrice().toFixed(2)}</span></div>
        <div className="flex justify-between mb-2"><span>Shipping</span><span>{totalPrice() > 100 ? 'Free' : '$10'}</span></div>
        <div className="flex justify-between mb-2"><span>Tax (10%)</span><span>${(totalPrice() * 0.1).toFixed(2)}</span></div>
        <hr className="my-3" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${(totalPrice() + (totalPrice() > 100 ? 0 : 10) + totalPrice() * 0.1).toFixed(2)}</span>
        </div>
        <Link href="/checkout" className="block bg-indigo-600 text-white text-center py-2 rounded mt-4">
          Checkout
        </Link>
      </div>
    </div>
  );
}