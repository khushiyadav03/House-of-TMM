"use client"

import { useState, useEffect, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { X, Plus, Minus, Maximize2, Copy, ArrowUp } from "lucide-react"
import Image from "next/image"

interface FlipbookViewerProps {
  pdfUrl: string
  isOpen: boolean
  onClose: () => void
  title: string
}

export default function FlipbookViewer({ pdfUrl, isOpen, onClose, title }: FlipbookViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [bookmark, setBookmark] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(`bookmark_${title}`)
      if (saved) setBookmark(Number(saved))
    }
  }, [isOpen, title])

  useEffect(() => {
    if (scrollRef.current && numPages > 0 && bookmark > 1) {
      const pageElem = scrollRef.current.querySelector(`#pdf-page-${bookmark}`)
      if (pageElem) {
        (pageElem as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }, [numPages, bookmark])

  useEffect(() => {
    if (typeof window !== "undefined" && pdfjs.GlobalWorkerOptions) {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    }
  }, []);

  // Disable right-click/context menu
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    node.addEventListener("contextmenu", preventContextMenu);
    return () => {
      node.removeEventListener("contextmenu", preventContextMenu);
    };
  }, [isOpen, numPages]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollRef.current) return;
      if (e.key === 'PageDown' || e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToPage(currentPage + 1);
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToPage(currentPage - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPage, numPages]);

  // Scroll to a specific page
  const scrollToPage = (page: number) => {
    if (!scrollRef.current) return;
    const clamped = Math.max(1, Math.min(page, numPages));
    const pageElem = scrollRef.current.querySelector(`#page-index-${clamped - 1}`);
    if (pageElem) {
      pageElem.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(clamped);
    }
  };

  // Track current page as user scrolls
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const handleScroll = () => {
      if (!node) return;
      const pageDivs = Array.from(node.querySelectorAll('[id^="page-index-"]'));
      const scrollTop = node.scrollTop;
      let found = 1;
      for (let i = 0; i < pageDivs.length; i++) {
        if ((pageDivs[i] as HTMLElement).offsetTop - node.offsetTop - 32 > scrollTop) {
          break;
        }
        found = i + 1;
      }
      setCurrentPage(found);
      setShowBackToTop(found > 2);
    };
    node.addEventListener('scroll', handleScroll);
    return () => {
      node.removeEventListener('scroll', handleScroll);
    };
  }, [numPages, isOpen]);

  const handleBookmark = (page: number) => {
    setBookmark(page)
    localStorage.setItem(`bookmark_${title}`, String(page))
  }

  // Fullscreen logic
  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (scrollRef.current?.requestFullscreen) {
        scrollRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Share (copy link)
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  // Back to Top
  const handleBackToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-gray-300 hover:text-white bg-black/60 rounded-full shadow-lg transition-colors"
        title="Close"
      >
        <X size={28} />
      </button>
      {/* Floating Toolbar */}
      <div className="fixed top-1/2 right-8 z-50 flex flex-col gap-4 bg-black/60 p-3 rounded-lg shadow-lg items-center">
        <button onClick={handleZoomIn} title="Zoom In" className="text-white hover:text-yellow-300"><Plus size={22} /></button>
        <button onClick={handleZoomOut} title="Zoom Out" className="text-white hover:text-yellow-300"><Minus size={22} /></button>
        <button onClick={handleFullscreen} title="Fullscreen" className="text-white hover:text-yellow-300"><Maximize2 size={22} /></button>
        <button onClick={handleCopyLink} title="Copy Link" className="text-white hover:text-yellow-300"><Copy size={22} /></button>
      </div>
      {/* Floating Page Indicator */}
      <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 bg-black/70 text-white px-4 py-1 rounded-full text-sm shadow-lg pointer-events-none select-none">
        Page {currentPage} / {numPages}
      </div>
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-black/70 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors"
          title="Back to Top"
        >
          <ArrowUp size={22} />
        </button>
      )}
      {/* Fullscreen PDF Scroll View */}
      <div
        className="flex-1 overflow-y-auto flex flex-col items-center w-full h-full px-0 py-8 gap-8"
        ref={scrollRef}
        style={{ scrollSnapType: 'y mandatory' }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className="text-white">Loading magazine...</div>}
          error={<div className="text-red-500">Failed to load PDF.</div>}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <section
              key={index}
              id={`page-index-${index}`}
              className="w-full flex flex-col items-center"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Page
                pageNumber={index + 1}
                width={Math.min(900, typeof window !== 'undefined' ? window.innerWidth - 32 : 900) * zoom}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="bg-white shadow-2xl rounded"
              />
              {/* Subtle shadow between pages for premium feel */}
              {index < numPages - 1 && (
                <div className="w-full h-4 bg-gradient-to-b from-black/10 to-transparent" />
              )}
            </section>
          ))}
        </Document>
      </div>
    </div>
  )
}
