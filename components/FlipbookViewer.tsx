"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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
  onClose: () => void
}

export default function FlipbookViewer({ pdfUrl, onClose }: FlipbookViewerProps) {
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
      if (event.key === "ArrowLeft") {
        changePage(-1)
      } else if (event.key === "ArrowRight") {
        changePage(1)
      } else if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    },
    [changePage, isFullscreen],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  useEffect(() => {
    if (isFullscreen) {
      if (viewerRef.current && !document.fullscreenElement) {
        viewerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`)
          setIsFullscreen(false) // Revert if failed
        })
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.error(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`)
        })
      }
    }
  }, [isFullscreen])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
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

  const renderPage = useCallback(
    ({ pageIndex }: { pageIndex: number }) => {
      // Determine if it's a single page or a spread
      const isSinglePage = numPages === 1 || pageIndex === 0 || pageIndex === numPages - 1
      const isLeftPage = pageIndex % 2 === 0 // Assuming 0-indexed, even is left, odd is right for spreads

      return (
        <div
          className={`flipbook-page ${isSinglePage ? "w-full" : "w-1/2"} h-full flex-shrink-0`}
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: "center",
            transition: "transform 0.2s ease-out",
          }}
        >
          <Page
            pageNumber={pageIndex + 1} // react-pdf uses 1-indexed page numbers
            renderAnnotationLayer={true}
            renderTextLayer={true}
            width={isFullscreen ? window.innerWidth / (isSinglePage ? 1 : 2) : undefined}
            height={isFullscreen ? window.innerHeight : undefined}
            scale={scale}
            rotate={rotation}
            className="w-full h-full object-contain"
          />
        </div>
      )
    },
    [scale, rotation, isFullscreen, numPages],
  )

  return (
    <div ref={viewerRef} className={`fixed inset-0 z-[9999] flex flex-col bg-gray-100 ${isFullscreen ? "p-0" : "p-4"}`}>
      {/* Top Bar with Close Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button variant="ghost" size="icon" onClick={onClose} className="bg-white rounded-full shadow-md">
          <X className="h-6 w-6 text-gray-700" />
          <span className="sr-only">Close Viewer</span>
        </Button>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 flex justify-center items-center overflow-hidden relative">
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
                  {renderPage({ pageIndex: pageNumber - 1 })}
                  {renderPage({ pageIndex: pageNumber })}
                </div>
              ) : (
                // Even page number or last page, show single page
                <div className="flex h-full">{renderPage({ pageIndex: pageNumber - 1 })}</div>
              )}
            </div>
          )}
        </Document>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg z-50">
        <Button variant="ghost" size="icon" onClick={() => changePage(-1)} disabled={pageNumber === 1}>
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous Page</span>
        </Button>
        <span className="text-sm font-medium">
          Page {pageNumber} of {numPages || "..."}
        </span>
        <Button variant="ghost" size="icon" onClick={() => changePage(1)} disabled={pageNumber === numPages}>
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next Page</span>
        </Button>

        <div className="flex items-center gap-2 ml-4">
          <Button variant="ghost" size="icon" onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}>
            <ZoomOut className="h-5 w-5" />
            <span className="sr-only">Zoom Out</span>
          </Button>
          <Slider value={[scale * 100]} onValueChange={handleZoom} min={50} max={200} step={10} className="w-[100px]" />
          <Button variant="ghost" size="icon" onClick={() => setScale((prev) => Math.min(2.0, prev + 0.1))}>
            <ZoomIn className="h-5 w-5" />
            <span className="sr-only">Zoom In</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button variant="ghost" size="icon" onClick={rotateCounterClockwise}>
            <RotateCcw className="h-5 w-5" />
            <span className="sr-only">Rotate Counter-Clockwise</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={rotateClockwise}>
            <RotateCw className="h-5 w-5" />
            <span className="sr-only">Rotate Clockwise</span>
          </Button>
        </div>

        <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="ml-4">
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          <span className="sr-only">{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</span>
        </Button>
      </div>
    </div>
  )
}
