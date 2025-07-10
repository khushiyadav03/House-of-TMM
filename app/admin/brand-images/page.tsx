"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Edit, Trash2, Eye, EyeOff, ImageIcon } from "lucide-react"
import Footer from "../../../components/Footer"
import ImageUpload from "../../../components/ImageUpload"

interface BrandImage {
  id: number
  title: string
  image_url: string
  display_order: number
  is_active: boolean
  created_at: string
}

export default function AdminBrandImages() {
  const [brandImages, setBrandImages] = useState<BrandImage[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentImage, setCurrentImage] = useState<BrandImage | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    display_order: 0,
    is_active: true,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBrandImages()
  }, [])

  const fetchBrandImages = async () => {
    try {
      const response = await fetch("/api/brand-images")
      const data = await response.json()
      setBrandImages(data.sort((a: BrandImage, b: BrandImage) => a.display_order - b.display_order))
    } catch (error) {
      console.error("Failed to fetch brand images:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = isEditing ? `/api/brand-images/${currentImage?.id}` : "/api/brand-images"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchBrandImages()
        resetForm()
      } else {
        alert("Failed to save brand image")
      }
    } catch (error) {
      console.error("Failed to save brand image:", error)
      alert("Failed to save brand image")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      image_url: "",
      display_order: 0,
      is_active: true,
    })
    setIsEditing(false)
    setCurrentImage(null)
  }

  const handleEdit = (image: BrandImage) => {
    setCurrentImage(image)
    setFormData({
      title: image.title,
      image_url: image.image_url,
      display_order: image.display_order,
      is_active: image.is_active,
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this brand image?")) {
      try {
        const response = await fetch(`/api/brand-images/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchBrandImages()
        } else {
          alert("Failed to delete brand image")
        }
      } catch (error) {
        console.error("Failed to delete brand image:", error)
        alert("Failed to delete brand image")
      }
    }
  }

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/brand-images/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !isActive }),
      })

      if (response.ok) {
        fetchBrandImages()
      }
    } catch (error) {
      console.error("Failed to update brand image:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading brand images...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Brand Images Management</h1>
          <p className="text-xl text-gray-600">Manage brand carousel images and partnerships</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Brand Image Form */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ImageIcon className="h-6 w-6" />
                {isEditing ? "Edit Brand Image" : "Add New Brand Image"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                    placeholder="Brand name or title"
                  />
                </div>

                <ImageUpload
                  label="Brand Image *"
                  value={formData.image_url}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    min="0"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the carousel</p>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                      className="mr-2"
                    />
                    Active (Show in carousel)
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {isEditing ? "Update Image" : "Add Image"}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Brand Images List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold">Brand Images ({brandImages.length})</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {brandImages.map((image) => (
                  <div key={image.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-24 h-16 flex-shrink-0">
                        <Image
                          src={image.image_url || "/placeholder.svg?height=64&width=96"}
                          alt={image.title}
                          fill
                          className="object-contain rounded border"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{image.title}</h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  image.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {image.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">Display Order: {image.display_order}</p>
                            <p className="text-xs text-gray-500">
                              Created: {new Date(image.created_at).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex flex-col space-y-2 ml-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(image)}
                                className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                              >
                                <Edit className="h-3 w-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(image.id)}
                                className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </button>
                            </div>
                            <button
                              onClick={() => toggleActive(image.id, image.is_active)}
                              className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1 ${
                                image.is_active
                                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  : "bg-green-500 text-white hover:bg-green-600"
                              }`}
                            >
                              {image.is_active ? (
                                <>
                                  <EyeOff className="h-3 w-3" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="h-3 w-3" />
                                  Show
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {brandImages.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg">No brand images found</p>
                    <p className="text-sm">Add your first brand image to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
