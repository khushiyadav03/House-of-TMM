"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

interface ImageUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  type?: "image" | "pdf" | "cover-photo"
  bucket?: string // <-- add this
}

export default function ImageUpload({ label, value, onChange, type = "image", bucket }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  // Initialize Supabase client (client-side, use anon key)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    if (type === "image" && !file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }
    if (type === "pdf" && file.type !== "application/pdf") {
      alert("Please select a PDF file")
      return
    }
    if (type === "cover-photo" && !file.type.startsWith("image/")) {
      alert("Please select an image file for cover photo")
      return
    }

    // Validate file size (10MB for images/cover-photo, 50MB for PDFs)
    const maxSize = type === "pdf" ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert(`File too large. Maximum size is ${type === "pdf" ? "50MB" : "10MB"}`)
      return
    }

    setUploading(true)

    try {
      // Choose bucket
      const chosenBucket =
        bucket ||
        (type === "pdf"
          ? "magazines"
          : type === "cover-photo"
          ? "cover-photos"
          : "images")

      const timestamp = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const filePath = `${type}/${timestamp}_${safeName}`

      // Upload directly to Supabase Storage
      const { data, error } = await supabase.storage
        .from(chosenBucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (error) {
        throw new Error(error.message || "Upload failed")
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(chosenBucket).getPublicUrl(filePath)
      if (!urlData?.publicUrl) {
        throw new Error("Failed to get public URL")
      }
      onChange(urlData.publicUrl)
    } catch (error) {
      console.error("Upload error:", error)
      alert(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeFile = () => {
    onChange("")
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {value ? (
        <div className="relative">
          {type === "image" ? (
            <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
              <Image
                src={value || "/placeholder.svg"}
                alt="Uploaded image"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <button
                onClick={removeFile}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-600">PDF uploaded successfully</span>
              <button onClick={removeFile} className="text-red-500 hover:text-red-600" type="button">
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your {type} here, or{" "}
                <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept={type === "image" ? "image/*" : ".pdf"}
                    onChange={handleFileSelect}
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500">Max size: {type === "pdf" ? "50MB" : "10MB"}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
