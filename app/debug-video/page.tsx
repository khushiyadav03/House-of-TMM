"use client"

import { useState, useEffect } from "react"
import YouTubeEmbed from "../../components/YouTubeEmbed"
import { getYouTubeEmbedUrl } from "../../utils/youtube"

interface YoutubeVideo {
  id: number
  title: string
  video_url: string
  thumbnail_url: string
  is_main_video: boolean
}

export default function DebugVideoPage() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([])
  const [mainVideo, setMainVideo] = useState<YoutubeVideo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/youtube-videos')
      const allVideos = await response.json()
      setVideos(allVideos)
      
      console.log('All videos:', allVideos)
      
      // Find main video (most recent one marked as main)
      const mainVideos = allVideos.filter((video: YoutubeVideo) => video.is_main_video)
      console.log('Main videos found:', mainVideos)
      
      const selectedMainVideo = mainVideos[0] || allVideos[0] || null
      console.log('Selected main video:', selectedMainVideo)
      
      setMainVideo(selectedMainVideo)
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading videos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Video Debug Page</h1>
        
        {/* Debug Info */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Debug Information</h2>
          <p><strong>Total videos:</strong> {videos.length}</p>
          <p><strong>Main videos count:</strong> {videos.filter(v => v.is_main_video).length}</p>
          <p><strong>Selected main video ID:</strong> {mainVideo?.id || 'None'}</p>
          <p><strong>Selected main video title:</strong> {mainVideo?.title || 'None'}</p>
          <p><strong>Selected main video URL:</strong> {mainVideo?.video_url || 'None'}</p>
          <p><strong>Embed URL:</strong> {mainVideo ? getYouTubeEmbedUrl(mainVideo.video_url) : 'None'}</p>
        </div>

        {/* Main Video Player */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Main Video Player Test</h2>
          <div className="max-w-4xl">
            <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
              {mainVideo ? (
                <YouTubeEmbed
                  videoUrl={mainVideo.video_url}
                  title={mainVideo.title}
                  className="absolute top-0 left-0 w-full h-full"
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800">
                  <p className="text-white text-lg">No main video found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* All Videos List */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Videos</h2>
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video.id} className={`p-4 border rounded-lg ${video.is_main_video ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-sm text-gray-600">ID: {video.id}</p>
                    <p className="text-sm text-gray-600">URL: {video.video_url}</p>
                    <p className="text-sm text-gray-600">Embed URL: {getYouTubeEmbedUrl(video.video_url)}</p>
                  </div>
                  <div className="text-right">
                    {video.is_main_video && (
                      <span className="bg-red-600 text-white px-2 py-1 text-xs rounded">MAIN VIDEO</span>
                    )}
                    <button
                      onClick={() => setMainVideo(video)}
                      className="ml-2 bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700"
                    >
                      Test This Video
                    </button>
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
            <a href="/test-youtube" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              YouTube Test Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}