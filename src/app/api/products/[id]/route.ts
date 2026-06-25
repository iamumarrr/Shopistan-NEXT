import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, mapProduct } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ product: mapProduct(product) });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  const data = await req.json();

  const updateData = { ...data };
  if (data.name) {
    updateData.slug = `${data.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  }

  const { data: updatedProduct, error } = await supabaseAdmin
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error || !updatedProduct) {
    return NextResponse.json({ error: error?.message ?? 'Update failed' }, { status: 500 });
  }

  return NextResponse.json({ product: mapProduct(updatedProduct) });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}