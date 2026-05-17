'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/orders').then((r) => r.json()).then((d) => setOrders(d.orders || []));
  }, []);

  const statusColor = (s: string) => ({
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }[s] || '');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <Link key={o._id} href={`/orders/${o._id}`} className="block bg-white p-4 rounded shadow hover:shadow-lg">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Order #{o._id.slice(-8)}</p>
                <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${o.totalPrice.toFixed(2)}</p>
                <span className={`text-xs px-2 py-1 rounded ${statusColor(o.status)}`}>{o.status}</span>
              </div>
            </div>
          </Link>
        ))}
        {orders.length === 0 && <p className="text-gray-500">No orders yet</p>}
      </div>
    </div>
  );
}