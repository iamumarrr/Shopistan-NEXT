import Link from 'next/link';
import { LayoutDashboard, Package, Plus, ShoppingBag, CreditCard } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'New Product', href: '/admin/products/new', icon: Plus },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  ];

  return (
    <div className="grid md:grid-cols-[240px_1fr] min-h-[calc(100vh-80px)]">
      <aside className="bg-white border-r border-slate-200 p-6 hidden md:block">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="font-bold text-slate-900 tracking-tight">Admin Portal</span>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 group font-medium"
            >
              <item.icon size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-4 sm:p-8 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}