"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Edit, Trash2, Eye, EyeOff, Play, Star, List } from "lucide-react"
import Footer from "../../../components/Footer"

interface YoutubeVideo {
  id: number
  title: string
  video_url: string
  thumbnail_url: string
  is_main_video: boolean
  display_order: number
  is_active: boolean
  created_at: string
}

export default function AdminYoutubeVideos() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<YoutubeVideo | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    video_url: "",
    thumbnail_url: "",
    is_main_video: false,
    display_order: 0,
    is_active: true,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/youtube-videos")
      const data = await response.json()
      setVideos(data)
    } catch (error) {
      console.error("Failed to fetch videos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = isEditing ? `/api/youtube-videos/${currentVideo?.id}` : "/api/youtube-videos"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchVideos()
        resetForm()
      } else {
        alert("Failed to save video")
      }
    } catch (error) {
      console.error("Failed to save video:", error)
      alert("Failed to save video")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      video_url: "",
      thumbnail_url: "",
      is_main_video: false,
      display_order: 0,
      is_active: true,
    })
    setIsEditing(false)
    setCurrentVideo(null)
  }

  const handleEdit = (video: YoutubeVideo) => {
    setCurrentVideo(video)
    setFormData({
      title: video.title,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || "",
      is_main_video: video.is_main_video,
      display_order: video.display_order,
      is_active: video.is_active,
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this video?")) {
      try {
        const response = await fetch(`/api/youtube-videos/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchVideos()
        } else {
          alert("Failed to delete video")
        }
      } catch (error) {
        console.error("Failed to delete video:", error)
        alert("Failed to delete video")
      }
    }
  }

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/youtube-videos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !isActive }),
      })

      if (response.ok) {
        fetchVideos()
      }
    } catch (error) {
      console.error("Failed to update video:", error)
    }
  }

  const setAsMainVideo = async (id: number) => {
    try {
      const response = await fetch(`/api/youtube-videos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_main_video: true }),
      })

      if (response.ok) {
        fetchVideos()
      }
    } catch (error) {
      console.error("Failed to set main video:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading videos...</p>
        </div>
      </div>
    )
  }

  const mainVideo = videos.find((video) => video.is_main_video)
  const recommendedVideos = videos.filter((video) => !video.is_main_video)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">YouTube Videos Management</h1>
          <p className="text-xl text-gray-600">Manage homepage video content and recommendations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Form */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Play className="h-6 w-6" />
                {isEditing ? "Edit Video" : "Add New Video"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                    placeholder="Video title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video URL *</label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, video_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
                  <input
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, thumbnail_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    min="0"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={formData.is_main_video}
                      onChange={(e) => setFormData((prev) => ({ ...prev, is_main_video: e.target.checked }))}
                      className="mr-2"
                    />
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    Main Video
                  </label>

                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                      className="mr-2"
                    />
                    Active
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {isEditing ? "Update Video" : "Add Video"}
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

          {/* Videos List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold">Videos ({videos.length})</h2>
              </div>

              {/* Main Video Section */}
              {mainVideo && (
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                  <div className="flex items-center mb-3">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-yellow-800">Main Featured Video</h3>
                    <span className="ml-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                      FEATURED
                    </span>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="relative w-32 h-20 flex-shrink-0">
                      <Image
                        src={mainVideo.thumbnail_url || "/placeholder.svg?height=80&width=120"}
                        alt={mainVideo.title}
                        fill
                        className="object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-yellow-500 bg-opacity-20 rounded"></div>
                      <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">
                        MAIN
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-semibold text-gray-900">{mainVideo.title}</h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                mainVideo.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {mainVideo.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">Order: {mainVideo.display_order}</p>
                          <p className="text-xs text-gray-400 break-all">{mainVideo.video_url}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Created: {new Date(mainVideo.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(mainVideo)}
                              className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(mainVideo.id)}
                              className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleActive(mainVideo.id, mainVideo.is_active)}
                              className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1 ${
                                mainVideo.is_active
                                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  : "bg-green-500 text-white hover:bg-green-600"
                              }`}
                            >
                              {mainVideo.is_active ? (
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
                </div>
              )}

              {/* Recommended Videos Section */}
              <div className="px-6 py-4">
                <div className="flex items-center mb-3">
                  <List className="h-5 w-5 mr-2 text-blue-500" />
                  <h3 className="text-lg font-semibold text-blue-800">Recommended Videos</h3>
                  <span className="ml-3 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                    {recommendedVideos.length}/7
                  </span>
                </div>
              <div className="divide-y divide-gray-200">
                  {recommendedVideos.map((video) => (
                    <div key={video.id} className="py-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-32 h-20 flex-shrink-0">
                        <Image
                          src={video.thumbnail_url || "/placeholder.svg?height=80&width=120"}
                          alt={video.title}
                          fill
                          className="object-cover rounded"
                        />
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded"></div>
                          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">
                            REC
                          </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-semibold text-gray-900">{video.title}</h4>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  video.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {video.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">Order: {video.display_order}</p>
                            <p className="text-xs text-gray-400 break-all">{video.video_url}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Created: {new Date(video.created_at).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex flex-col space-y-2 ml-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(video)}
                                className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                              >
                                <Edit className="h-3 w-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(video.id)}
                                className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </button>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleActive(video.id, video.is_active)}
                                className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1 ${
                                  video.is_active
                                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                              >
                                {video.is_active ? (
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
                                <button
                                  onClick={() => setAsMainVideo(video.id)}
                                  className="bg-purple-500 text-white px-3 py-1 text-sm rounded hover:bg-purple-600 transition-colors flex items-center gap-1"
                                >
                                  <Star className="h-3 w-3" />
                                  Set Main
                                </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                  {recommendedVideos.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                      <List className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg">No recommended videos</p>
                      <p className="text-sm">Add videos to create recommendations</p>
                    </div>
                  )}
                </div>
              </div>

                {videos.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    <Play className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg">No videos found</p>
                    <p className="text-sm">Add your first video to get started</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
