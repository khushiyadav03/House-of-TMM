"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button" // Corrected import for Button

interface FlipbookViewerProps {
  pdfUrl: string
  isOpen: boolean
  onClose: () => void
  title: string
}

export default function FlipbookViewer({ pdfUrl, isOpen, onClose, title }: FlipbookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [pages, setPages] = useState<string[]>([]) // Array of image URLs for pages
  const viewerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Mock PDF loading and page generation (replace with actual PDF rendering logic)
  useEffect(() => {
    // In a real application, you would use a library like pdf.js to render PDF pages to canvas/images
    // For this example, we'll simulate pages with placeholder images
    const mockPages = Array.from({ length: 10 }, (_, i) => `/placeholder.svg?height=800&width=600&text=Page%20${i + 1}`)
    setPages(mockPages)
  }, [pdfUrl])

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
          goToPreviousPage()
          break
        case "ArrowRight":
          goToNextPage()
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

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1))
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0))
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

  if (!isOpen) return null

  if (pages.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">Loading magazine...</div>
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
            Page {currentPage + 1} of {pages.length}
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
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="absolute left-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous Page"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={goToNextPage}
          disabled={currentPage === pages.length - 1}
          className="absolute right-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next Page"
        >
          <ChevronRight size={24} />
        </button>

        {/* Magazine Page Display */}
        <div ref={viewerRef} className="relative w-full h-full max-w-[600px] max-h-[800px] overflow-hidden shadow-lg">
          {pages.map((pageSrc, index) => (
            <div
              key={index}
              className={`absolute inset-0 backface-hidden transition-transform duration-700 ease-in-out transform-gpu ${
                index === currentPage
                  ? "z-10 rotate-y-0"
                  : index < currentPage
                    ? "z-0 rotate-y-180" // Page has turned
                    : "z-0 rotate-y-0" // Page is yet to turn
              }`}
              style={{
                transformOrigin: "left center",
                // Basic page turn effect:
                // When current page, it's flat (rotateY(0))
                // When it's a previous page, it's "flipped" (rotateY(180deg))
                // This is a simplified visual. A true flipbook needs more complex 3D transforms and z-indexing.
              }}
            >
              <Image
                src={pageSrc || "/placeholder.svg"}
                alt={`Magazine Page ${index + 1}`}
                fill
                className="object-contain"
                priority={index === currentPage || index === currentPage + 1} // Prioritize current and next page
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="bg-white p-4 flex justify-center items-center space-x-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <Button onClick={() => setCurrentPage(0)} disabled={currentPage === 0}>
            <ChevronLeft className="h-5 w-5" />
            First
          </Button>
          <Button onClick={goToPreviousPage} disabled={currentPage === 0}>
            <ChevronLeft className="h-5 w-5" />
            Previous
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="1"
            max={pages.length}
            value={currentPage + 1}
            onChange={(e) => setCurrentPage(Number.parseInt(e.target.value) - 1)}
            className="w-64 accent-red-600"
          />
          <div className="text-sm text-gray-600 min-w-[80px] text-center">
            {currentPage + 1} / {pages.length}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button onClick={goToNextPage} disabled={currentPage === pages.length - 1}>
            Next
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button onClick={() => setCurrentPage(pages.length - 1)} disabled={currentPage === pages.length - 1}>
            Last
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Keyboard shortcuts info */}
      <div className="absolute bottom-20 left-4 bg-black/70 text-white text-xs p-2 rounded opacity-50 hover:opacity-100 transition-opacity">
        <div>← → Navigate | + - Zoom | ESC Close</div>
      </div>
    </div>
  )
}
