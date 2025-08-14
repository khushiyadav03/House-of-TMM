"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import MagazinePaymentModal from "@/components/MagazinePaymentModal"
import { useSwipeable } from "react-swipeable"

export default function ClientMagazine({ magazine, stripePromise }) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(0)
  const [isPurchased, setIsPurchased] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [clientSecret, setClientSecret] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkPurchase = async () => {
      try {
        const response = await fetch(`/api/magazines/${magazine.id}/check-purchase`)
        const data = await response.json()
        setIsPurchased(data.purchased)
      } catch (error) {
        console.error("Error checking purchase:", error)
      }
    }
    checkPurchase()

    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollLeft
        const pageWidth = containerRef.current.clientWidth
        const newPage = Math.round(scrollPosition / pageWidth)
        setCurrentPage(newPage)
      }
    }

    containerRef.current?.addEventListener("scroll", handleScroll)
    return () => containerRef.current?.removeEventListener("scroll", handleScroll)
  }, [magazine.id])

  const handlePurchase = async () => {
    try {
      const response = await fetch(`/api/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: magazine.price * 100, magazineId: magazine.id }),
      })
      const data = await response.json()
      setClientSecret(data.clientSecret)
      setShowPaymentModal(true)
    } catch (error) {
      console.error("Error creating payment intent:", error)
    }
  }

  const handlePaymentSuccess = () => {
    setIsPurchased(true)
    setShowPaymentModal(false)
  }

  const navigatePage = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const pageWidth = containerRef.current.clientWidth
      const newScrollPosition = containerRef.current.scrollLeft + (direction === 'right' ? pageWidth : -pageWidth)
      containerRef.current.scrollTo({ left: newScrollPosition, behavior: 'smooth' })
    }
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => navigatePage('right'),
    onSwipedRight: () => navigatePage('left'),
    trackMouse: true,
  })

  if (!magazine) return null

  const pages = magazine.pages || []

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="mr-2" /> Back
        </Button>
        <h1 className="text-xl font-bold">{magazine.title}</h1>
        {!isPurchased && (
          <Button onClick={handlePurchase}>Purchase for ${magazine.price}</Button>
        )}
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {isPurchased ? (
          <div className="w-full max-w-4xl" {...handlers}>
            <div 
              ref={containerRef}
              className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
              style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
            >
              {pages.map((page, index) => (
                <div key={index} className="flex-shrink-0 w-full snap-center">
                  <Card className="w-full aspect-[8.5/11]"> {/* Standard magazine aspect ratio */}
                    <CardContent className="p-0">
                      <img
                        src={page.image_url}
                        alt={`Page ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <Button onClick={() => navigatePage('left')} disabled={currentPage === 0}>
                <ChevronLeft />
              </Button>
              <span>Page {currentPage + 1} of {pages.length}</span>
              <Button onClick={() => navigatePage('right')} disabled={currentPage === pages.length - 1}>
                <ChevronRight />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">This magazine is available for purchase</h2>
            <p className="mb-4">Price: ${magazine.price}</p>
            <Button onClick={handlePurchase}>Buy Now</Button>
          </div>
        )}
      </main>
      {showPaymentModal && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <MagazinePaymentModal onSuccess={handlePaymentSuccess} />
        </Elements>
      )}
    </div>
  )
}