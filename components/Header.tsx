"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const handleDropdownEnter = (dropdown: string) => {
    setActiveDropdown(dropdown)
  }

  const handleDropdownLeave = () => {
    setTimeout(() => {
      setActiveDropdown(null)
    }, 200)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="House of TMM" width={120} height={40} className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Cover Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter("cover")}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="flex items-center text-gray-700 hover:text-black transition-colors py-6">
                Cover <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {activeDropdown === "cover" && (
                <div className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg border py-2 z-50">
                  <Link href="/cover/digital-cover" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    Digital Cover
                  </Link>
                  <Link
                    href="/cover/editorial-shoot"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Editorial Shoot
                  </Link>
                </div>
              )}
            </div>

            {/* Brand Feature Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter("brand")}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="flex items-center text-gray-700 hover:text-black transition-colors py-6">
                Brand Feature <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {activeDropdown === "brand" && (
                <div className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg border py-2 z-50">
                  <Link
                    href="/BrandFeature/fashion"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Fashion
                  </Link>
                  <Link
                    href="/BrandFeature/tech-auto"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Tech & Auto
                  </Link>
                </div>
              )}
            </div>

            {/* Lifestyle Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter("lifestyle")}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="flex items-center text-gray-700 hover:text-black transition-colors py-6">
                Lifestyle <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {activeDropdown === "lifestyle" && (
                <div className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg border py-2 z-50">
                  <Link
                    href="/Lifestyle/food-drinks"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Food & Drinks
                  </Link>
                  <Link
                    href="/Lifestyle/health-wellness"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Health & Wellness
                  </Link>
                  <Link
                    href="/Lifestyle/fitness-selfcare"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Fitness & Selfcare
                  </Link>
                  <Link href="/Lifestyle/travel" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    Travel
                  </Link>
                  <Link href="/Lifestyle/finance" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    Finance
                  </Link>
                </div>
              )}
            </div>

            {/* Sports Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter("sports")}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="flex items-center text-gray-700 hover:text-black transition-colors py-6">
                Sports <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {activeDropdown === "sports" && (
                <div className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg border py-2 z-50">
                  <Link href="/sports/cricket" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    Cricket
                  </Link>
                  <Link href="/sports/golf" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    Golf
                  </Link>
                  <Link href="/sports/other-sports" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    Other Sports
                  </Link>
                </div>
              )}
            </div>

            <Link href="/interviews" className="text-gray-700 hover:text-black transition-colors">
              Interviews
            </Link>
            <Link href="/trending" className="text-gray-700 hover:text-black transition-colors">
              Trending
            </Link>
            <Link href="/magazine" className="text-gray-700 hover:text-black transition-colors">
              Magazine
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              <Link href="/cover/digital-cover" className="block py-2 text-gray-700">
                Digital Cover
              </Link>
              <Link href="/cover/editorial-shoot" className="block py-2 text-gray-700">
                Editorial Shoot
              </Link>
              <Link href="/BrandFeature/fashion" className="block py-2 text-gray-700">
                Fashion
              </Link>
              <Link href="/BrandFeature/tech-auto" className="block py-2 text-gray-700">
                Tech & Auto
              </Link>
              <Link href="/Lifestyle/food-drinks" className="block py-2 text-gray-700">
                Food & Drinks
              </Link>
              <Link href="/Lifestyle/health-wellness" className="block py-2 text-gray-700">
                Health & Wellness
              </Link>
              <Link href="/Lifestyle/fitness-selfcare" className="block py-2 text-gray-700">
                Fitness & Selfcare
              </Link>
              <Link href="/Lifestyle/travel" className="block py-2 text-gray-700">
                Travel
              </Link>
              <Link href="/Lifestyle/finance" className="block py-2 text-gray-700">
                Finance
              </Link>
              <Link href="/sports/cricket" className="block py-2 text-gray-700">
                Cricket
              </Link>
              <Link href="/sports/golf" className="block py-2 text-gray-700">
                Golf
              </Link>
              <Link href="/sports/other-sports" className="block py-2 text-gray-700">
                Other Sports
              </Link>
              <Link href="/interviews" className="block py-2 text-gray-700">
                Interviews
              </Link>
              <Link href="/trending" className="block py-2 text-gray-700">
                Trending
              </Link>
              <Link href="/magazine" className="block py-2 text-gray-700">
                Magazine
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
