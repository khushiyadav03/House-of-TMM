"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MenuIcon, XIcon, ChevronDown } from "lucide-react"

interface Category {
  id: number
  name: string
  slug: string
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [errorCategories, setErrorCategories] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setCategories(data.categories)
      } catch (error: any) {
        setErrorCategories(error.message)
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="TMM India Logo" width={120} height={40} className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
            Home
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center text-gray-700 hover:text-gray-900 font-medium">
                Brand Feature <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/BrandFeature/fashion">Fashion</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/BrandFeature/tech-auto">Tech & Auto</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center text-gray-700 hover:text-gray-900 font-medium">
                Lifestyle <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/Lifestyle/food-drinks">Food & Drinks</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/Lifestyle/health-wellness">Health & Wellness</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/Lifestyle/fitness-selfcare">Fitness & Selfcare</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/Lifestyle/travel">Travel</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/Lifestyle/finance">Finance</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center text-gray-700 hover:text-gray-900 font-medium">
                Sports <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/sports/cricket">Cricket</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sports/golf">Golf</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sports/other-sports">Other Sports</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center text-gray-700 hover:text-gray-900 font-medium">
                Cover <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/cover/digital-cover">Digital Cover</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/cover/editorial-shoot">Editorial Shoot</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/interviews" className="text-gray-700 hover:text-gray-900 font-medium">
            Interviews
          </Link>
          <Link href="/trending" className="text-gray-700 hover:text-gray-900 font-medium">
            Trending
          </Link>
          <Link href="/magazine" className="text-gray-700 hover:text-gray-900 font-medium">
            Magazine
          </Link>
          <Link href="/admin" className="text-gray-700 hover:text-gray-900 font-medium">
            Admin
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg pb-4">
          <nav className="flex flex-col items-start px-4 space-y-2">
            <Link href="/" className="block w-full py-2 text-gray-700 hover:bg-gray-100" onClick={toggleMobileMenu}>
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-gray-700 hover:bg-gray-100">
                  Brand Feature <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem asChild>
                  <Link href="/BrandFeature/fashion" onClick={toggleMobileMenu}>
                    Fashion
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/BrandFeature/tech-auto" onClick={toggleMobileMenu}>
                    Tech & Auto
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-gray-700 hover:bg-gray-100">
                  Lifestyle <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem asChild>
                  <Link href="/Lifestyle/food-drinks" onClick={toggleMobileMenu}>
                    Food & Drinks
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/Lifestyle/health-wellness" onClick={toggleMobileMenu}>
                    Health & Wellness
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/Lifestyle/fitness-selfcare" onClick={toggleMobileMenu}>
                    Fitness & Selfcare
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/Lifestyle/travel" onClick={toggleMobileMenu}>
                    Travel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/Lifestyle/finance" onClick={toggleMobileMenu}>
                    Finance
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-gray-700 hover:bg-gray-100">
                  Sports <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem asChild>
                  <Link href="/sports/cricket" onClick={toggleMobileMenu}>
                    Cricket
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/sports/golf" onClick={toggleMobileMenu}>
                    Golf
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/sports/other-sports" onClick={toggleMobileMenu}>
                    Other Sports
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-gray-700 hover:bg-gray-100">
                  Cover <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem asChild>
                  <Link href="/cover/digital-cover" onClick={toggleMobileMenu}>
                    Digital Cover
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cover/editorial-shoot" onClick={toggleMobileMenu}>
                    Editorial Shoot
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/interviews"
              className="block w-full py-2 text-gray-700 hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              Interviews
            </Link>
            <Link
              href="/trending"
              className="block w-full py-2 text-gray-700 hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              Trending
            </Link>
            <Link
              href="/magazine"
              className="block w-full py-2 text-gray-700 hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              Magazine
            </Link>
            <Link
              href="/admin"
              className="block w-full py-2 text-gray-700 hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
