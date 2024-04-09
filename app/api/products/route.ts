import { NextResponse } from 'next/server';
import { storeClient } from '@/lib/shoper/client';

export async function GET() {
  const products = await storeClient.product.list();
  return NextResponse.json(products);
}
