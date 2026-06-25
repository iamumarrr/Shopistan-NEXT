import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, mapOrder } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*, user:users(id,name,email)')
    .eq('id', id)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Check authorization: admin can view all, customers can only view their own
  if (user.role !== 'admin' && order.user_id !== user.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ order: mapOrder(order) });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json();

  const update: any = { status };
  if (status === 'delivered') {
    update.delivered_at = new Date().toISOString();
    update.is_paid = true;
    update.paid_at = new Date().toISOString();
  }

  const { data: updatedOrder, error } = await supabaseAdmin
    .from('orders')
    .update(update)
    .eq('id', id)
    .select('*, user:users(id,name,email)')
    .single();

  if (error || !updatedOrder) {
    return NextResponse.json({ error: error?.message ?? 'Order update failed' }, { status: 500 });
  }

  return NextResponse.json({ order: mapOrder(updatedOrder) });
}