'use client';

import { PaymentElement } from '@stripe/react-stripe-js';

export default function InlineCardSection() {
  return (
    <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Secure Card Details</h3>
        </div>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
    </div>
  );
}
