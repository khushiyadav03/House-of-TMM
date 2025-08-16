import { createClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Get actual pep_talks from database (newest first)
    const { data, error, count } = await supabase
      .from('pep_talks')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('created_at', { ascending: false }) // Newest first
      .order('display_order', { ascending: true }) // Then by display order
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('PEP Talk videos fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Format pep_talks as articles for consistency
    const formattedArticles = (data || []).map((pepTalk: any) => ({
      id: pepTalk.id,
      title: pepTalk.title,
      slug: `pep-talk-${pepTalk.id}`,
      image_url: pepTalk.image_url || '/placeholder.svg?height=400&width=600',
      author: pepTalk.author || 'TMM India',
      publish_date: pepTalk.created_at,
      excerpt: pepTalk.excerpt || pepTalk.content?.substring(0, 150) + '...',
      content: pepTalk.content,
      categories: [{ id: 0, name: 'PEP Talk', slug: 'pep-talk' }],
      is_featured: pepTalk.is_featured,
      display_order: pepTalk.display_order
    }))

    const total = count || 0
    const hasMore = offset + limit < total
    
    console.log(`[PEP Talk API] Found ${formattedArticles.length} pep talks, total: ${total}`)
    
    return NextResponse.json({
      articles: formattedArticles,
      hasMore,
      total,
      category: { id: 0, name: 'PEP Talk', slug: 'pep-talk', description: 'Inspirational PEP Talk videos' }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, author, status, scheduled_date, seo_title, seo_description, seo_keywords, image_url, excerpt, display_order, is_featured } = body;
    
    const { data, error } = await supabase
      .from('pep_talks')
      .insert({
        title,
        content,
        author,
        status: status || 'draft',
        scheduled_date,
        seo_title,
        seo_description,
        seo_keywords,
        image_url,
        excerpt,
        display_order: display_order || 0,
        is_featured: is_featured || false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Pep-talk insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, pepTalk: data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const { data, error } = await supabase
      .from('pep_talks')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Pep-talk update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, pepTalk: data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    const { error } = await supabase
      .from('pep_talks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Pep-talk delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}