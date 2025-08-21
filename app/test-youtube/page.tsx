"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import YouTubeEmbed from "../../components/YouTubeEmbed"
import { getYouTubeThumbnail, getYouTubeEmbedUrl, extractYouTubeVideoId } from "../../utils/youtube"

interface YoutubeVideo {
  id: number
  title: string
  video_url: string
  thumbnail_url: string
  is_main_video: boolean
}

export default function YouTubeTestPage() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([])
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/youtube-videos')
      const data = await response.json()
      setVideos(data)
      
      // Set the first main video as selected
      const mainVideo = data.find((video: YoutubeVideo) => video.is_main_video)
      setSelectedVideo(mainVideo || data[0] || null)
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const testUrls = [
    "https://www.youtube.com/watch?v=JmZ_ikSHFtY",
    "https://youtu.be/CW7aDbaAxUM",
    "https://www.youtube.com/shorts/YqJ4a8sG2go",
    "https://www.youtube.com/embed/dQw4w9WgXcQ"
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading YouTube videos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">YouTube Integration Test</h1>
        
        {/* Main Video Player */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Main Video Player</h2>
          <div className="max-w-4xl">
            <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
              {selectedVideo ? (
                <YouTubeEmbed
                  videoUrl={selectedVideo.video_url}
                  title={selectedVideo.title}
                  className="absolute top-0 left-0 w-full h-full"
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <p className="text-white text-lg">No video selected</p>
                </div>
              )}
            </div>
            {selectedVideo && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">{selectedVideo.title}</h3>
                <p className="text-sm text-gray-600 mt-1">Video ID: {extractYouTubeVideoId(selectedVideo.video_url)}</p>
                <p className="text-sm text-gray-600">Original URL: {selectedVideo.video_url}</p>
                <p className="text-sm text-gray-600">Embed URL: {getYouTubeEmbedUrl(selectedVideo.video_url)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Video List */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Videos ({videos.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className={`bg-white border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedVideo?.id === video.id ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative w-full h-48">
                  <Image
                    src={video.thumbnail_url || getYouTubeThumbnail(video.video_url) || "/placeholder.svg?height=192&width=320"}
                    alt={video.title}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                  {video.is_main_video && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
                      MAIN
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{video.title}</h3>
                  <p className="text-xs text-gray-500">ID: {video.id}</p>
                  <p className="text-xs text-gray-500">Video ID: {extractYouTubeVideoId(video.video_url)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* URL Testing */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">URL Format Testing</h2>
          <div className="space-y-4">
            {testUrls.map((url, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Original URL:</p>
                    <p className="text-xs text-gray-600 break-all">{url}</p>
                    <p className="text-sm font-semibold text-gray-700 mb-2 mt-3">Video ID:</p>
                    <p className="text-xs text-gray-600">{extractYouTubeVideoId(url)}</p>
                    <p className="text-sm font-semibold text-gray-700 mb-2 mt-3">Embed URL:</p>
                    <p className="text-xs text-gray-600 break-all">{getYouTubeEmbedUrl(url)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Generated Thumbnail:</p>
                    <div className="relative w-32 h-24">
                      <Image
                        src={getYouTubeThumbnail(url) || "/placeholder.svg?height=90&width=120"}
                        alt="YouTube Thumbnail"
                        fill
                        className="object-cover rounded"
                        sizes="120px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t pt-8">
          <div className="flex gap-4">
            <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Back to Homepage
            </a>
            <a href="/test-final" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Final Test Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}