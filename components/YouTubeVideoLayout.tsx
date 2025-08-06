"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"

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

interface YouTubeVideoLayoutProps {
  categoryName: string
  categorySlug: string
  description: string
  children?: React.ReactNode
}

export default function YouTubeVideoLayout({
  categoryName,
  categorySlug,
  description,
  children,
}: YouTubeVideoLayoutProps) {
  const videosPerPage = 12
  const [videos, setVideos] = useState<YoutubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideo | null>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    fetchVideos()
  }, [currentPage])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/youtube-videos`)
      const data = await response.json()
      
      // Filter only active videos
      const activeVideos = data.filter((video: YoutubeVideo) => video.is_active)
      
      setVideos(activeVideos)
      setTotalPages(Math.ceil(activeVideos.length / videosPerPage))
    } catch (error) {
      console.error("Failed to fetch videos:", error)
      setVideos([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleVideoClick = (video: YoutubeVideo) => {
    setSelectedVideo(video)
    setIsFullScreen(true)
  }

  const closeFullScreen = () => {
    setIsFullScreen(false)
  }

  // Get current videos for pagination
  const currentVideos = videos.slice(
    (currentPage - 1) * videosPerPage,
    currentPage * videosPerPage
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Loading {categoryName} videos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {isFullScreen && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-5xl mx-auto">
            <button
              onClick={closeFullScreen}
              className="absolute top-4 right-4 text-white bg-red-600 rounded-full p-2 z-10"
            >
              ✕
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={selectedVideo.video_url}
                title={selectedVideo.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{categoryName}</h1>
          <p className="text-xl text-gray-600">{description}</p>
        </div>

        {currentVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No {categoryName.toLowerCase()} videos found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentVideos.map((video) => (
                <div
                  key={video.id}
                  className="cursor-pointer group"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="relative w-full aspect-video group overflow-hidden shadow bg-gray-100 mb-3">
                    {/* PEP Talk badge */}
                    <span
                      className="absolute top-4 left-4 px-3 py-1 text-sm font-semibold text-white bg-indigo-700 !rounded-none"
                      style={{ borderRadius: 0 }}
                    >
                      PEP Talk
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="h-16 w-16 text-white" />
                    </div>
                    <Image
                      src={video.thumbnail_url || "/placeholder.svg?height=800&width=600"}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl card-image"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{video.title}</h2>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>TMM India</span>
                    <span>{new Date(video.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded ${
                      currentPage === page ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}

        {children}
      </div>
    </div>
  )
}