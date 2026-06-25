import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();
    if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

    const productIds = items.map((item: any) => item.product);
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .in('id', productIds);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let subtotal = 0;
    for (const item of items) {
      const product = (products ?? []).find((p: any) => p.id === item.product);
      if (product) subtotal += Number(product.price ?? 0) * item.quantity;
    }

    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.1;
    const amount = Math.round((subtotal + shipping + tax) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
