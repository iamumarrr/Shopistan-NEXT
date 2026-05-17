import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  // Guest checkout allowed, so we don't return 401 if !user
  
  await connectDB();
  const { items, shippingAddress, paymentMethod } = await req.json();

  if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

  // Validate stock & prices server-side
  let itemsPrice = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) return NextResponse.json({ error: `Product not found` }, { status: 400 });
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for ${product.name}` },
        { status: 400 }
      );
    }
    itemsPrice += product.price * item.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: item.quantity,
    });
  }

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = +(itemsPrice * 0.1).toFixed(2);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: user?.userId || undefined,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  // Decrement stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  // Handle Stripe Payment Intent
  let clientSecret = null;
  if (paymentMethod === 'STRIPE') {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: 'usd',
      metadata: { orderId: order._id.toString() },
      automatic_payment_methods: { enabled: true },
    });
    clientSecret = paymentIntent.client_secret;
  }

  return NextResponse.json({ order, clientSecret });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const orders =
    user.role === 'admin'
      ? await Order.find().populate('user', 'name email').sort('-createdAt')
      : await Order.find({ user: user.userId }).sort('-createdAt');

  return NextResponse.json({ orders });
}