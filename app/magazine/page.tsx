"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import MagazinePaymentModal from "../../components/MagazinePaymentModal"
import FlipbookViewer from "../../components/FlipbookViewer"
import type { Magazine } from "@/lib/supabase"
import { safeJson } from "@/lib/utils"

export default function MagazinePage() {
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showFlipbook, setShowFlipbook] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const magazinesPerPage = 12 // Renamed from articlesPerPage for clarity
  const [totalPages, setTotalPagesState] = useState(1) // Declare totalPages state

  useEffect(() => {
    fetchMagazines()
  }, [currentPage])

  const fetchMagazines = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/magazines?page=${currentPage}&limit=${magazinesPerPage}&sort=created_at_desc`)
      if (!response.ok) {
        const errorData = await safeJson(response)
        throw new Error(errorData.error || "Failed to fetch magazines")
      }
      const data = await safeJson(response)
      setMagazines(data.magazines || [])
      setTotalPagesState(Math.ceil((data.total || 0) / magazinesPerPage)) // Use setTotalPagesState
    } catch (err: any) {
      setError(err.message)
      console.error("Failed to fetch magazines:", err)
      setMagazines([]) // Ensure magazines array is empty on error
      setTotalPagesState(1) // Reset total pages on error
    } finally {
      setLoading(false)
    }
  }

  const handleMagazineClick = (magazine: Magazine) => {
    setSelectedMagazine(magazine)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    if (selectedMagazine) {
      setShowFlipbook(true)
      setShowPaymentModal(false)
    }
  }

  const startIndex = (currentPage - 1) * magazinesPerPage
  const currentMagazines = magazines.slice(startIndex, startIndex + magazinesPerPage)

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading magazines...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-20">
        <div className="text-center text-red-500">
          <p className="text-lg">Error: {error}</p>
          <p className="text-sm text-gray-600">Please check your internet connection or try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Magazine</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our magazine issues, special editions, and exclusive editorial content that defines contemporary
            Indian style and culture.
          </p>
        </div>

        {magazines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No magazines found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 magazine-grid">
              {currentMagazines.map((magazine) => (
                <div
                  key={magazine.id}
                  onClick={() => handleMagazineClick(magazine)}
                  className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer rounded-none magazine-card"
                >
                  <div className="relative w-full h-[405px]">
                    <Image
                      src={magazine.cover_image_url || "/placeholder.svg?height=405&width=270"}
                      alt={magazine.title}
                      fill
                      className="object-cover magazine-cover"
                      sizes="270px"
                    />
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-green-600 text-white px-3 py-1 text-sm font-semibold">₹{magazine.price}</span>
                    </div>
                  </div>
                  <div className="p-4 magazine-info">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 magazine-title">
                      {magazine.title}
                    </h2>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{magazine.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Issue Date: {new Date(magazine.issue_date).toLocaleDateString()}</span>
                      <span className="text-green-600 font-semibold">Click to Purchase</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 ${
                      currentPage === page ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-2 text-gray-700 hover:text-gray-900"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Payment Modal */}
      {selectedMagazine && (
        <MagazinePaymentModal
          magazine={selectedMagazine}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedMagazine(null)
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Flipbook Viewer */}
      {selectedMagazine && showFlipbook && (
        <FlipbookViewer
          pdfUrl={selectedMagazine.pdf_file_path || ""}
          isOpen={showFlipbook}
          onClose={() => {
            setShowFlipbook(false)
            setSelectedMagazine(null)
          }}
          title={selectedMagazine.title}
        />
      )}
    </div>
  )
}
