import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content_type, content_id, event_type, event_data } = body;

    if (!content_type || !content_id || !event_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('analytics')
      .insert({
        content_type,
        content_id,
        event_type,
        event_data: event_data || {},
      })
      .select();

    if (error) throw error;

    // If this is a view event, also update the view count on the content
    if (event_type === 'view' && content_type === 'article') {
      await supabase.rpc('increment_article_views', { article_id: content_id });
    } else if (event_type === 'view' && content_type === 'magazine') {
      await supabase.rpc('increment_magazine_views', { magazine_id: content_id });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}