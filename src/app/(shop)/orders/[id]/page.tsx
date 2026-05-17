'use client';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/orders/${id}`).then((r) => r.json()).then((d) => setOrder(d.order));
    if (paymentStatus === 'success') toast.success('Payment successful!');
    if (paymentStatus === 'failed') toast.error('Payment failed');
  }, [id, paymentStatus]);

  if (!order) return <div>Loading...</div>;

  const steps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStep = steps.indexOf(order.status);

  const PaymentBadge = () => {
    if (order.isPaid)
      return (
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
          <CheckCircle size={14} /> Paid via {order.paymentMethod}
        </span>
      );
    if (order.paymentStatus === 'failed')
      return (
        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
          <XCircle size={14} /> Payment Failed
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
        <Clock size={14} /> {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Pending Payment'}
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">Order #{order._id.slice(-8)}</h1>
          <p className="text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <PaymentBadge />
      </div>

      {/* Retry payment button */}
      {!order.isPaid && order.paymentMethod !== 'COD' && order.paymentStatus !== 'paid' && (
        <Link
          href={`/checkout/payment/${order._id}?method=${order.paymentMethod}`}
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded mb-4"
        >
          Complete Payment
        </Link>
      )}

      {/* Tracker */}
      <div className="flex justify-between mb-8 mt-6">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              i <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}>{i + 1}</div>
            <span className="text-xs mt-1 capitalize">{s}</span>
          </div>
        ))}
      </div>

      <h3 className="font-bold mb-2">Items</h3>
      {order.items.map((i: any, idx: number) => (
        <div key={idx} className="flex justify-between mb-2">
          <span>{i.name} x {i.quantity}</span>
          <span>${(i.price * i.quantity).toFixed(2)}</span>
        </div>
      ))}

      <hr className="my-4" />
      <div className="space-y-1">
        <p>Subtotal: ${order.itemsPrice.toFixed(2)}</p>
        <p>Shipping: ${order.shippingPrice.toFixed(2)}</p>
        <p>Tax: ${order.taxPrice.toFixed(2)}</p>
        <p className="font-bold text-lg">Total: ${order.totalPrice.toFixed(2)}</p>
      </div>

      {order.paymentDetails?.transactionId && (
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <p className="font-semibold">Payment Details</p>
          <p>Transaction ID: <span className="font-mono">{order.paymentDetails.transactionId}</span></p>
          {order.paymentDetails.paidAt && (
            <p>Paid At: {new Date(order.paymentDetails.paidAt).toLocaleString()}</p>
          )}
        </div>
      )}

      <h3 className="font-bold mt-4">Shipping Address</h3>
      <p>{order.shippingAddress.fullName}</p>
      <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
      <p>{order.shippingAddress.state} {order.shippingAddress.zip}, {order.shippingAddress.country}</p>
      <p>Phone: {order.shippingAddress.phone}</p>
    </div>
  );
}