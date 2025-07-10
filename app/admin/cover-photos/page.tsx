"use client"

import type React from "react"

import { useState, useEffect } from "react"

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
  const [coverPhotos, setCoverPhotos] = useState<CoverPhoto[]>([])
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCoverPhotos()
  }, [])

  const fetchCoverPhotos = async () => {
    try {
      const response = await fetch("/api/cover-photos")
      const data = await response.json()
      setCoverPhotos(data)
    } catch (error) {
      console.error("Failed to fetch cover photos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = isEditing ? `/api/cover-photos/${currentPhoto?.id}` : "/api/cover-photos"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchCoverPhotos()
        resetForm()
      } else {
        alert("Failed to save cover photo")
      }
    } catch (error) {
      console.error("Failed to save cover photo:", error)
      alert("Failed to save cover photo")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      image_url: "",
      description: "",
      category: "",
      is_active: true,
      display_order: 0,
    })
    setIsEditing(false)
    setCurrentPhoto(null)
  }

  const handleEdit = (photo: CoverPhoto) => {
    setCurrentPhoto(photo)
    setFormData({
      title: photo.title,
      image_url: photo.image_url,
      description: photo.description || "",
      category: photo.category || "",
      is_active: photo.is_active,
      display_order: photo.display_order,
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this cover photo?")) {
      try {
        const response = await fetch(`/api/cover-photos/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchCoverPhotos()
        } else {
          alert("Failed to delete cover photo")
        }
      } catch (error) {
        console.error("Failed to delete cover photo:", error)
        alert("Failed to delete cover photo")
      }
    }
  }

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/cover-photos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !isActive }),
      })

      if (response.ok) {
        fetchCoverPhotos()
      }
    } catch (error) {
      console.error("Failed to update cover photo:", error)
    }
  }

  const updateDisplayOrder = async (id: number, newOrder: number) => {
    try {
      const response = await fetch(`/api/cover-photos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ display_order: newOrder }),
      })

      if (response.ok) {
        fetchCoverPhotos()
      }
    } catch (error) {
      console.error("Failed to update display order:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading cover photos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cover Photos Management</h1>
          <p className="text-xl text-gray-600">Manage homepage carousel images and cover photos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cover Photo Form */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">\
