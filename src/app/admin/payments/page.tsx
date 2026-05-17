'use client';
import { useEffect, useState } from 'react';
import { CreditCard, Wallet, Banknote, Calendar, User, ShoppingBag } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders || []);
        setLoading(false);
      });
  }, []);

  const stats = {
    totalRevenue: orders.filter((o) => o.isPaid).reduce((s, o) => s + o.totalPrice, 0),
    paidCount: orders.filter((o) => o.isPaid).length,
    pendingCount: orders.filter((o) => !o.isPaid).length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payments & Revenue</h1>
        <p className="text-slate-500 text-sm mt-1">Monitor your income and transaction history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl"><Banknote size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-black text-slate-900">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl"><Wallet size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paid Orders</p>
            <p className="text-2xl font-black text-slate-900">{stats.paidCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl"><Calendar size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending COD</p>
            <p className="text-2xl font-black text-slate-900">{stats.pendingCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <h2 className="font-bold text-slate-900">Transaction History (COD)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-500">Order</th>
                <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-500">Customer</th>
                <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-500">Amount</th>
                <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
                <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-400 font-bold">Loading transactions...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-400">
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No transactions found</p>
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 font-mono text-xs font-bold text-indigo-600">#{o._id.slice(-8).toUpperCase()}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-slate-900 font-medium">
                        <User size={14} className="text-slate-400" />
                        {o.user?.name || 'Guest Customer'}
                      </div>
                    </td>
                    <td className="p-5 font-black text-slate-900">${o.totalPrice.toFixed(2)}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        o.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {o.isPaid ? 'Paid' : 'Pending COD'}
                      </span>
                    </td>
                    <td className="p-5 text-slate-500 text-sm">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}