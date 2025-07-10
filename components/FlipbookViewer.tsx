"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface FlipbookViewerProps {
  pdfUrl: string
  isOpen: boolean
  onClose: () => void
  title: string
}

export default function FlipbookViewer({ pdfUrl, isOpen, onClose, title }: FlipbookViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(20) // Mock total pages

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

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Magazine Pages */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="absolute left-4 z-10 bg-white p-2 shadow-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="absolute right-4 z-10 bg-white p-2 shadow-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronRight size={24} />
        </button>

        {/* Magazine Page Display */}
        <div className="bg-white shadow-2xl max-w-4xl w-full mx-8" style={{ aspectRatio: "8.5/11" }}>
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            {/* Mock magazine page content */}
            <div className="text-center p-8">
              <h3 className="text-2xl font-bold mb-4">Page {currentPage}</h3>
              <p className="text-gray-600">
                This is a demo flipbook viewer. In a real implementation, this would display the actual PDF pages
                converted to images or use a proper PDF viewer library.
              </p>
              <div className="mt-8 space-y-4">
                <div className="bg-gray-200 h-32 w-full"></div>
                <div className="bg-gray-200 h-4 w-3/4 mx-auto"></div>
                <div className="bg-gray-200 h-4 w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="bg-white p-4 flex justify-center items-center space-x-4">
        <input
          type="range"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => setCurrentPage(Number.parseInt(e.target.value))}
          className="w-64"
        />
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            className="px-3 py-1 text-sm border border-gray-300 hover:bg-gray-50"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            className="px-3 py-1 text-sm border border-gray-300 hover:bg-gray-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  )
}
