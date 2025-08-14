"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import RazorpayPaymentModal from "../../components/RazorpayPaymentModal"
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ChevronUp } from "lucide-react";
const FlipbookViewer = dynamic(() => import('../../components/FlipbookViewer'), { ssr: false });

interface Magazine {
    id: number
    title: string
    issue_date: string
    cover_image_url: string
    pdf_url: string // Use this field for the PDF URL
    price: number
    year?: number // Year extracted from issue_date
    is_paid: boolean
}

export default function MagazineClientPage() {
    const [magazines, setMagazines] = useState<Magazine[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null)
    const [isFlipbookOpen, setIsFlipbookOpen] = useState(false)
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [purchasedMagazines, setPurchasedMagazines] = useState<number[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const observer = useRef<IntersectionObserver | null>(null)
    const router = useRouter();

    // Group magazines by year
    const magazinesByYear = magazines.reduce<Record<number, Magazine[]>>((acc, magazine) => {
        const year = new Date(magazine.issue_date).getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push({ ...magazine, year });
        return acc;
    }, {});

    // Sort years in descending order
    const sortedYears = Object.keys(magazinesByYear)
        .map(Number)
        .sort((a, b) => b - a);

    useEffect(() => {
        fetchMagazines(1)

        // Load purchased magazines from localStorage
        const storedPurchases = localStorage.getItem("purchasedMagazines")
        if (storedPurchases) {
            setPurchasedMagazines(JSON.parse(storedPurchases))
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchMagazines = async (pageNum: number) => {
        try {
            if (pageNum === 1) setLoading(true);
            const response = await fetch(`/api/magazines?page=${pageNum}&limit=12`)
            const data = await response.json()
            // If the API returns an array directly, use it; otherwise, fallback to []
            const magazinesArray = Array.isArray(data) ? data : []

            if (magazinesArray.length === 0) {
                setHasMore(false);
                return;
            }

            // Sort magazines by issue_date in descending order (newest first) and map pdf_file_path to pdf_url
            const sortedMagazines = magazinesArray
                .map((magazine: any) => ({
                    ...magazine,
                    pdf_url: magazine.pdf_file_path || magazine.pdf_url // Map pdf_file_path to pdf_url
                }))
                .sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime())

            setMagazines(prev => pageNum === 1 ? sortedMagazines : [...prev, ...sortedMagazines])
            setPage(pageNum);
        } catch (error) {
            console.error("Failed to fetch magazines:", error)
            if (page === 1) setMagazines([])
        } finally {
            setLoading(false)
        }
    }

    const handlePurchaseClick = (magazine: Magazine) => {
        setSelectedMagazine(magazine)
        setIsPaymentModalOpen(true)
    }

    const handleOpenFlipbook = (magazine: Magazine) => {
        if (!magazine.is_paid || isMagazinePurchased(magazine.id)) {
            router.push(`/magazine/view/${magazine.id}`);
        } else {
            handlePurchaseClick(magazine);
        }
    }

    const lastMagazineElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchMagazines(page + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, page]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const handlePaymentSuccess = (magazineId: number) => {
        const updatedPurchases = [...purchasedMagazines, magazineId]
        setPurchasedMagazines(updatedPurchases)
        localStorage.setItem("purchasedMagazines", JSON.stringify(updatedPurchases))
        setIsPaymentModalOpen(false)
        setSelectedMagazine(null) // Clear selected magazine after purchase

        // Navigate to the magazine view after successful purchase
        router.push(`/magazine/view/${magazineId}`);
    }

    const isMagazinePurchased = (magazineId: number) => {
        return purchasedMagazines.includes(magazineId)
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
        <div className="min-h-screen bg-white relative">
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all z-50"
                    aria-label="Scroll to top"
                >
                    <ChevronUp size={24} />
                </button>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Magazines</h1>
                    <p className="text-xl text-gray-600">Explore our collection of digital magazines.</p>
                </div>

                {magazines.length === 0 && !loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No magazines found.</p>
                    </div>
                ) : (
                    <>
                        {sortedYears.map(year => (
                            <div key={year} className="mb-12">
                                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">{year}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {magazinesByYear[year].map((magazine, index) => {
                                        const isLastElement = index === magazinesByYear[year].length - 1 &&
                                            year === sortedYears[sortedYears.length - 1] &&
                                            magazines.indexOf(magazine) === magazines.length - 1;

                                        return (
                                            <div
                                                key={magazine.id}
                                                ref={isLastElement ? lastMagazineElementRef : undefined}
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
                                                        <Button
                                                            onClick={() => handleOpenFlipbook(magazine)}
                                                            className={`w-full ${!magazine.is_paid ? 'bg-green-600 hover:bg-green-700' : isMagazinePurchased(magazine.id) ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                                                        >
                                                            {!magazine.is_paid ? 'Read Free' : isMagazinePurchased(magazine.id) ? 'Read Magazine' : `Buy ₹${magazine.price.toFixed(2)}`}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Flipbook Viewer Dialog */}
            {/* Razorpay Payment Modal */}
            {selectedMagazine && (
                <RazorpayPaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    magazine={selectedMagazine}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    )
}