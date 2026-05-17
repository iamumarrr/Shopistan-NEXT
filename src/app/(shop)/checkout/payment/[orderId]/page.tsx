'use client';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import StripeCheckout from '@/components/payments/StripeCheckout';

export default function PaymentPage() {
  const { orderId } = useParams();
  const searchParams = useSearchParams();
  const method = searchParams.get('method');
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.order?.isPaid) router.push(`/orders/${orderId}`);
        else setOrder(d.order);
      });
  }, [orderId, router]);

  if (!order) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-2">Complete Payment</h1>
      <p className="text-gray-600 mb-6">
        Order #{order._id.slice(-8)} • Total: <span className="font-bold">${order.totalPrice.toFixed(2)}</span>
      </p>

      {method === 'STRIPE' && <StripeCheckout orderId={order._id} />}
    </div>
  );
}