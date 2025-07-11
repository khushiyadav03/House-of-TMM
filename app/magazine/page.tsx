"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MagazinePaymentModal } from "@/components/MagazinePaymentModal"
import FlipbookViewer from "@/components/FlipbookViewer"

interface Magazine {
  id: number
  title: string
  description: string
  cover_image_url: string
  pdf_file_path: string
  price: number
  issue_date: string
  created_at?: string
  updated_at?: string
}

export default function MagazinePage() {
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isFlipbookViewerOpen, setIsFlipbookViewerOpen] = useState(false)
  const [flipbookPdfUrl, setFlipbookPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMagazines() {
      try {
        const response = await fetch("/api/magazines?sort=created_at_desc")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch magazines")
        }
        const data = await response.json()
        setMagazines(data.magazines)
      } catch (err: any) {
        setError(err.message)
        console.error("Magazines fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchMagazines()
  }, [])

  const handlePurchaseClick = (magazine: Magazine) => {
    setSelectedMagazine(magazine)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false)
    // In a real app, you'd likely update user's purchased magazines or redirect
    alert("Purchase successful! You can now view the magazine.")
    if (selectedMagazine) {
      setFlipbookPdfUrl(selectedMagazine.pdf_file_path)
      setIsFlipbookViewerOpen(true)
    }
  }

  const handleViewMagazine = (magazine: Magazine) => {
    setFlipbookPdfUrl(magazine.pdf_file_path)
    setIsFlipbookViewerOpen(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading magazines...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    )
  }

  if (isFlipbookViewerOpen && flipbookPdfUrl) {
    return <FlipbookViewer pdfUrl={flipbookPdfUrl} onClose={() => setIsFlipbookViewerOpen(false)} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Magazine Issues</h1>
      <div className="magazine-grid">
        {magazines.map((magazine) => (
          <Card key={magazine.id} className="magazine-card">
            <Image
              src={magazine.cover_image_url || "/placeholder.svg?height=400&width=283"}
              alt={magazine.title}
              width={283}
              height={400}
              className="magazine-cover"
            />
            <CardContent className="magazine-info">
              <h2 className="magazine-title">{magazine.title}</h2>
              <p className="text-gray-600 text-sm mb-2">
                Issue Date: {new Date(magazine.issue_date).toLocaleDateString()}
              </p>
              <p className="magazine-price">₹{magazine.price.toFixed(2)}</p>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => handlePurchaseClick(magazine)} className="flex-1">
                  Purchase
                </Button>
                {/* This button would typically be shown only if the user has already purchased */}
                <Button variant="outline" onClick={() => handleViewMagazine(magazine)} className="flex-1">
                  View Magazine
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMagazine && (
        <MagazinePaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          magazine={selectedMagazine}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
