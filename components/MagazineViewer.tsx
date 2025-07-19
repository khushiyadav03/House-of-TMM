"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Plus, Minus, Maximize2, Copy, Grid, Share2, ChevronLeft, ChevronRight, Layout, LayoutPanelLeft } from "lucide-react";
import HTMLFlipBook from 'react-pageflip';

interface MagazineViewerProps {
  pdfUrl: string;
  title: string;
}

export default function MagazineViewer({ pdfUrl, title }: MagazineViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [doublePage, setDoublePage] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  // Calculate available height for the PDF page (subtract only the page indicator if needed)
  const [pageHeight, setPageHeight] = useState(0);
  // Add state for animation direction
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && pdfjs.GlobalWorkerOptions) {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    }
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      // Only subtract the height of the page indicator (e.g., 48px), no extra padding
      setPageHeight(window.innerHeight - 48);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Fix zoom: adjust pageHeight by zoom factor
  const effectivePageHeight = Math.round(pageHeight * zoom);

  // Fullscreen logic
  const handleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (viewerRef.current?.requestFullscreen) {
        viewerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, [isFullscreen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goToPrevPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, numPages, doublePage]);

  // Navigation
  const goToNextPage = useCallback(() => {
    setFlipDirection('next');
    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipping(false);
      setFlipDirection(null);
      if (currentPage === 1 && numPages > 1) {
        setCurrentPage(2);
      } else if (currentPage + 2 <= numPages) {
        setCurrentPage(currentPage + 2);
      } else if (currentPage + 1 < numPages) {
        setCurrentPage(currentPage + 1);
      }
    }, 600); // match animation duration
  }, [currentPage, numPages]);

  const goToPrevPage = useCallback(() => {
    setFlipDirection('prev');
    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipping(false);
      setFlipDirection(null);
      if (currentPage === 2) {
        setCurrentPage(1);
      } else if (currentPage > 2) {
        setCurrentPage(currentPage - 2);
      }
    }, 600);
  }, [currentPage]);

  // Zoom
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));

  // Share (copy link)
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  // Grid view toggle
  const handleGridToggle = () => setShowGrid((g) => !g);

  // 3D flip animation CSS
  const flipClass = isFlipping && flipDirection ? `page-flip-${flipDirection}` : '';

  // Helper to check if a page is in the visible set
  const isVisiblePage = (i: number) => {
    if (currentPage === 1) return i === 1;
    if (currentPage < numPages) return i === currentPage || i === currentPage + 1;
    return i === currentPage;
  };
  // Pre-render current, next, and previous pages
  const renderPages = () => {
    if (showGrid) {
      return (
        <div className="flex flex-wrap justify-center items-center w-full h-full overflow-y-auto" style={{padding:0,margin:0}}>
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="border bg-white shadow rounded overflow-hidden cursor-pointer m-2" onClick={() => { setCurrentPage(i + 1); setShowGrid(false); }}>
              <Page
                pageNumber={i + 1}
                height={120}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
              <div className="text-center text-xs py-1">{i + 1}</div>
            </div>
          ))}
        </div>
      );
    }
    if (currentPage === 1) {
      return (
        <div className="flex-1 flex justify-center items-center" style={{ minWidth: '100%', padding:0, margin:0 }}>
          <Page
            key={1}
            pageNumber={1}
            height={effectivePageHeight}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            className="bg-white shadow-2xl rounded"
          />
        </div>
      );
    }
    if (currentPage < numPages) {
      return (
        <div className="flex flex-row" style={{ minWidth: '100%', padding:0, margin:0 }}>
          <div className="flex-1 flex justify-center items-center" style={{padding:0,margin:0}}>
            <Page
              key={currentPage}
              pageNumber={currentPage}
              height={effectivePageHeight}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="bg-white shadow-2xl rounded"
            />
          </div>
          <div className="flex-1 flex justify-center items-center" style={{padding:0,margin:0}}>
            {currentPage + 1 <= numPages && (
              <Page
                key={currentPage + 1}
                pageNumber={currentPage + 1}
                height={effectivePageHeight}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="bg-white shadow-2xl rounded"
              />
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="flex-1 flex justify-center items-center" style={{ minWidth: '100%', padding:0, margin:0 }}>
        <Page
          key={currentPage}
          pageNumber={currentPage}
          height={effectivePageHeight}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          className="bg-white shadow-2xl rounded"
        />
      </div>
    );
  };

  return (
    <div ref={viewerRef} className="fixed inset-0 bg-neutral-900 flex flex-row w-full h-full z-50" style={{padding:0,margin:0}}>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 py-0 px-2 bg-black/80 text-white items-center justify-start min-w-[56px] max-w-[56px] h-full z-50">
        <button onClick={goToPrevPage} title="Previous Page" className="p-2 hover:bg-white/10 rounded"><ChevronLeft size={22} /></button>
        <button onClick={goToNextPage} title="Next Page" className="p-2 hover:bg-white/10 rounded"><ChevronRight size={22} /></button>
        <button onClick={handleZoomIn} title="Zoom In" className="p-2 hover:bg-white/10 rounded"><Plus size={22} /></button>
        <button onClick={handleZoomOut} title="Zoom Out" className="p-2 hover:bg-white/10 rounded"><Minus size={22} /></button>
        <button onClick={handleFullscreen} title="Fullscreen" className="p-2 hover:bg-white/10 rounded"><Maximize2 size={22} /></button>
        <button onClick={handleGridToggle} title="Grid View" className={`p-2 hover:bg-white/10 rounded ${showGrid ? 'bg-white/20' : ''}`}><Grid size={22} /></button>
        <button onClick={handleCopyLink} title="Copy Link" className="p-2 hover:bg-white/10 rounded"><Share2 size={22} /></button>
      </div>
      {/* Main Viewer */}
      <div className="flex-1 flex flex-col items-center justify-center w-full h-full overflow-hidden relative" style={{padding:0,margin:0}}>
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className="text-white">Loading magazine...</div>}
          error={<div className="text-red-500">Failed to load PDF.</div>}
        >
          {renderPages()}
        </Document>
        {/* Floating page indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-1 rounded-full text-sm shadow-lg pointer-events-none select-none">
          Page {currentPage}{currentPage !== 1 && currentPage < numPages && currentPage + 1 <= numPages ? `-${currentPage + 1}` : ''} / {numPages}
        </div>
      </div>
    </div>
  );
} 