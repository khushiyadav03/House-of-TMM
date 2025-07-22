"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { FaFacebookF, FaInstagram, FaYoutube, FaSearch } from "react-icons/fa"
import { X } from "lucide-react"

interface Article {
  id: number
  title: string
  author: string
  publish_date: string
  category: string
  content: string
  image_url: string
  slug: string
  created_at?: string
  updated_at?: string
}

const navItems = [
  {
    name: "Cover",
    href: "/cover",
    subItems: [
      { name: "Digital Cover", href: "/cover/digital-cover" },
      { name: "Editorial Shoot", href: "/cover/editorial-shoot" },      
      { name: "PEP Talk", href: "/cover/pep-talk" },
    ],
  },
  {
    name: "Lifestyle",
    href: "/lifestyle",
    subItems: [
      { name: "Interior", href: "/lifestyle/interior" },
      { name: "Fashion", href: "/lifestyle/fashion" },
      { name: "Good Work", href: "/lifestyle/good-work" },
      { name: "Travel", href: "/lifestyle/travel" },
      { name: "Food", href: "/lifestyle/food" },
      { name: "Reads", href: "/lifestyle/reads" },
      { name: "Health & Wellness", href: "/lifestyle/health-wellness" },
      { name: "Art & Culture", href: "/lifestyle/art-culture" },
    ],
  },
  {
    name: "Entertainment",
    href: "/entertainment",
    subItems: [
      { name: "Music", href: "/lifestyle/music" },
      { name: "Movies", href: "/lifestyle/movies" },
      { name: "Events", href: "/lifestyle/events" },
    ],
  },
  {
    name: "Technology",
    href: "/technology",
    subItems: [
      { name: "Music", href: "/lifestyle/music" },
      { name: "Movies", href: "/lifestyle/movies" },
      { name: "Events", href: "/lifestyle/events" },
    ],
  },
  { name: "Interviews", href: "/interviews" },

  {
    name: "Sports",
    href: "/sports",
  },
  { name: "Trending", href: "/trending" },
  { name: "Magazine", href: "/magazine" },
]

const socialIcons = [
  { icon: FaFacebookF, href: "https://www.facebook.com/profile.php?id=61576672324702" },
  { icon: FaInstagram, href: "https://www.instagram.com/tmmindia/?hl=en" },
  { icon: X, href: "https://x.com/tmmindiaa" },
  { icon: FaYoutube, href: "https://www.youtube.com/@TMMIndiaOfficial" },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])

  const toggleDropdown = (i: number) => {
    setActiveDropdown((prev) => (prev === i ? null : i))
  }

  const toggleSearch = () => {
    setSearchOpen(!searchOpen)
    setSearchQuery("")
    setSearchResults([])
  }

  useEffect(() => {
    async function handleSearch() {
      if (!searchQuery) {
        setSearchResults([])
        return
      }

      try {
        const response = await fetch(`/api/articles/search?q=${encodeURIComponent(searchQuery)}`)
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data.articles || [])
        }
      } catch (error) {
        console.error("Search failed:", error)
      }
    }

    const timeout = setTimeout(handleSearch, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  return (
    <header className="bg-white shadow-sm z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
        >
          <span
            className={`bg-black h-[2px] w-6 my-[3px] transition-all duration-300 ease-in-out ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`bg-black h-[2px] w-6 my-[3px] transition-all duration-300 ease-in-out ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`bg-black h-[2px] w-6 my-[3px] transition-all duration-300 ease-in-out ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>

        <Link href="/" className="flex justify-center mx-auto md:ml-4 md:mx-0">
          <Image src="/logo.png" alt="TMM Logo" width={220} height={88} priority />
        </Link>

        <div className="hidden md:flex items-center space-x-3">
          {socialIcons.map(({ icon: Icon, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-black hover:scale-105 hover:ring hover:ring-gray-300/30 transition duration-200"
            >
              <Icon size={12} />
            </a>
          ))}
          <button
            onClick={toggleSearch}
            aria-label={searchOpen ? "Close search" : "Open search"}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-black hover:scale-105 hover:ring hover:ring-gray-300/30 transition duration-200"
          >
            <FaSearch size={12} />
          </button>
        </div>
      </div>

      <nav className="hidden md:flex justify-center space-x-6 lg:space-x-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t-2 border-b-2 border-gray-300 pt-3 pb-4 uppercase font-semibold tracking-wide text-black text-xs sm:text-sm">
        {navItems.map((item) =>
          item.subItems ? (
            <div key={item.name} className="group relative cursor-pointer">
              <span className="hover:text-gray-600">{item.name}</span>
              <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white border border-gray-300 shadow-lg rounded-md z-50 min-w-[160px] py-2">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className="block px-4 py-3 hover:bg-gray-100 text-gray-800 uppercase text-xs sm:text-sm transition-colors"
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={item.name} href={item.href} className="hover:text-gray-600">
              {item.name}
            </Link>
          ),
        )}
      </nav>

      {searchOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 z-40" onClick={toggleSearch} aria-hidden="true" />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-full max-w-[90%] sm:max-w-md p-4 sm:p-6 rounded-lg shadow-lg">
            <div className="flex items-center border-b border-gray-300">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, blogs, posts..."
                className="flex-1 px-4 py-2 text-black focus:outline-none text-sm sm:text-base"
              />
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="p-2 text-black hover:text-gray-600"
              >
                <FaSearch size={16} />
              </button>
              <button onClick={toggleSearch} aria-label="Close search" className="p-2 text-black hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={`/articles/${result.slug}`}
                    className="block p-2 hover:bg-gray-100 rounded cursor-pointer text-black text-sm"
                    onClick={toggleSearch}
                  >
                    {result.title} ({result.category})
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {menuOpen && (
        <div className="fixed inset-0 bg-black/70 z-40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-[280px] bg-black text-white z-50 transition-transform duration-500 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-6 right-6 z-50">
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={24} className="text-white" />
          </button>
        </div>

        <div className="h-full flex flex-col px-4 sm:px-6 py-20">
          <nav className="space-y-4 sm:space-y-5 text-left text-lg sm:text-xl font-semibold uppercase tracking-wide w-[80%] max-w-[240px] mx-auto">
            {navItems.map((item, i) => (
              <div key={item.name}>
                {item.subItems ? (
                  <div
                    className="cursor-pointer hover:text-gray-300 transition-transform duration-150 hover:-translate-y-1"
                    onClick={() => toggleDropdown(i)}
                  >
                    {item.name}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block hover:text-gray-300 transition-transform duration-150 hover:-translate-y-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
                {item.subItems && activeDropdown === i && (
                  <div className="mt-2 space-y-2 text-xs sm:text-sm text-gray-300 uppercase pl-2">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        onClick={() => {
                          setMenuOpen(false)
                          setActiveDropdown(null)
                        }}
                        className="block hover:text-white transition-transform hover:-translate-y-0.5"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-auto w-[80%] max-w-[240px] mx-auto flex space-x-4 pb-6">
            {socialIcons.map(({ icon: Icon, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-black hover:scale-110 hover:ring hover:ring-gray-300/30 transition duration-200"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
