import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const order = await Order.findById(id).populate('user', 'name email');
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (user.role !== 'admin' && order.user._id.toString() !== user.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  await connectDB();
  const { status } = await req.json();
  const update: any = { status };
  if (status === 'delivered') {
    update.deliveredAt = new Date();
    update.isPaid = true;
  }
  const order = await Order.findByIdAndUpdate(params.id, update, { new: true });
  return NextResponse.json({ order });
}