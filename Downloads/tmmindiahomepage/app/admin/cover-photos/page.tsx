"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Pencil, Trash2, EyeOff, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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

export default function AdminCoverPhotos() {
  /* ----------------------------------------------------------------------
   * State
   * ------------------------------------------------------------------- */
  const [coverPhotos, setCoverPhotos] = useState<CoverPhoto[]>([])
  const [loading, setLoading] = useState(true)

  const [isEditing, setIsEditing] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState<CoverPhoto | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    description: "",
    category: "",
    is_active: true,
    display_order: 0,
  })

  /* ----------------------------------------------------------------------
   * CRUD helpers
   * ------------------------------------------------------------------- */
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
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const url = isEditing ? `/api/cover-photos/${currentPhoto?.id}` : "/api/cover-photos"
    const method = isEditing ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Request failed")
      resetForm()
      fetchCoverPhotos()
    } catch (e) {
      console.error("Failed to save cover photo", e)
      alert("Failed to save cover photo")
    }
  }

  function resetForm() {
    setFormData({
      title: "",
      image_url: "",
      description: "",
      category: "",
      is_active: true,
      display_order: 0,
    })
    setCurrentPhoto(null)
    setIsEditing(false)
  }

  function handleEdit(photo: CoverPhoto) {
    setCurrentPhoto(photo)
    setFormData({
      title: photo.title,
      image_url: photo.image_url,
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
      fetchCoverPhotos()
    } catch (e) {
      console.error("Failed to delete cover photo", e)
      alert("Failed to delete cover photo")
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
      fetchCoverPhotos()
    } catch (e) {
      console.error("Failed to update cover photo", e)
    }
  }

  /* ----------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------- */
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Cover Photos Management</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ----------------------------- Form ----------------------------- */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-xl font-semibold">{isEditing ? "Edit Cover Photo" : "Add New Cover Photo"}</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Input
                placeholder="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
              />
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Input
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
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

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  {isEditing ? "Update" : "Save"}
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
          {coverPhotos.length === 0 ? (
            <p>No cover photos yet.</p>
          ) : (
            coverPhotos.map((photo) => (
              <Card key={photo.id}>
                <CardContent className="flex flex-col md:flex-row gap-6 p-4">
                  <img
                    src={photo.image_url || "/placeholder.svg"}
                    alt={photo.title}
                    className="h-40 w-full md:w-56 object-cover rounded"
                  />

                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">{photo.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{photo.description}</p>
                    <p className="text-xs text-gray-500">
                      Category: <span className="font-medium">{photo.category}</span>
                    </p>
                    <p className="text-xs text-gray-500">Order: {photo.display_order}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
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
            ))
          )}
        </section>
      </div>
    </main>
  )
}
