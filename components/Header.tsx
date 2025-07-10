"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Menu, X, Facebook, Instagram, Youtube, Twitter } from "lucide-react"

interface SearchResult {
  id: number
  title: string
  slug: string
  category: string
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      try {
        const response = await fetch(`/api/articles/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setSearchResults(data.articles || [])
        setShowSearchResults(true)
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      }
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const handleSearchResultClick = () => {
    setShowSearchResults(false)
    setSearchQuery("")
  }

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSearchResults(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="TMM Magazine"
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <div className="relative group">
              <Link href="/cover" className="text-gray-700 hover:text-gray-900 font-medium">
                Cover
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/cover/digital-cover" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Digital Cover
                </Link>
                <Link href="/cover/editorial-shoot" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Editorial Shoot
                </Link>
              </div>
            </div>

            <div className="relative group">
              <Link href="/brand_feature" className="text-gray-700 hover:text-gray-900 font-medium">
                Brand Feature
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/BrandFeature/fashion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Fashion
                </Link>
                <Link
                  href="/BrandFeature/tech-auto"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Tech & Auto
                </Link>
              </div>
            </div>

            <div className="relative group">
              <Link href="/lifestyle" className="text-gray-700 hover:text-gray-900 font-medium">
                Lifestyle
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/Lifestyle/food-drinks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Food & Drinks
                </Link>
                <Link
                  href="/Lifestyle/health-wellness"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Health & Wellness
                </Link>
                <Link
                  href="/Lifestyle/fitness-selfcare"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Fitness & Selfcare
                </Link>
                <Link href="/Lifestyle/travel" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Travel
                </Link>
                <Link href="/Lifestyle/finance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Finance
                </Link>
              </div>
            </div>

            <div className="relative group">
              <Link href="/sports" className="text-gray-700 hover:text-gray-900 font-medium">
                Sports
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/sports/cricket" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Cricket
                </Link>
                <Link href="/sports/golf" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Golf
                </Link>
                <Link href="/sports/other-sports" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Other Sports
                </Link>
              </div>
            </div>

            <Link href="/interviews" className="text-gray-700 hover:text-gray-900 font-medium">
              Interviews
            </Link>
            <Link href="/trending" className="text-gray-700 hover:text-gray-900 font-medium">
              Trending
            </Link>
            <Link href="/magazine" className="text-gray-700 hover:text-gray-900 font-medium">
              Magazine
            </Link>
          </nav>

          {/* Search and Social Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-64"
                />
              </div>
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={`/articles/${result.slug}`}
                      onClick={handleSearchResultClick}
                      className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900 line-clamp-1">{result.title}</div>
                      <div className="text-sm text-gray-500">{result.category}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="hidden md:flex items-center space-x-3">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Twitter className="h-5 w-5" />
              </a>
            </div>

            {/* Mobile menu button */}
            <button onClick={toggleMenu} className="lg:hidden p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <Link href="/cover" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Cover
              </Link>
              <Link href="/cover/digital-cover" className="block px-6 py-2 text-sm text-gray-600">
                Digital Cover
              </Link>
              <Link href="/cover/editorial-shoot" className="block px-6 py-2 text-sm text-gray-600">
                Editorial Shoot
              </Link>
              <Link href="/brand_feature" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Brand Feature
              </Link>
              <Link href="/BrandFeature/fashion" className="block px-6 py-2 text-sm text-gray-600">
                Fashion
              </Link>
              <Link href="/BrandFeature/tech-auto" className="block px-6 py-2 text-sm text-gray-600">
                Tech & Auto
              </Link>
              <Link href="/lifestyle" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Lifestyle
              </Link>
              <Link href="/Lifestyle/food-drinks" className="block px-6 py-2 text-sm text-gray-600">
                Food & Drinks
              </Link>
              <Link href="/Lifestyle/health-wellness" className="block px-6 py-2 text-sm text-gray-600">
                Health & Wellness
              </Link>
              <Link href="/Lifestyle/fitness-selfcare" className="block px-6 py-2 text-sm text-gray-600">
                Fitness & Selfcare
              </Link>
              <Link href="/Lifestyle/travel" className="block px-6 py-2 text-sm text-gray-600">
                Travel
              </Link>
              <Link href="/Lifestyle/finance" className="block px-6 py-2 text-sm text-gray-600">
                Finance
              </Link>
              <Link href="/sports" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Sports
              </Link>
              <Link href="/sports/cricket" className="block px-6 py-2 text-sm text-gray-600">
                Cricket
              </Link>
              <Link href="/sports/golf" className="block px-6 py-2 text-sm text-gray-600">
                Golf
              </Link>
              <Link href="/sports/other-sports" className="block px-6 py-2 text-sm text-gray-600">
                Other Sports
              </Link>
              <Link href="/interviews" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Interviews
              </Link>
              <Link href="/trending" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Trending
              </Link>
              <Link href="/magazine" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Magazine
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
