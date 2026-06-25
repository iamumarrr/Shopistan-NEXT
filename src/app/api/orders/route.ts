import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, mapOrder } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const { items, shippingAddress, paymentMethod } = await req.json();

  if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

  const productIds = items.map((item: any) => item.product);
  const { data: products, error: productsError } = await supabaseAdmin
    .from('products')
    .select('*')
    .in('id', productIds);

  if (productsError) {
    return NextResponse.json({ error: productsError.message }, { status: 500 });
  }

  const productMap = new Map((products ?? []).map((product: any) => [product.id, product]));
  let itemsPrice = 0;
  const orderItems: any[] = [];

  for (const item of items) {
    const product = productMap.get(item.product);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 400 });
    }

    const stock = Number(product.stock ?? 0);
    if (stock < item.quantity) {
      return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
    }

    itemsPrice += Number(product.price ?? 0) * item.quantity;
    orderItems.push({
      product: product.id,
      name: product.name,
      image: product.images?.[0] ?? '',
      price: Number(product.price ?? 0),
      quantity: item.quantity,
    });
  }

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = +(itemsPrice * 0.1).toFixed(2);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Validate userId as UUID (simple regex)
  const isValidUuid = (id: any) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(id);
  const safeUserId = user?.userId && isValidUuid(user.userId) ? user.userId : null;

  // Resolve user UUID if not valid UUID (e.g., Google OAuth ID)
  let resolvedUserId = safeUserId;
  if (!resolvedUserId && user?.email) {
    const { data: existingUser, error: userLookupError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();
    if (!userLookupError && existingUser) {
      resolvedUserId = existingUser.id;
    }
  }

  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: resolvedUserId,
      items: orderItems,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      payment_status: 'pending',
      payment_details: {},
      items_price: itemsPrice,
      shipping_price: shippingPrice,
      tax_price: taxPrice,
      total_price: totalPrice,
      status: 'pending',
      is_paid: false,
    })
    .select('*')
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? 'Order creation failed' }, { status: 500 });
  }

  for (const item of items) {
    const product = productMap.get(item.product);
    if (product) {
      await supabaseAdmin
        .from('products')
        .update({ stock: Number(product.stock ?? 0) - item.quantity })
        .eq('id', product.id);
    }
  }

  let clientSecret = null;
  if (paymentMethod === 'STRIPE') {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: 'usd',
      metadata: { orderId: order.id },
      automatic_payment_methods: { enabled: true },
    });
    clientSecret = paymentIntent.client_secret;
  }

  return NextResponse.json({ order: mapOrder(order), clientSecret });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Validate and resolve user UUID
  const isValidUuid = (id: any) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(id);
  const safeUserId = user.userId && isValidUuid(user.userId) ? user.userId : null;
  let resolvedUserId = safeUserId;
  if (!resolvedUserId && user.email) {
    const { data: existingUser, error: userLookupError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();
    if (!userLookupError && existingUser) {
      resolvedUserId = existingUser.id;
    }
  }

  let query = supabaseAdmin
    .from('orders')
    .select('*, user:users(id,name,email)')
    .order('created_at', { ascending: false });

  if (user.role !== 'admin') {
    query = query.eq('user_id', resolvedUserId);
  }

  const { data: orders, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: (orders ?? []).map(mapOrder) });
}
