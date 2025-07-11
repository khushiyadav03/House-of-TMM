"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Save, Plus, X } from "lucide-react"
import Footer from "../../../components/Footer"

interface Article {
  id: number
  title: string
  image_url: string
  author: string
  publish_date: string
  slug: string
}

interface Magazine {
  id: number
  title: string
  cover_image_url: string
  price: number
  issue_date: string
}

interface YoutubeVideo {
  id: number
  title: string
  video_url: string
  thumbnail_url: string
  is_main_video: boolean
}

interface BrandImage {
  id: number
  title: string
  image_url: string
}

interface HomepageSection {
  section_name: string
  content: any
  max_items: number
}

export default function AdminHomepage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([])
  const [brandImages, setBrandImages] = useState<BrandImage[]>([])
  const [activeSection, setActiveSection] = useState<string>("carousel_articles")
  const [homepageContent, setHomepageContent] = useState<any>({})
  const [saving, setSaving] = useState(false)

  const sections: HomepageSection[] = [
    { section_name: "carousel_articles", content: {}, max_items: 8 },
    { section_name: "latest_news", content: {}, max_items: 6 },
    { section_name: "featured_magazine", content: {}, max_items: 1 },
    { section_name: "fashion_section", content: {}, max_items: 3 },
    { section_name: "tech_auto_section", content: {}, max_items: 8 },
    { section_name: "sports_section", content: {}, max_items: 8 },
    { section_name: "finance_section", content: {}, max_items: 4 },
    { section_name: "travel_section", content: {}, max_items: 4 },
    { section_name: "youtube_videos", content: {}, max_items: 8 },
    { section_name: "brand_images", content: {}, max_items: 10 },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [articlesRes, magazinesRes, homepageRes, videosRes, brandsRes] = await Promise.all([
        fetch("/api/articles?limit=100"),
        fetch("/api/magazines"),
        fetch("/api/homepage-content"),
        fetch("/api/youtube-videos"),
        fetch("/api/brand-images"),
      ])

      const articlesData = await articlesRes.json()
      const magazinesData = await magazinesRes.json()
      const homepageData = await homepageRes.json()
      const videosData = await videosRes.json()
      const brandsData = await brandsRes.json()

      setArticles(articlesData.articles || [])
      setMagazines(magazinesData || [])
      setYoutubeVideos(videosData || [])
      setBrandImages(brandsData || [])

      // Convert homepage data to object
      const contentObj: any = {}
      homepageData.forEach((item: any) => {
        contentObj[item.section_name] = item.content
      })
      setHomepageContent(contentObj)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/homepage-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section_name: activeSection,
          content: homepageContent[activeSection] || {},
        }),
      })

      if (response.ok) {
        alert("Content saved successfully!")
      }
    } catch (error) {
      console.error("Failed to save content:", error)
    } finally {
      setSaving(false)
    }
  }

  const updateSectionContent = (sectionName: string, content: any) => {
    setHomepageContent((prev: any) => ({
      ...prev,
      [sectionName]: content,
    }))
  }

  const addArticleToSection = (articleId: number) => {
    const currentSection = homepageContent[activeSection] || {}
    const selectedArticles = currentSection.selected_articles || []
    const maxItems = sections.find((s) => s.section_name === activeSection)?.max_items || 10

    if (selectedArticles.length >= maxItems) {
      alert(`Maximum ${maxItems} articles allowed for this section`)
      return
    }

    if (!selectedArticles.includes(articleId)) {
      updateSectionContent(activeSection, {
        ...currentSection,
        selected_articles: [...selectedArticles, articleId],
      })
    }
  }

  const removeArticleFromSection = (articleId: number) => {
    const currentSection = homepageContent[activeSection] || {}
    const selectedArticles = currentSection.selected_articles || []

    updateSectionContent(activeSection, {
      ...currentSection,
      selected_articles: selectedArticles.filter((id: number) => id !== articleId),
    })
  }

  const selectMagazine = (magazineId: number) => {
    updateSectionContent(activeSection, {
      selected_magazine: magazineId,
    })
  }

  const renderArticleSelection = () => {
    const currentSection = homepageContent[activeSection] || {}
    const selectedArticles = currentSection.selected_articles || []
    const maxItems = sections.find((s) => s.section_name === activeSection)?.max_items || 10

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Selected Articles ({selectedArticles.length}/{maxItems})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedArticles.map((articleId: number) => {
              const article = articles.find((a) => a.id === articleId)
              if (!article) return null
              return (
                <div key={articleId} className="bg-white p-3 rounded border flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={article.image_url || "/placeholder.svg"}
                      alt={article.title}
                      width={40}
                      height={40}
                      className="object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{article.title}</p>
                      <p className="text-xs text-gray-500">{article.author}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeArticleFromSection(articleId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Available Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {articles
              .filter((article) => !selectedArticles.includes(article.id))
              .map((article) => (
                <div key={article.id} className="bg-white p-3 rounded border flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={article.image_url || "/placeholder.svg"}
                      alt={article.title}
                      width={40}
                      height={40}
                      className="object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{article.title}</p>
                      <p className="text-xs text-gray-500">{article.author}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addArticleToSection(article.id)}
                    className="text-green-500 hover:text-green-700"
                    disabled={selectedArticles.length >= maxItems}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  const renderMagazineSelection = () => {
    const currentSection = homepageContent[activeSection] || {}
    const selectedMagazine = currentSection.selected_magazine

    return (
      <div className="space-y-6">
        {selectedMagazine && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Selected Magazine</h3>
            {(() => {
              const magazine = magazines.find((m) => m.id === selectedMagazine)
              if (!magazine) return null
              return (
                <div className="bg-white p-3 rounded border flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={magazine.cover_image_url || "/placeholder.svg"}
                      alt={magazine.title}
                      width={40}
                      height={60}
                      className="object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{magazine.title}</p>
                      <p className="text-sm text-gray-500">₹{magazine.price}</p>
                    </div>
                  </div>
                  <button onClick={() => selectMagazine(0)} className="text-red-500 hover:text-red-700">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )
            })()}
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-4">Available Magazines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {magazines
              .filter((magazine) => magazine.id !== selectedMagazine)
              .map((magazine) => (
                <div key={magazine.id} className="bg-white p-3 rounded border flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={magazine.cover_image_url || "/placeholder.svg"}
                      alt={magazine.title}
                      width={40}
                      height={60}
                      className="object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{magazine.title}</p>
                      <p className="text-sm text-gray-500">₹{magazine.price}</p>
                    </div>
                  </div>
                  <button onClick={() => selectMagazine(magazine.id)} className="text-green-500 hover:text-green-700">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  const getSectionTitle = (sectionName: string) => {
    const titles: { [key: string]: string } = {
      carousel_articles: "Image Carousel Articles",
      latest_news: "Latest News Section",
      featured_magazine: "Featured Magazine",
      fashion_section: "Fashion Section",
      tech_auto_section: "Tech & Auto Section",
      sports_section: "Sports Section",
      finance_section: "Finance Section",
      travel_section: "Travel Section",
      youtube_videos: "YouTube Videos",
      brand_images: "Brand Images",
    }
    return titles[sectionName] || sectionName
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Homepage Content Management</h1>
          <p className="text-xl text-gray-600">Customize homepage sections and content</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Section Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Sections</h2>
              </div>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.section_name}
                    onClick={() => setActiveSection(section.section_name)}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
                      activeSection === section.section_name
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium">{getSectionTitle(section.section_name)}</div>
                      <div className="text-xs text-gray-500">Max: {section.max_items} items</div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{getSectionTitle(activeSection)}</h2>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {/* Render appropriate content based on section */}
              {activeSection === "featured_magazine" ? renderMagazineSelection() : renderArticleSelection()}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
