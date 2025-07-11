"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import MagazinePaymentModal from "@/components/MagazinePaymentModal"
import FlipbookViewer from "@/components/FlipbookViewer"
// Removed Header and Footer imports as they are now in app/layout.tsx

interface Magazine {
  id: number
  title: string
  cover_image_url: string
  price: number
  issue_date: string
  pdf_url: string // Assuming a PDF URL for the flipbook
}

export default function MagazinePage() {
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isFlipbookOpen, setIsFlipbookOpen] = useState(false)

  useEffect(() => {
    fetchMagazines()
  }, [])

  const fetchMagazines = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/magazines")
      const data = await response.json()
      // Sort magazines by issue_date in descending order (newest first)
      const sortedMagazines = (data || []).sort(
        (a: Magazine, b: Magazine) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime(),
      )
      setMagazines(sortedMagazines)
    } catch (error) {
      console.error("Failed to fetch magazines:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseClick = (magazine: Magazine) => {
    setSelectedMagazine(magazine)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false)
    if (selectedMagazine) {
      setIsFlipbookOpen(true) // Open flipbook on successful payment
    }
  }

  const handleCloseFlipbook = () => {
    setIsFlipbookOpen(false)
    setSelectedMagazine(null) // Clear selected magazine when closing flipbook
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading magazines...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Magazines</h1>

        {magazines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No magazines found at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {magazines.map((magazine) => (
              <div
                key={magazine.id}
                className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative w-full aspect-[7/10]">
                  {" "}
                  {/* Maintain aspect ratio */}
                  <Image
                    src={magazine.cover_image_url || "/placeholder.svg?height=405&width=270"}
                    alt={magazine.title}
                    fill
                    className="object-cover !rounded-none" // Ensure square edges
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
                <div className="p-4 text-center">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{magazine.title}</h2>
                  <p className="text-gray-600 text-sm mb-3">
                    Issue: {new Date(magazine.issue_date).toLocaleDateString()}
                  </p>
                  <p className="text-xl font-semibold text-gray-800 mb-4">₹{magazine.price}</p>
                  <Button onClick={() => handlePurchaseClick(magazine)} className="w-full">
                    Purchase
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMagazine && (
        <MagazinePaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          magazine={selectedMagazine}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {selectedMagazine && isFlipbookOpen && (
        <FlipbookViewer
          pdfUrl={selectedMagazine.pdf_url || "/sample-magazine.pdf"} // Use actual PDF URL if available
          isOpen={isFlipbookOpen}
          onClose={handleCloseFlipbook}
          title={selectedMagazine.title}
        />
      )}
    </div>
  )
}
