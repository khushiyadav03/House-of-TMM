/**
 * @file app/api/magazines/[id]/check-purchase/route.ts
 * @description API route to check if a user has purchased a specific magazine.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    return NextResponse.json({ purchased: false });
  }

  const magazineId = params.id;

  try {
    // Check if user has purchased this magazine
    const { data: purchase, error } = await supabase
      .from('magazine_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('magazine_id', magazineId)
      .eq('payment_status', 'completed')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking purchase:', error);
      return NextResponse.json({ error: 'Failed to check purchase' }, { status: 500 });
    }

    return NextResponse.json({ purchased: !!purchase });
  } catch (error) {
    console.error('Check purchase API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}