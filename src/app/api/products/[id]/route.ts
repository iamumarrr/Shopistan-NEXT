import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const product = await Product.findById(params.id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  await connectDB();
  const data = await req.json();
  const product = await Product.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json({ product });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}