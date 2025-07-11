"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Maximize } from "lucide-react"

interface FlipbookViewerProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title: string
}

export default function FlipbookViewer({ isOpen, onClose, pdfUrl, title }: FlipbookViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(20) // Demo: 20 pages
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Demo magazine pages
  const demoPages = Array.from({ length: totalPages }, (_, i) => ({
    id: i + 1,
    image: `/placeholder.svg?height=600&width=400&text=Page+${i + 1}`,
    content: i === 0 ? "Cover Page" : i === 1 ? "Table of Contents" : `Article Page ${i + 1}`,
  }))

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowLeft":
          handlePrevPage()
          break
        case "ArrowRight":
          handleNextPage()
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
  }, [isOpen, onClose])

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? "max-w-full h-full" : "max-w-4xl"} bg-black text-white p-0`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom((prev) => Math.max(prev - 0.2, 0.5))}
              className="text-white hover:bg-gray-700"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(zoom * 100)}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom((prev) => Math.min(prev + 0.2, 3))}
              className="text-white hover:bg-gray-700"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-gray-700">
              <Maximize className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-gray-700">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Magazine Pages */}
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-800">
          <div className="relative">
            {/* Current Page */}
            <div
              className="bg-white shadow-2xl transition-transform duration-300 hover:scale-105"
              style={{ transform: `scale(${zoom})` }}
            >
              <img
                src={demoPages[currentPage - 1]?.image || "/placeholder.svg"}
                alt={`Page ${currentPage}`}
                className="w-[400px] h-[600px] object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded">
                {demoPages[currentPage - 1]?.content}
              </div>
            </div>

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 text-white hover:bg-gray-700 disabled:opacity-30"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 text-white hover:bg-gray-700 disabled:opacity-30"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="text-white hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="text-white hover:bg-gray-700"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <input
              type="range"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => setCurrentPage(Number.parseInt(e.target.value))}
              className="w-32"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
