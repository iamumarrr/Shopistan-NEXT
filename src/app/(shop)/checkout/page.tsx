'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCart } from '@/store/cartStore';
import PaymentMethodSelector from '@/components/payments/PaymentMethodSelector';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import InlineCardSection from '@/components/payments/InlineCardSection';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface FormProps {
  paymentMethod: 'COD' | 'STRIPE';
  setPaymentMethod: (m: 'COD' | 'STRIPE') => void;
  shipping: any;
  setShipping: (s: any) => void;
  clientSecret?: string;
}

function CheckoutFormUI({ paymentMethod, setPaymentMethod, shipping, setShipping, clientSecret, loading, onSubmit }: any) {
  const { items, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = totalPrice();
  const shippingCost = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + shippingCost + tax;

  return (
    <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-6 text-slate-900">Shipping Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(shipping).map((key) => (
              <div key={key} className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">{key}</label>
                <input
                  required 
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  className="w-full border-slate-200 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={shipping[key]}
                  onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-4 text-slate-900">Payment Method</h2>
          <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
          
          {paymentMethod === 'STRIPE' && clientSecret && <InlineCardSection />}
          {paymentMethod === 'STRIPE' && !clientSecret && (
            <div className="mt-4 text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm animate-pulse">
              Initializing secure card processor...
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit sticky top-24">
        <h2 className="text-xl font-bold mb-6 text-slate-900">Order Summary</h2>
        <div className="space-y-3 mb-6">
          {mounted && items.map((i) => (
            <div key={i.product} className="flex justify-between text-sm">
              <span className="text-slate-600">{i.name} <span className="text-slate-400">x{i.quantity}</span></span>
              <span className="font-bold text-slate-900">${(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className="space-y-2 border-t border-slate-50 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="text-slate-900 font-medium">${mounted ? subtotal.toFixed(2) : '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Shipping</span>
            <span className="text-slate-900 font-medium">${mounted ? shippingCost.toFixed(2) : '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Tax (10%)</span>
            <span className="text-slate-900 font-medium">${mounted ? tax.toFixed(2) : '0.00'}</span>
          </div>
          <div className="flex justify-between font-black text-xl mt-4 pt-4 border-t border-slate-100">
            <span className="text-slate-900">Total</span>
            <span className="text-indigo-600">${mounted ? grandTotal.toFixed(2) : '0.00'}</span>
          </div>
        </div>

        <button 
          disabled={loading || (mounted && items.length === 0) || (paymentMethod === 'STRIPE' && !clientSecret)}
          className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-2xl mt-8 disabled:opacity-50 font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing Order...
            </>
          ) : 'Place Order'}
        </button>
        <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">Secure Checkout</p>
      </div>
    </form>
  );
}

function StripeCheckoutForm(props: FormProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { items, clear } = useCart();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
          shippingAddress: props.shipping,
          paymentMethod: 'STRIPE',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (!stripe || !elements) throw new Error('Payment system not ready.');

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/orders/${data.order._id}` },
      });

      if (confirmError) throw new Error(confirmError.message);
      // Redirect to order detail page on success
      router.push(`/orders/${data.order._id}`);
    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return <CheckoutFormUI {...props} loading={loading} onSubmit={handleSubmit} />;
}

function CODCheckoutForm(props: FormProps) {
  const router = useRouter();
  const { items, clear } = useCart();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
          shippingAddress: props.shipping,
          paymentMethod: 'COD',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      clear();
      toast.success('Order placed successfully!');
      router.push(`/orders/${data.order._id}`);
    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return <CheckoutFormUI {...props} loading={loading} onSubmit={handleSubmit} />;
}

export default function CheckoutPage() {
  const { items } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'STRIPE'>('COD');
  const [clientSecret, setClientSecret] = useState('');
  const [shipping, setShipping] = useState({
    fullName: '', street: '', city: '', state: '', zip: '', country: '', phone: '',
  });

  useEffect(() => {
    if (paymentMethod === 'STRIPE' && !clientSecret && items.length > 0) {
      fetch('/api/payments/stripe/init-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(i => ({ product: i.product, quantity: i.quantity })) }),
      })
        .then(res => res.json())
        .then(data => setClientSecret(data.clientSecret));
    }
  }, [paymentMethod, items, clientSecret]);

  const props = { paymentMethod, setPaymentMethod, shipping, setShipping, clientSecret };

  if (paymentMethod === 'STRIPE' && clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
        <StripeCheckoutForm {...props} />
      </Elements>
    );
  }

  return <CODCheckoutForm {...props} />;
}