"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Footer from "../../components/Footer"
import MagazinePaymentModal from "../../components/MagazinePaymentModal"
import FlipbookViewer from "../../components/FlipbookViewer"
import type { Magazine } from "@/lib/supabase"

export default function MagazinePage() {
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showFlipbook, setShowFlipbook] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 12

  useEffect(() => {
    fetchMagazines()
  }, [])

  const fetchMagazines = async () => {
    try {
      const response = await fetch("/api/magazines")
      const data = await response.json()
      setMagazines(data)
    } catch (error) {
      console.error("Failed to fetch magazines:", error)
    }
  }

  const handleMagazineClick = (magazine: Magazine) => {
    setSelectedMagazine(magazine)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    if (selectedMagazine) {
      setShowFlipbook(true)
    }
  }

  const totalPages = Math.ceil(magazines.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const currentMagazines = magazines.slice(startIndex, startIndex + articlesPerPage)

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentMagazines.map((magazine) => (
            <div
              key={magazine.id}
              onClick={() => handleMagazineClick(magazine)}
              className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <div className="relative h-[360px] w-full">
                <Image
                  src={magazine.cover_image_url || "/placeholder.svg"}
                  alt={magazine.title}
                  width={300}
                  height={360}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white px-3 py-1 text-sm font-semibold">Magazine Issue</span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="bg-green-600 text-white px-3 py-1 text-sm font-semibold">₹{magazine.price}</span>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{magazine.title}</h2>
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
      {selectedMagazine && (
        <FlipbookViewer
          pdfUrl={selectedMagazine.pdf_url}
          isOpen={showFlipbook}
          onClose={() => {
            setShowFlipbook(false)
            setSelectedMagazine(null)
          }}
          title={selectedMagazine.title}
        />
      )}

      <Footer />
    </div>
  )
}
