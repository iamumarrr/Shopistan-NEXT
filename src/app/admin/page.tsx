'use client';
import Link from 'next/link';
import { Plus, Package, ShoppingBag, CreditCard, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Products', value: '124', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Total Orders', value: '45', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Revenue', value: '$12,450', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const quickActions = [
    { name: 'Add New Product', href: '/admin/products/new', icon: Plus, desc: 'Create a new listing in your shop' },
    { name: 'Manage Orders', href: '/admin/orders', icon: ShoppingBag, desc: 'View and update order status' },
    { name: 'View Payments', href: '/admin/payments', icon: CreditCard, desc: 'Check transaction history' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage your store and view performance at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-50">
          {quickActions.map((action) => (
            <Link key={action.name} href={action.href} className="p-6 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                  <action.icon size={20} />
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{action.name}</h3>
              </div>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                {action.desc}
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
