"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, Maximize, Minimize, ChevronLeft, ChevronRight, X } from "lucide-react"

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface FlipbookViewerProps {
  pdfUrl: string
  isOpen: boolean
  onClose: () => void
  title: string
}

export default function FlipbookViewer({ pdfUrl, isOpen, onClose, title }: FlipbookViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1) // Reset to first page on new document load
  }, [])

  const changePage = useCallback(
    (offset: number) => {
      setPageNumber((prevPageNumber) => {
        const newPage = prevPageNumber + offset
        if (numPages === null) return prevPageNumber
        return Math.max(1, Math.min(numPages, newPage))
      })
    },
    [numPages],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case "ArrowLeft":
          changePage(-1)
          break
        case "ArrowRight":
          changePage(1)
          break
        case "Escape":
          if (isFullscreen) {
            setIsFullscreen(false)
          } else {
            onClose()
          }
          break
        case "+":
          setScale((prev) => Math.min(prev + 0.2, 3))
          break
        case "-":
          setScale((prev) => Math.max(prev - 0.2, 0.5))
          break
      }
    },
    [changePage, isOpen, isFullscreen, onClose],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden" // Prevent body scrolling when modal is open
    } else {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, handleKeyDown])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`)
      })
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`)
      })
    }
  }, [])

  const handleZoom = useCallback((value: number[]) => {
    setScale(value[0] / 100) // Convert percentage to scale factor
  }, [])

  const rotateClockwise = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360)
  }, [])

  const rotateCounterClockwise = useCallback(() => {
    setRotation((prev) => (prev - 90 + 360) % 360)
  }, [])

  if (!isOpen) return null

  return (
    <div ref={viewerRef} className={`fixed inset-0 z-[9999] flex flex-col bg-gray-100 ${isFullscreen ? "p-0" : "p-4"}`}>
      {/* Top Bar with Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gray-900 text-white flex justify-between items-center shadow-lg z-50">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
            className="text-white hover:bg-gray-700"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale((prev) => Math.min(3.0, prev + 0.1))}
            className="text-white hover:bg-gray-700"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={rotateCounterClockwise} className="text-white hover:bg-gray-700">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={rotateClockwise} className="text-white hover:bg-gray-700">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-gray-700">
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-gray-700">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 flex justify-center items-center overflow-hidden relative bg-gray-800">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center items-center w-full h-full"
        >
          {numPages !== null && (
            <div className="flex h-full w-full justify-center items-center">
              {/* Render current page and potentially next page for spread */}
              {pageNumber % 2 !== 0 && pageNumber < numPages ? ( // Odd page number, show spread
                <div className="flex h-full">
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    renderAnnotationLayer={true}
                    renderTextLayer={true}
                    className="react-pdf__Page"
                  />
                  <Page
                    pageNumber={pageNumber + 1}
                    scale={scale}
                    rotate={rotation}
                    renderAnnotationLayer={true}
                    renderTextLayer={true}
                    className="react-pdf__Page"
                  />
                </div>
              ) : (
                // Even page number or last page, show single page
                <div className="flex h-full">
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    renderAnnotationLayer={true}
                    renderTextLayer={true}
                    className="react-pdf__Page"
                  />
                </div>
              )}
            </div>
          )}
        </Document>
      </div>

      {/* Footer Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900 text-white flex justify-center items-center space-x-6 shadow-lg z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => changePage(-1)}
          disabled={pageNumber === 1}
          className="text-white hover:bg-gray-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center space-x-4">
          <span className="text-sm">
            Page {pageNumber} of {numPages || "..."}
          </span>
          <Slider
            value={[pageNumber]}
            onValueChange={(val) => setPageNumber(val[0])}
            min={1}
            max={numPages || 1}
            step={1}
            className="w-32"
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => changePage(1)}
          disabled={pageNumber === numPages}
          className="text-white hover:bg-gray-700"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
