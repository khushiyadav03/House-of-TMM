"use client"

import { useState, useEffect } from "react"
import { getYouTubeEmbedUrl } from "../utils/youtube"

interface YouTubeEmbedProps {
  videoUrl: string
  title: string
  className?: string
}

export default function YouTubeEmbed({ videoUrl, title, className = "" }: YouTubeEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const embedUrl = getYouTubeEmbedUrl(videoUrl)

  // Auto-hide loading after 3 seconds if iframe doesn't load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [isLoading])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-800 ${className}`}>
        <div className="text-center text-white">
          <p className="text-lg mb-2">Video unavailable</p>
          <p className="text-sm opacity-75">{title}</p>
          <p className="text-xs mt-2 opacity-50">URL: {embedUrl}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
            <p className="text-xs mt-1 opacity-75">{title}</p>
          </div>
        </div>
      )}
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
        style={{ border: 'none' }}
      />
    </div>
  )
}