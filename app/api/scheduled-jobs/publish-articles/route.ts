import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { data: scheduledArticles, error: fetchError } = await supabaseAdmin
      .from("articles")
      .select("*")
      .eq("status", "scheduled")
      .lte("scheduled_date", new Date().toISOString());

    if (fetchError) throw fetchError;

    if (scheduledArticles && scheduledArticles.length > 0) {
      const updates = scheduledArticles.map(async (article) => {
        const { error: updateError } = await supabaseAdmin
          .from("articles")
          .update({ status: "published", publish_date: new Date().toISOString() })
          .eq("id", article.id);

        if (updateError) throw updateError;
      });

      await Promise.all(updates);
    }

    return NextResponse.json({ message: "Scheduled articles published successfully", count: scheduledArticles?.length || 0 });
  } catch (error) {
    console.error("Error publishing scheduled articles:", error);
    return NextResponse.json({ error: "Failed to publish scheduled articles" }, { status: 500 });
  }
}