"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"

interface FlipbookViewerProps {
  pdfUrl: string
  isOpen: boolean
  onClose: () => void
  title: string
}

export default function FlipbookViewer({ pdfUrl, isOpen, onClose, title }: FlipbookViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(24) // Mock total pages
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Mock magazine pages with sample content
  const mockPages = Array.from({ length: totalPages }, (_, i) => ({
    pageNumber: i + 1,
    content: `Page ${i + 1}`,
    imageUrl: `/placeholder.svg?height=405&width=270&text=Page+${i + 1}`,
  }))

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowLeft":
          prevPage()
          break
        case "ArrowRight":
          nextPage()
          break
        case "Escape":
          onClose()
          break
        case "+":
          setZoom((prev) => Math.min(prev + 0.2, 3))
          break
        case "-":
          setZoom((prev) => Math.max(prev - 0.2, 0.5))
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isOpen])

  if (!isOpen) return null

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3))
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5))
  const rotate = () => setRotation((prev) => (prev + 90) % 360)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">TMM India Magazine</span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
            Page {currentPage} of {totalPages}
          </span>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2 border-l pl-4">
            <button onClick={zoomOut} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Zoom Out">
              <ZoomOut size={18} />
            </button>
            <span className="text-sm text-gray-600 min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={zoomIn} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Zoom In">
              <ZoomIn size={18} />
            </button>
          </div>

          {/* Rotate */}
          <button onClick={rotate} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Rotate">
            <RotateCw size={18} />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 rounded transition-colors text-sm"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? "Exit" : "Full"}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Magazine Pages */}
      <div className="flex-1 flex items-center justify-center bg-gray-900 relative overflow-hidden">
        {/* Navigation Buttons */}
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="absolute left-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous Page"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="absolute right-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next Page"
        >
          <ChevronRight size={24} />
        </button>

        {/* Magazine Page Display */}
        <div
          className="bg-white shadow-2xl transition-all duration-300 ease-in-out"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg) rotateY(${currentPage % 2 === 0 ? 0 : 180}deg)`,
            transformStyle: "preserve-3d",
            perspective: "1000px",
            transition: "transform 0.6s ease-in-out",
            aspectRatio: "270/405",
            maxWidth: "270px",
            width: "90%",
            maxHeight: "90vh",
          }}
        >
          <div className="w-full h-full relative overflow-hidden">
            {/* Sample Magazine Content */}
            <div className="absolute inset-0 p-8 flex flex-col">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">TMM INDIA</h1>
                <div className="w-20 h-1 bg-red-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600 uppercase tracking-wider">
                  {currentPage === 1
                    ? "Cover Story"
                    : currentPage === 2
                      ? "Table of Contents"
                      : currentPage <= 5
                        ? "Fashion Feature"
                        : currentPage <= 10
                          ? "Lifestyle"
                          : currentPage <= 15
                            ? "Brand Spotlight"
                            : currentPage <= 20
                              ? "Interviews"
                              : "Back Cover"}
                </p>
              </div>

              {/* Page Content */}
              {currentPage === 1 ? (
                // Cover Page
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-full h-64 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg mb-6 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">COVER</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">The Future of Indian Fashion</h2>
                  <p className="text-gray-600 max-w-md">
                    Exploring the intersection of tradition and modernity in contemporary Indian style.
                  </p>
                </div>
              ) : currentPage === 2 ? (
                // Table of Contents
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-6">Contents</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span>Fashion Forward</span>
                      <span>04</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span>Lifestyle Trends</span>
                      <span>12</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span>Brand Spotlight</span>
                      <span>18</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span>Celebrity Interview</span>
                      <span>24</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Regular Pages
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4">Page {currentPage}</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-200 h-[405px] w-[270px] rounded flex items-center justify-center">
                      <span className="text-gray-500">Image Placeholder</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-gray-200 h-4 rounded"></div>
                      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      This is a sample magazine page demonstrating the flipbook viewer functionality. In a real
                      implementation, this would display the actual PDF content or pre-rendered page images.
                    </p>
                    <div className="bg-gray-100 p-4 rounded">
                      <h3 className="font-semibold mb-2">Featured Content</h3>
                      <p className="text-sm text-gray-600">
                        Sample article content would appear here with proper formatting, images, and layout.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Page Number */}
              <div className="text-center mt-auto pt-4">
                <span className="text-xs text-gray-400">{currentPage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="bg-white p-4 flex justify-center items-center space-x-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 rounded transition-colors"
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            onClick={prevPage}
            className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 rounded transition-colors"
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => setCurrentPage(Number.parseInt(e.target.value))}
            className="w-64 accent-red-600"
          />
          <div className="text-sm text-gray-600 min-w-[80px] text-center">
            {currentPage} / {totalPages}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={nextPage}
            className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 rounded transition-colors"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 rounded transition-colors"
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      </div>

      {/* Keyboard shortcuts info */}
      <div className="absolute bottom-20 left-4 bg-black/70 text-white text-xs p-2 rounded opacity-50 hover:opacity-100 transition-opacity">
        <div>← → Navigate | + - Zoom | ESC Close</div>
      </div>
    </div>
  )
}
