"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Play, List } from "lucide-react"

import { useToast, ToastContainer } from "../../../components/Toast"

interface PepTalkVideo {
  id: number
  title: string
  youtube_url: string
  description: string
  thumbnail_url: string
  publish_date: string
  created_at: string
  status: string
  scheduled_date?: string | null
}

export default function AdminPepTalk() {
  const [videos, setVideos] = useState<PepTalkVideo[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<PepTalkVideo | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    youtube_url: "",
    description: "",
    thumbnail_url: "",
    publish_date: new Date().toISOString().split("T")[0],
    status: "draft",
    scheduled_date: "",
  })
  const { showSuccess, showError, toasts, removeToast } = useToast()

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/pep-talk")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (!Array.isArray(data)) {
        throw new Error("Received non-array data from API")
      }
      setVideos(data)
    } catch (error) {
      console.error("Failed to fetch PEP Talk videos:", error)
      showError("Failed to load videos")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = isEditing ? `/api/pep-talk?id=${currentVideo?.id}` : "/api/pep-talk"
      const method = isEditing ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          scheduled_date: formData.status === "scheduled" ? formData.scheduled_date : null,
        }),
      })
      if (response.ok) {
        showSuccess(isEditing ? "Video updated" : "Video added")
        fetchVideos()
        resetForm()
      } else {
        showError("Failed to save video")
      }
    } catch (error) {
      showError("Failed to save video")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      youtube_url: "",
      description: "",
      thumbnail_url: "",
      publish_date: new Date().toISOString().split("T")[0],
    })
    setIsEditing(false)
    setCurrentVideo(null)
  }

  const handleEdit = (video: PepTalkVideo) => {
    setCurrentVideo(video)
    setFormData({
      title: video.title,
      youtube_url: video.youtube_url,
      description: video.description || "",
      thumbnail_url: video.thumbnail_url || "",
      publish_date: video.publish_date,
      status: video.status || "draft",
      scheduled_date: video.scheduled_date || "",
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Delete this video?")) {
      try {
        const response = await fetch(`/api/pep-talk`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
        if (response.ok) {
          showSuccess("Video deleted")
          fetchVideos()
        } else {
          showError("Failed to delete video")
        }
      } catch (error) {
        showError("Failed to delete video")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">PEP Talk Management</h1>
        <p className="text-xl text-gray-600 mb-8">Manage PEP Talk YouTube videos</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">{isEditing ? "Edit Video" : "Add New Video"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL *</label>
                <input
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date *</label>
                <input
                  type="date"
                  value={formData.publish_date}
                  onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              {formData.status === "scheduled" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
              <button type="submit" className="px-6 py-2 bg-black text-white rounded-lg">
                {isEditing ? "Update" : "Add"} Video
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <List className="h-6 w-6" />
                PEP Talk Videos ({videos.length})
              </h2>
              <div className="space-y-4">
                {videos.map((video) => (
                  <div key={video.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-gray-600">{video.youtube_url}</p>
                      <p className="text-sm text-gray-500">Published: {video.publish_date}</p>
<p className="text-sm text-gray-500">Status: {video.status.charAt(0).toUpperCase() + video.status.slice(1)}{video.status === "scheduled" && video.scheduled_date ? ` on ${new Date(video.scheduled_date).toLocaleString()}` : ""}</p>
                    </div>
                    <button onClick={() => handleEdit(video)} className="p-2 text-blue-600">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(video.id)} className="p-2 text-red-600">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}