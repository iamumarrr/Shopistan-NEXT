'use client';

import { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/products?payment=success`,
      },
    });

    if (error) {
      toast.error(error.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      
      <button
        disabled={loading || !stripe}
        className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          'Complete Payment'
        )}
      </button>
    </form>
  );
}

export default function StripeCheckout({ orderId }: { orderId: string }) {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/payments/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to initialize payment');
        return data;
      })
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => {
        console.error('Stripe Init Error:', err);
        setError(err.message);
        toast.error(err.message);
      });
  }, [orderId]);

  if (error) return <div className="text-center py-10 text-red-500 font-bold">{error}</div>;
  if (!clientSecret) return <div className="text-center py-10 flex flex-col items-center gap-3">
    <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
    <p className="text-slate-500 font-medium">Securing payment session...</p>
  </div>;

  return (
    <div className="bg-slate-50/50 p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
        <CheckoutForm orderId={orderId} />
      </Elements>
    </div>
  );
}
