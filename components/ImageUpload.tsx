"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { XCircle } from "lucide-react"

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void
  initialImageUrl?: string
  label?: string
  folder?: string // Optional folder for organization in storage
}

export default function ImageUpload({
  onUploadSuccess,
  initialImageUrl,
  label = "Upload Image",
  folder = "misc",
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setImageUrl(URL.createObjectURL(selectedFile))
      setError(null)
    } else {
      setFile(null)
      setImageUrl(null)
    }
  }, [])

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError("Please select a file to upload.")
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder) // Pass the folder to the API route

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Image upload failed.")
      }

      const data = await response.json()
      onUploadSuccess(data.url)
      setImageUrl(data.url) // Update preview with the actual uploaded URL
      setFile(null) // Clear the file input
    } catch (err: any) {
      setError(err.message)
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }, [file, onUploadSuccess, folder])

  const handleRemoveImage = useCallback(() => {
    setImageUrl(null)
    setFile(null)
    // Optionally, call onUploadSuccess with null or a placeholder to clear the parent's state
    onUploadSuccess("")
  }, [onUploadSuccess])

  return (
    <div className="space-y-4">
      <Label htmlFor="image-upload">{label}</Label>
      <div className="flex items-center space-x-2">
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="flex-1"
          disabled={uploading}
        />
        <Button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
      {imageUrl && (
        <div className="relative w-full h-48 border rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
          <Image src={imageUrl || "/placeholder.svg"} alt="Preview" layout="fill" objectFit="contain" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            onClick={handleRemoveImage}
            aria-label="Remove image"
          >
            <XCircle className="h-6 w-6" />
          </Button>
        </div>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
