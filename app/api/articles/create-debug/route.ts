import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client with service role for write operations (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  console.log('DEBUG: Received request to create-debug endpoint');
  try {
    const body = await request.json()
    console.log('DEBUG: Request body:', body);
    
    const {
      title,
      slug,
      content,
      excerpt,
      image_url,
      author,
      publish_date,
      featured = false,
      categories = [],
      status = "draft",
      seo_title,
      seo_description,
      seo_keywords = [],
      alt_text,
      scheduled_date
    } = body

    if (!title || !publish_date) {
      console.log('DEBUG: Missing required fields');
      return NextResponse.json({ error: "Missing required fields: title, publish_date" }, { status: 400 })
    }

    console.log('DEBUG: Checking for existing slug:', slug);
    if (slug) {
      const { data: existingArticle } = await supabaseAdmin.from("articles").select("id").eq("slug", slug).single()

      if (existingArticle) {
        console.log('DEBUG: Slug already exists');
        return NextResponse.json({ error: "Article with this slug already exists" }, { status: 400 })
      }
    }

    console.log('DEBUG: Inserting new article with admin client');
    const { data: article, error: articleError } = await supabaseAdmin
      .from("articles")
      .insert({
        title,
        slug,
        content,
        excerpt,
        image_url,
        author,
        publish_date: status === 'scheduled' ? scheduled_date : (status === 'published' ? new Date().toISOString() : publish_date),
        featured,
        status,
        seo_title,
        seo_description,
        seo_keywords,
        alt_text,
        scheduled_date: status === 'scheduled' ? scheduled_date : null
      })
      .select()
      .single()

    if (articleError) {
      console.error("DEBUG: Article insert error:", articleError)
      return NextResponse.json({ error: "Failed to create article", details: articleError }, { status: 500 })
    }

    console.log('DEBUG: Article inserted successfully, id:', article.id);

    if (categories.length > 0) {
      console.log('DEBUG: Inserting category relations');
      const categoryRelations = categories.map((categoryId: number) => ({
        article_id: article.id,
        category_id: categoryId,
      }))

      const { error: categoryError } = await supabaseAdmin.from("article_categories").insert(categoryRelations)

      if (categoryError) {
        console.error("DEBUG: Category relation error:", categoryError)
      } else {
        console.log('DEBUG: Category relations inserted successfully');
      }
    }

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("DEBUG: API error in POST:", error)
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 })
  }
}
