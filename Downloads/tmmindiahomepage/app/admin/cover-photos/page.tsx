"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Pencil, Trash2, EyeOff, Eye, Upload, X, Camera, Plus } from "lucide-react"
import { useToast, ToastContainer } from "../../../components/Toast"
import AdminRoute from "../../../components/AdminRoute"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface CoverPhoto {
  id: number
  title: string
  image_url: string
  description: string
  category: string
  is_active: boolean
  display_order: number
  created_at: string
}

interface UploadedFile {
  file: File
  preview: string
  uploading: boolean
  uploaded: boolean
  error?: string
}

export default function AdminCoverPhotos() {
  const [coverPhotos, setCoverPhotos] = useState<CoverPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState<CoverPhoto | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    is_active: true,
    display_order: 0,
  })

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast()

  const categories = [
    { value: "digital-cover", label: "Digital Cover" },
    { value: "editorial-shoot", label: "Editorial Shoot" },
  ]

  useEffect(() => {
    fetchCoverPhotos()
  }, [])

  async function fetchCoverPhotos() {
    try {
      const res = await fetch("/api/cover-photos")
      const data: CoverPhoto[] = await res.json()
      setCoverPhotos(data.sort((a, b) => a.display_order - b.display_order))
    } catch (e) {
      console.error("Failed to fetch cover photos", e)
      showError("Failed to fetch cover photos")
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    files.forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError(`${file.name} is not an image file`)
        return
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        showError(`${file.name} is too large. Maximum size is 10MB`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        setUploadedFiles(prev => [...prev, {
          file,
          preview,
          uploading: false,
          uploaded: false
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async (): Promise<string[]> => {
    const uploadedUrls: string[] = []
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const fileData = uploadedFiles[i]
      if (fileData.uploaded) {
        uploadedUrls.push(fileData.preview)
        continue
      }

      setUploadedFiles(prev => prev.map((f, index) => 
        index === i ? { ...f, uploading: true } : f
      ))

      try {
        const formData = new FormData()
        formData.append('file', fileData.file)
        formData.append('folder', 'cover-photos')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const result = await response.json()
        uploadedUrls.push(result.url)

        setUploadedFiles(prev => prev.map((f, index) => 
          index === i ? { ...f, uploading: false, uploaded: true } : f
        ))
      } catch (error) {
        console.error('Upload error:', error)
        setUploadedFiles(prev => prev.map((f, index) => 
          index === i ? { ...f, uploading: false, error: 'Upload failed' } : f
        ))
        throw error
      }
    }

    return uploadedUrls
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setUploading(true)

    try {
      // Upload all files first
      const uploadedUrls = await uploadFiles()
      
      if (uploadedUrls.length === 0) {
        showError("Please select at least one image to upload")
        setUploading(false)
        return
      }

      // Create cover photos for each uploaded image
      const createPromises = uploadedUrls.map((imageUrl, index) => {
        const photoData = {
          ...formData,
          image_url: imageUrl,
          title: formData.title || `Cover Photo ${index + 1}`,
          display_order: formData.display_order + index,
        }

        const url = isEditing ? `/api/cover-photos/${currentPhoto?.id}` : "/api/cover-photos"
        const method = isEditing ? "PUT" : "POST"

        return fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(photoData),
        })
      })

      const results = await Promise.all(createPromises)
      const allSuccessful = results.every(res => res.ok)

      if (allSuccessful) {
        showSuccess(`Successfully ${isEditing ? 'updated' : 'created'} ${uploadedUrls.length} cover photo(s)`)
        resetForm()
        fetchCoverPhotos()
      } else {
        showError("Some cover photos failed to save")
      }
    } catch (error) {
      console.error("Failed to save cover photos", error)
      showError("Failed to save cover photos")
    } finally {
      setUploading(false)
    }
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      category: "",
      is_active: true,
      display_order: 0,
    })
    setUploadedFiles([])
    setCurrentPhoto(null)
    setIsEditing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function handleEdit(photo: CoverPhoto) {
    setCurrentPhoto(photo)
    setFormData({
      title: photo.title,
      description: photo.description ?? "",
      category: photo.category ?? "",
      is_active: photo.is_active,
      display_order: photo.display_order,
    })
    setIsEditing(true)
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this cover photo?")) return
    try {
      const res = await fetch(`/api/cover-photos/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      showSuccess("Cover photo deleted successfully")
      fetchCoverPhotos()
    } catch (e) {
      console.error("Failed to delete cover photo", e)
      showError("Failed to delete cover photo")
    }
  }

  async function toggleActive(id: number, isActive: boolean) {
    try {
      const res = await fetch(`/api/cover-photos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      })
      if (!res.ok) throw new Error("Toggle failed")
      showSuccess(`Cover photo ${isActive ? 'disabled' : 'enabled'} successfully`)
      fetchCoverPhotos()
    } catch (e) {
      console.error("Failed to update cover photo", e)
      showError("Failed to update cover photo")
    }
  }

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category
  }

  if (loading) {
    return (
      <AdminRoute>
        <main className="min-h-screen flex items-center justify-center">
          <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
        </main>
      </AdminRoute>
    )
  }

  return (
    <AdminRoute>
      <main className="min-h-screen bg-gray-50 py-10 px-4 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">Cover Photos Management</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ----------------------------- Form ----------------------------- */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {isEditing ? "Edit Cover Photo" : "Add New Cover Photos"}
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Title (optional - will auto-generate if empty)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                
                <Textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Display Order"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: Number(e.target.value),
                    })
                  }
                  min={0}
                />

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <label htmlFor="is_active" className="text-sm">
                    Active
                  </label>
                </div>

                {/* File Upload Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Upload Images</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Select Files
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Uploaded Files Preview */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        {uploadedFiles.length} file(s) selected
                      </p>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                        {uploadedFiles.map((fileData, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={fileData.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            {fileData.uploading && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              </div>
                            )}
                            {fileData.error && (
                              <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1 text-center">
                                Error
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={uploading || uploadedFiles.length === 0}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isEditing ? "Updating..." : "Uploading..."}
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        {isEditing ? "Update" : "Save"}
                      </>
                    )}
                  </Button>
                  {isEditing && (
                    <Button type="button" variant="secondary" onClick={resetForm} className="flex-1">
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* ------------------------ Existing Photos ----------------------- */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Cover Photos ({coverPhotos.length})</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const digitalCover = coverPhotos.filter(p => p.category === 'digital-cover')
                    const editorialShoot = coverPhotos.filter(p => p.category === 'editorial-shoot')
                    showInfo(`Digital Cover: ${digitalCover.length}, Editorial Shoot: ${editorialShoot.length}`)
                  }}
                >
                  View Stats
                </Button>
              </div>
            </div>

            {coverPhotos.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No cover photos yet.</p>
                  <p className="text-sm text-gray-400">Upload your first cover photo to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {coverPhotos.map((photo) => (
                  <Card key={photo.id}>
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <img
                          src={photo.image_url || "/placeholder.svg"}
                          alt={photo.title}
                          className="h-48 w-full object-cover rounded"
                        />
                        <div className="absolute top-2 left-2">
                          <span className={cn(
                            "text-xs px-2 py-1 rounded font-bold",
                            photo.category === 'digital-cover' 
                              ? "bg-blue-500 text-white" 
                              : "bg-purple-500 text-white"
                          )}>
                            {getCategoryLabel(photo.category)}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className={cn(
                            "text-xs px-2 py-1 rounded",
                            photo.is_active 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          )}>
                            {photo.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold line-clamp-1">{photo.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{photo.description}</p>
                        <p className="text-xs text-gray-500">Order: {photo.display_order}</p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <Button size="sm" onClick={() => handleEdit(photo)} variant="secondary">
                            <Pencil className="mr-1 h-4 w-4" /> Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(photo.id)}>
                            <Trash2 className="mr-1 h-4 w-4" /> Delete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleActive(photo.id, photo.is_active)}
                            className={cn(
                              photo.is_active ? "text-green-600 hover:bg-green-50" : "text-gray-500 hover:bg-gray-50",
                            )}
                          >
                            {photo.is_active ? (
                              <>
                                <EyeOff className="mr-1 h-4 w-4" /> Disable
                              </>
                            ) : (
                              <>
                                <Eye className="mr-1 h-4 w-4" /> Enable
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </main>
    </AdminRoute>
  )
}

