import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Missing environment variables',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseServiceKey
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Test database connection
    const { data, error } = await supabase
      .from('articles')
      .select('id')
      .limit(1)

    if (error) {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Database connection successful!',
      hasData: data && data.length > 0
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}