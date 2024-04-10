import { NextRequest, NextResponse } from 'next/server';
import { storeClient } from '@/lib/shoper/client';
import { Product } from '@/lib/shoper/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: Product['product_id'] } }
) {
  const products = await storeClient.products.get(params.id);
  return NextResponse.json(products);
}
