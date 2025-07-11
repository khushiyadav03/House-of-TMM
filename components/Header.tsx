"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Category } from "@/lib/supabase"
import { safeJson } from "@/lib/utils"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoadingCategories(true)
        const response = await fetch("/api/categories")
        if (!response.ok) {
          const errorText = await response.text() // Get raw response text for debugging
          throw new Error(`HTTP error! status: ${response.status}, Raw response: ${errorText}`)
        }
        const data = await safeJson(response) // Use safeJson to handle potential non-JSON
        setCategories(data || [])
      } catch (error: any) {
        setCategoryError(error.message)
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

  const fashionCategories = categories.filter(
    (cat) => cat.slug.startsWith("fashion") || cat.slug.startsWith("brand-feature"),
  )
  const lifestyleCategories = categories.filter((cat) => cat.slug.startsWith("lifestyle"))
  const sportsCategories = categories.filter((cat) => cat.slug.startsWith("sports"))
  const coverCategories = categories.filter((cat) => cat.slug.startsWith("cover"))

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image src="/logo.png" alt="House of TMM Logo" width={120} height={40} className="h-10 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium">
                  Fashion <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {fashionCategories.map((cat) => (
                  <DropdownMenuItem key={cat.id}>
                    <Link href={`/${cat.slug}`} className="block w-full">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium">
                  Lifestyle <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {lifestyleCategories.map((cat) => (
                  <DropdownMenuItem key={cat.id}>
                    <Link href={`/${cat.slug}`} className="block w-full">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium">
                  Sports <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {sportsCategories.map((cat) => (
                  <DropdownMenuItem key={cat.id}>
                    <Link href={`/${cat.slug}`} className="block w-full">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/interviews" className="text-gray-600 hover:text-gray-900 font-medium">
              Interviews
            </Link>
            <Link href="/trending" className="text-gray-600 hover:text-gray-900 font-medium">
              Trending
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium">
                  Cover <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {coverCategories.map((cat) => (
                  <DropdownMenuItem key={cat.id}>
                    <Link href={`/${cat.slug}`} className="block w-full">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/magazine" className="text-gray-600 hover:text-gray-900 font-medium">
              Magazine
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle mobile menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg pb-4">
          <nav className="flex flex-col px-4 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  Fashion <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[calc(100%-1rem)] ml-2">
                {fashionCategories.map((cat) => (
                  <DropdownMenuItem key={cat.id} onClick={toggleMobileMenu}>
                    <Link href={`/${cat.slug}`} className="block w-full">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  Lifestyle <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[calc(100%-1rem)] ml-2">
                {lifestyleCategories.map((cat) => (
                  <DropdownMenuItem key={cat.id} onClick={toggleMobileMenu}>
                    <Link href={`/${cat.slug}`} className="block w-full">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  Sports <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[calc(100%-1rem)] ml-2">
                {sportsCategories.map((cat) => (
                  <DropdownMenuItem key={cat.id} onClick={toggleMobileMenu}>
                    <Link href={`/${cat.slug}`} className="block w-full">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/interviews"
              className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
              onClick={toggleMobileMenu}
            >
              Interviews
            </Link>
            <Link
              href="/trending"
              className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
              onClick={toggleMobileMenu}
            >
              Trending
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  Cover <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[calc(100%-1rem)] ml-2">
                {coverCategories.map((cat) => (
                  <DropdownMenuItem key={cat.id} onClick={toggleMobileMenu}>
                    <Link href={`/${cat.slug}`} className="block w-full">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/magazine"
              className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
              onClick={toggleMobileMenu}
            >
              Magazine
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
