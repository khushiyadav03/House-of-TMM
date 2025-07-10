"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search, User } from "lucide-react"

interface Category {
  id: number
  name: string
  slug: string
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="TMM India" width={120} height={40} className="h-10 w-auto" priority />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link href="/" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link href="/cover" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
              Cover
            </Link>
            <Link href="/brand_feature" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
              Brand Feature
            </Link>
            <Link href="/lifestyle" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
              Lifestyle
            </Link>
            <Link href="/sports" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
              Sports
            </Link>
            <Link href="/interviews" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
              Interviews
            </Link>
            <Link href="/trending" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
              Trending
            </Link>
            <Link href="/magazine" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
              Magazine
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/admin/login" className="text-gray-600 hover:text-gray-900">
              <User className="h-5 w-5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              href="/"
              onClick={closeMenu}
              className="text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium"
            >
              Home
            </Link>
            <Link
              href="/cover"
              onClick={closeMenu}
              className="text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium"
            >
              Cover
            </Link>
            <Link
              href="/brand_feature"
              onClick={closeMenu}
              className="text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium"
            >
              Brand Feature
            </Link>
            <Link
              href="/lifestyle"
              onClick={closeMenu}
              className="text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium"
            >
              Lifestyle
            </Link>
            <Link
              href="/sports"
              onClick={closeMenu}
              className="text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium"
            >
              Sports
            </Link>
            <Link
              href="/interviews"
              onClick={closeMenu}
              className="text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium"
            >
              Interviews
            </Link>
            <Link
              href="/trending"
              onClick={closeMenu}
              className="text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium"
            >
              Trending
            </Link>
            <Link
              href="/magazine"
              onClick={closeMenu}
              className="text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium"
            >
              Magazine
            </Link>
            <div className="border-t pt-4 pb-3">
              <div className="flex items-center px-3 space-x-4">
                <button className="text-gray-600 hover:text-gray-900">
                  <Search className="h-5 w-5" />
                </button>
                <Link href="/admin/login" onClick={closeMenu} className="text-gray-600 hover:text-gray-900">
                  <User className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
