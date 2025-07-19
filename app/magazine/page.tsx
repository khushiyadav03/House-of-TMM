"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import MagazinePaymentModal from "../../components/MagazinePaymentModal"
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
const FlipbookViewer = dynamic(() => import('../../components/FlipbookViewer'), { ssr: false });
// Removed Header and Footer imports as they are now in app/layout.tsx

interface Magazine {
  id: number
  title: string
  issue_date: string
  cover_image_url: string
  pdf_file_path: string // Use this field for the PDF URL
  price: number
}

export default function MagazinePage() {
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null)
  const [isFlipbookOpen, setIsFlipbookOpen] = useState(false)
  // const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  // const [purchasedMagazines, setPurchasedMagazines] = useState<number[]>([])
  const router = useRouter();

  useEffect(() => {
    fetchMagazines()
  }, [])

  const fetchMagazines = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/magazines")
      const data = await response.json()
      // If the API returns an array directly, use it; otherwise, fallback to []
      const magazinesArray = Array.isArray(data) ? data : []
      // Sort magazines by issue_date in descending order (newest first)
      const sortedMagazines = magazinesArray.sort(
        (a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime(),
      )
      setMagazines(sortedMagazines)
    } catch (error) {
      console.error("Failed to fetch magazines:", error)
      setMagazines([])
    } finally {
      setLoading(false)
    }
  }

  // const handlePurchaseClick = (magazine: Magazine) => {
  //   setSelectedMagazine(magazine)
  //   setIsPaymentModalOpen(true)
  // }
  const handleOpenFlipbook = (magazine: Magazine) => {
    router.push(`/magazine/view/${magazine.id}`);
  }

  // const handlePaymentSuccess = (magazineId: number) => {
  //   const updatedPurchases = [...purchasedMagazines, magazineId]
  //   setPurchasedMagazines(updatedPurchases)
  //   localStorage.setItem("purchasedMagazines", JSON.stringify(updatedPurchases))
  //   setIsPaymentModalOpen(false)
  //   setSelectedMagazine(null) // Clear selected magazine after purchase
  // }

  // const isMagazinePurchased = (magazineId: number) => {
  //   return purchasedMagazines.includes(magazineId)
  // }

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Magazines</h1>
          <p className="text-xl text-gray-600">Explore our collection of digital magazines.</p>
        </div>

        {magazines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No magazines found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {magazines.map((magazine) => (
              <div
                key={magazine.id}
                className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <div className="relative w-full h-[405px]">
                  <Image
                    src={magazine.cover_image_url || "/placeholder.svg?height=405&width=270"}
                    alt={magazine.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{magazine.title}</h2>
                  <p className="text-gray-600 mb-3 text-sm">Issue Date: {magazine.issue_date}</p>
                  <div className="flex items-center justify-between">
                    <Button onClick={() => handleOpenFlipbook(magazine)} className="w-full bg-green-600 hover:bg-green-700 text-white">
                      Read Magazine
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flipbook Viewer Dialog */}
      {/*
      {selectedMagazine && isFlipbookOpen && (
        <Dialog open={isFlipbookOpen} onOpenChange={setIsFlipbookOpen}>
          <DialogContent className="max-w-4xl h-[90vh] p-0">
            <DialogTitle className="sr-only">{selectedMagazine.title}</DialogTitle>
            <FlipbookViewer
              pdfUrl={selectedMagazine.pdf_file_path}
              isOpen={isFlipbookOpen}
              onClose={() => setIsFlipbookOpen(false)}
              title={selectedMagazine.title}
            />
          </DialogContent>
        </Dialog>
      )}
      */}

      {/*
      {selectedMagazine && (
        <MagazinePaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          magazine={selectedMagazine}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
      */}
    </div>
  )
}
