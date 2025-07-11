import { NextResponse, type NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "misc" // Get folder from formData, default to 'misc'

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 })
    }

    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = `${folder}/${fileName}` // Use the specified folder

    const { data, error } = await supabase.storage.from("tmm-india-bucket").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    })

    if (error) {
      console.error("Supabase storage upload error:", error)
      return NextResponse.json({ error: `Failed to upload file: ${error.message}` }, { status: 500 })
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("tmm-india-bucket").getPublicUrl(filePath)

    if (!publicUrlData || !publicUrlData.publicUrl) {
      return NextResponse.json({ error: "Failed to get public URL for the uploaded file." }, { status: 500 })
    }

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl }, { status: 200 })
  } catch (err) {
    console.error("POST /api/upload crashed:", err)
    return NextResponse.json(
      { error: "Internal server error", details: (err as Error).message || "Unknown error" },
      { status: 500 },
    )
  }
}
