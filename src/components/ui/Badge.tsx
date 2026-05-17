import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-600 border border-slate-200 shadow-sm',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200 shadow-sm',
    info: 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}