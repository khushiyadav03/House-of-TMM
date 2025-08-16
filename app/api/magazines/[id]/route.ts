import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { 
      title, 
      description, 
      cover_image_url, 
      pdf_file_path, 
      price, 
      issue_date, 
      status,
      is_paid,
      seo_title,
      seo_description,
      seo_keywords = [],
      alt_text,
      scheduled_date
    } = body

    const { error } = await supabase
      .from("magazines")
      .update({
        title,
        description,
        cover_image_url,
        pdf_file_path,
        price,
        issue_date,
        status,
        is_paid,
        seo_title,
        seo_description,
        seo_keywords,
        alt_text,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (error) {
      console.error("Magazine update error:", error)
      return NextResponse.json({ error: "Failed to update magazine" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("magazines").delete().eq("id", params.id)

    if (error) {
      console.error("Magazine delete error:", error)
      return NextResponse.json({ error: "Failed to delete magazine" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from("magazines")
      .select("*")
      .eq("id", params.id)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "Magazine not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
