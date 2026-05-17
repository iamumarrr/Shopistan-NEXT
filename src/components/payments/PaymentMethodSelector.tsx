'use client';

const methods = [
  { id: 'COD', name: 'Cash on Delivery', desc: 'Pay when you receive', icon: '💵' },
  { id: 'STRIPE', name: 'Credit Card (Stripe)', desc: 'Pay securely with card', icon: '💳' },
] as const;

interface Props {
  value: string;
  onChange: (v: any) => void;
}

export default function PaymentMethodSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      {methods.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={`w-full p-4 border-2 rounded-2xl flex items-center gap-4 transition-all ${
            value === m.id
              ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
              : 'border-slate-100 hover:border-slate-200 bg-white'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
            value === m.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600'
          }`}>
            {m.icon}
          </div>
          <div className="text-left flex-1">
            <p className="font-bold text-slate-900">{m.name}</p>
            <p className="text-sm text-slate-500">{m.desc}</p>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            value === m.id ? 'border-indigo-600' : 'border-slate-200'
          }`}>
            {value === m.id && <div className="w-3 h-3 rounded-full bg-indigo-600" />}
          </div>
        </button>
      ))}
      <input type="hidden" name="payment" value={value} />
    </div>
  );
}