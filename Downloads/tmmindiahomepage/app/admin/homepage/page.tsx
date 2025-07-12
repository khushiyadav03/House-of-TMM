"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Save, Plus, X, Upload, Play, Star } from "lucide-react"
import { useToast, ToastContainer } from "../../../components/Toast"
import AdminRoute from "../../../components/AdminRoute"
import Link from "next/link"

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

  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast()

  const sections: HomepageSection[] = [
    { section_name: "carousel_articles", content: {}, max_items: 8 },
    { section_name: "latest_news", content: {}, max_items: 6 },
    { section_name: "featured_magazine", content: {}, max_items: 1 },
    { section_name: "fashion_section", content: {}, max_items: 3 },
    { section_name: "tech_auto_section", content: {}, max_items: 8 },
    { section_name: "sports_section", content: {}, max_items: 8 },
    { section_name: "finance_section", content: {}, max_items: 4 },
    { section_name: "travel_section", content: {}, max_items: 4 },
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
      if (Array.isArray(homepageData)) {
      homepageData.forEach((item: any) => {
        contentObj[item.section_name] = item.content
      })
      }
      setHomepageContent(contentObj)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      showError("Failed to fetch data")
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Only save sections that have content
      const sectionsToSave = Object.entries(homepageContent).filter(([sectionName, content]) => {
        // Check if the section has meaningful content
        if (typeof content === 'object' && content !== null) {
          // For article sections, check if selected_articles exists and has items
          if ('selected_articles' in content && Array.isArray((content as any).selected_articles) && (content as any).selected_articles.length > 0) {
            return true
          }
          // For magazine section, check if selected_magazine exists
          if ('selected_magazine' in content && (content as any).selected_magazine) {
            return true
          }
        }
        return false
      })

      if (sectionsToSave.length === 0) {
        showError("No content to save. Please select articles or magazines for at least one section.")
        setSaving(false)
        return
      }

      // Save sections one by one to handle errors better
      const results = []
      for (const [sectionName, content] of sectionsToSave) {
    try {
      const response = await fetch("/api/homepage-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
              section_name: sectionName,
              content: content,
        }),
      })

          if (!response.ok) {
            const errorData = await response.json()
            console.error(`Failed to save ${sectionName}:`, errorData)
            results.push({ sectionName, success: false, error: errorData.error || 'Unknown error' })
          } else {
            results.push({ sectionName, success: true })
          }
        } catch (error) {
          console.error(`Error saving ${sectionName}:`, error)
          results.push({ sectionName, success: false, error: 'Network error' })
        }
      }

      const successfulSaves = results.filter(r => r.success)
      const failedSaves = results.filter(r => !r.success)

      if (successfulSaves.length > 0 && failedSaves.length === 0) {
        showSuccess(`${successfulSaves.length} section(s) saved successfully! Changes will be reflected on the homepage immediately.`)
      } else if (successfulSaves.length > 0 && failedSaves.length > 0) {
        showError(`Partially saved: ${successfulSaves.length} section(s) saved, ${failedSaves.length} failed. Failed sections: ${failedSaves.map(r => r.sectionName).join(', ')}`)
      } else {
        showError(`Failed to save any sections. Please try again.`)
      }
    } catch (error) {
      console.error("Failed to save content:", error)
      showError("Failed to save content. Please try again.")
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
      showError(`Maximum ${maxItems} articles allowed for this section`)
      return
    }

    if (!selectedArticles.includes(articleId)) {
      updateSectionContent(activeSection, {
        ...currentSection,
        selected_articles: [...selectedArticles, articleId],
      })
      showInfo("Article added to section")
    }
  }

  const removeArticleFromSection = (articleId: number) => {
    const currentSection = homepageContent[activeSection] || {}
    const selectedArticles = currentSection.selected_articles || []

    updateSectionContent(activeSection, {
      ...currentSection,
      selected_articles: selectedArticles.filter((id: number) => id !== articleId),
    })
    showInfo("Article removed from section")
  }

  const selectMagazine = (magazineId: number) => {
    updateSectionContent(activeSection, {
      selected_magazine: magazineId,
    })
    showInfo("Magazine selected for featured section")
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
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Selected Magazine</h3>
          {selectedMagazine ? (
            (() => {
              const magazine = magazines.find((m) => m.id === selectedMagazine)
              return magazine ? (
                <div className="bg-white p-3 rounded border flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={magazine.cover_image_url || "/placeholder.svg"}
                      alt={magazine.title}
                      width={40}
                      height={40}
                      className="object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{magazine.title}</p>
                      <p className="text-xs text-gray-500">₹{magazine.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSectionContent(activeSection, { selected_magazine: null })}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">Selected magazine not found</p>
              )
            })()
          ) : (
            <p className="text-gray-500">No magazine selected</p>
          )}
          </div>

        <div>
          <h3 className="font-semibold mb-4">Available Magazines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {magazines.map((magazine) => (
                <div key={magazine.id} className="bg-white p-3 rounded border flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={magazine.cover_image_url || "/placeholder.svg"}
                      alt={magazine.title}
                      width={40}
                    height={40}
                      className="object-cover rounded"
                    />
                    <div>
                    <p className="font-medium text-sm line-clamp-1">{magazine.title}</p>
                    <p className="text-xs text-gray-500">₹{magazine.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => selectMagazine(magazine.id)}
                  className="text-green-500 hover:text-green-700"
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

  const renderYoutubeVideosSection = () => {
    const mainVideo = youtubeVideos.find((video) => video.is_main_video)
    const recommendedVideos = youtubeVideos.filter((video) => !video.is_main_video).slice(0, 7)

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-4">YouTube Videos Management</h3>
          <p className="text-sm text-blue-700 mb-4">
            Manage your YouTube videos here. The main featured video and 7 recommended videos will be displayed on the homepage.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Featured Video */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded border border-yellow-200">
              <h4 className="font-semibold mb-3 flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                Main Featured Video
                <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  FEATURED
                </span>
              </h4>
              {mainVideo ? (
                <div className="space-y-2">
                  <div className="aspect-video bg-gray-100 rounded overflow-hidden relative">
                    <img
                      src={mainVideo.thumbnail_url || "/placeholder.svg"}
                      alt={mainVideo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">
                      MAIN
                    </div>
                  </div>
                  <p className="font-medium text-sm">{mainVideo.title}</p>
                  <p className="text-xs text-gray-500">{mainVideo.video_url}</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-2 text-yellow-300" />
                  <p>No main video set</p>
                  <p className="text-xs mt-1">Set a video as main featured</p>
                </div>
              )}
            </div>

            {/* Recommended Videos */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded border border-blue-200">
              <h4 className="font-semibold mb-3 flex items-center">
                <Play className="h-4 w-4 mr-2 text-blue-500" />
                Recommended Videos
                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {recommendedVideos.length}/7
                </span>
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recommendedVideos.map((video) => (
                  <div key={video.id} className="flex items-center space-x-2 p-2 bg-white rounded border">
                    <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0 relative">
                      <img
                        src={video.thumbnail_url || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded font-bold">
                        REC
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs line-clamp-2">{video.title}</p>
                    </div>
                  </div>
                ))}
                {recommendedVideos.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <Play className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                    <p className="text-sm">No recommended videos</p>
                    <p className="text-xs">Add videos to create recommendations</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="/admin/youtube-videos"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Manage YouTube Videos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const renderBrandImagesSection = () => {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-4">Brand Images Management</h3>
          <p className="text-sm text-blue-700 mb-4">
            Upload and manage brand images that will be displayed on the homepage.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brandImages.slice(0, 12).map((brand) => (
              <div key={brand.id} className="bg-white p-2 rounded border">
                <div className="aspect-square bg-gray-100 rounded overflow-hidden mb-2">
                  <img
                    src={brand.image_url || "/placeholder.svg"}
                    alt={brand.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-medium text-center line-clamp-2">{brand.title}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Link
              href="/admin/brand-images"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Manage Brand Images
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getSectionTitle = (sectionName: string) => {
    const titles: { [key: string]: string } = {
      carousel_articles: "Carousel Articles",
      latest_news: "Latest News",
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

  const renderSectionContent = () => {
    if (activeSection === "featured_magazine") {
      return renderMagazineSelection()
    } else if (activeSection === "youtube_videos") {
      return renderYoutubeVideosSection()
    } else if (activeSection === "brand_images") {
      return renderBrandImagesSection()
    } else {
      return renderArticleSelection()
    }
  }

  return (
    <AdminRoute>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Homepage Content Management</h1>
            <p className="text-xl text-gray-600">Customize what appears on your homepage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
          <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Sections</h2>
                <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.section_name}
                    onClick={() => setActiveSection(section.section_name)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.section_name
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                      {getSectionTitle(section.section_name)}
                    </button>
                  ))}
                  
                  {/* Special sections */}
                  <button
                    onClick={() => setActiveSection("youtube_videos")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === "youtube_videos"
                        ? "bg-red-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    YouTube Videos
                  </button>
                  
                  <button
                    onClick={() => setActiveSection("brand_images")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === "brand_images"
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Brand Images
                  </button>
                </div>
            </div>
          </div>

            {/* Main Content */}
          <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {getSectionTitle(activeSection)}
                  </h2>
                <button
                  onClick={handleSave}
                  disabled={saving}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                  <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                </button>
              </div>

                {renderSectionContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </AdminRoute>
  )
}
