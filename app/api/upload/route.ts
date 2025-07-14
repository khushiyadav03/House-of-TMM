import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with service role for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key for admin uploads (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// File size limits (in bytes)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB for images
const MAX_PDF_SIZE = 50 * 1024 * 1024 // 50MB for PDFs

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = (formData.get("type") as string) || "image"

    console.log("Upload request:", { 
      type, 
      fileName: file?.name, 
      fileSize: file?.size, 
      fileType: file?.type 
    })

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file size
    const maxSize = type === "pdf" ? MAX_PDF_SIZE : MAX_IMAGE_SIZE
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024))
      return NextResponse.json({ 
        error: `File too large. Maximum size for ${type} files is ${maxSizeMB}MB.` 
      }, { status: 400 })
    }

    // Validate file type
    if (type === "pdf" && file.type !== "application/pdf") {
      return NextResponse.json({ 
        error: "Invalid file type. Only PDF files are allowed for magazines." 
      }, { status: 400 })
    }

    if (type === "image" && !file.type.startsWith("image/")) {
      return NextResponse.json({ 
        error: "Invalid file type. Only image files are allowed." 
      }, { status: 400 })
    }

    // Determine bucket and file path
    // Map upload type to correct bucket name
    const typeToBucket: Record<string, string> = {
      image: "article-images",
      pdf: "magazine-pdfs",
      "cover-photo": "cover-photos",
      "brand-image": "brand-images",
      "magazine-cover": "magazine-covers",
      "youtube-thumbnail": "youtube-thumbnails",
    }
    const bucketName = typeToBucket[type] || "article-images"
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const filePath = `${type}/${fileName}`

    console.log("Uploading to bucket:", bucketName, "path:", filePath)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
    })

    if (error) {
      console.error("Supabase upload error:", {
        error: error.message,
        bucket: bucketName,
        fileName: fileName,
        fileType: type,
        fileSize: file.size
      })
      return NextResponse.json({ 
        error: "Failed to upload file", 
        details: error.message,
        bucket: bucketName,
        fileType: type
      }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    console.log("Upload successful:", {
      bucket: bucketName,
      path: filePath,
      url: urlData.publicUrl
    })

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath,
      bucket: bucketName
    })

  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
