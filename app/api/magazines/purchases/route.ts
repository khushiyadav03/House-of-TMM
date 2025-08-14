/**
 * @file app/api/magazines/purchases/route.ts
 * @description API route to fetch user's magazine purchases.
 * This endpoint returns all magazines purchased by the authenticated user.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch user's magazine purchases
    const { data: purchases, error } = await supabase
      .from('magazine_purchases')
      .select(`
        *,
        magazines (
          id,
          title,
          cover_image_url,
          issue_date,
          price
        )
      `)
      .eq('user_id', user.id)
      .eq('payment_status', 'completed')
      .order('purchase_date', { ascending: false });

    if (error) {
      console.error('Error fetching purchases:', error);
      return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
    }

    return NextResponse.json(purchases || []);
  } catch (error) {
    console.error('Purchases API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}