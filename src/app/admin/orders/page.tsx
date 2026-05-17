'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const r = await fetch('/api/orders');
    const d = await r.json();
    setOrders(d.orders || []);
  };

  const updateStatus = async (id: string, status: string) => {
    const r = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (r.ok) {
      toast.success('Updated');
      load();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Order ID</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-3 font-mono text-xs">{o._id.slice(-8)}</td>
                <td className="p-3">{o.user?.name || 'N/A'}</td>
                <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-3">${o.totalPrice.toFixed(2)}</td>
                <td className="p-3">
                  <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="border p-1 rounded">
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}