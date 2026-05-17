'use client';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 active:scale-[0.98] shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)]',
      secondary: 'bg-white text-slate-800 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] shadow-sm',
      outline: 'border-2 border-indigo-100 text-indigo-600 bg-white hover:border-indigo-200 hover:bg-indigo-50 active:scale-[0.98]',
      ghost: 'hover:bg-slate-100 text-slate-700 active:scale-[0.98]',
      danger: 'bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 active:scale-[0.98] shadow-[0_4px_14px_0_rgb(225,29,72,0.39)]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;