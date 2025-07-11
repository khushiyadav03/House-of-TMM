"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

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

interface Magazine {
  id: number
  title: string
  cover_image_url: string
  pdf_url: string
  price: number
  created_at?: string
  updated_at?: string
}

interface YoutubeVideo {
  id: number
  title: string
  video_url: string
  is_main_video: boolean
  created_at?: string
  updated_at?: string
}

interface BrandImage {
  id: number
  image_url: string
  created_at?: string
  updated_at?: string
}

// Helper to safely parse JSON, even if response is not OK
async function safeJson(response: Response) {
  try {
    if (response.ok) {
      return await response.json()
    } else {
      const errorText = await response.clone().text() // Clone to read text without consuming original stream
      console.error(`API Error (${response.status}): ${errorText}`)
      return null // Indicate failure
    }
  } catch (e) {
    const errorText = await response.clone().text() // Clone again for debugging
    console.error(`Failed to execute 'json' on 'Response': ${e}. Raw response: ${errorText}`)
    return null // Indicate failure
  }
}

async function fetchHomepageData() {
  const [articlesResponse, magazinesResponse, youtubeVideosResponse, brandImagesResponse] = await Promise.all([
    fetch("/api/articles?sort=created_at_desc"),
    fetch("/api/magazines?sort=created_at_desc"),
    fetch("/api/youtube-videos"),
    fetch("/api/brand-images"),
  ])

  const articlesData = await safeJson(articlesResponse)
  const magazinesData = await safeJson(magazinesResponse)
  const videosData = await safeJson(youtubeVideosResponse)
  const brandsData = await safeJson(brandImagesResponse)

  if (!articlesResponse.ok || articlesData === null) {
    throw new Error("Failed to fetch homepage data: Articles API error")
  }
  if (!magazinesResponse.ok || magazinesData === null) {
    throw new Error("Failed to fetch homepage data: Magazines API error")
  }
  if (!youtubeVideosResponse.ok || videosData === null) {
    throw new Error("Failed to fetch homepage data: YouTube videos API error")
  }
  if (!brandImagesResponse.ok || brandsData === null) {
    throw new Error("Failed to fetch homepage data: Brand images API error")
  }

  return {
    articles: articlesData.articles as Article[],
    magazines: magazinesData.magazines as Magazine[],
    youtubeVideos: videosData.videos as YoutubeVideo[],
    brandImages: brandsData.brandImages as BrandImage[],
  }
}

export default function HomePage() {
  const [data, setData] = useState<{
    articles: Article[]
    magazines: Magazine[]
    youtubeVideos: YoutubeVideo[]
    brandImages: BrandImage[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchHomepageData()
        setData(fetchedData)
      } catch (err: any) {
        setError(err.message)
        console.error("Failed to fetch homepage data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading homepage data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    )
  }

  const mainVideo = data?.youtubeVideos.find((video) => video.is_main_video)
  const recommendedVideos = data?.youtubeVideos.filter((video) => !video.is_main_video)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section - Latest Article */}
      {data?.articles && data.articles.length > 0 && (
        <section className="mb-12">
          <Link href={`/articles/${data.articles[0].slug}`}>
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={data.articles[0].image_url || "/placeholder.svg?height=720&width=1280"}
                  alt={data.articles[0].title}
                  fill
                  className="object-cover"
                  priority
                />
              </AspectRatio>
              <CardContent className="p-6 bg-white">
                <h2 className="text-3xl font-bold mb-2">{data.articles[0].title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  By {data.articles[0].author} | {new Date(data.articles[0].publish_date).toLocaleDateString()}
                </p>
                <p className="text-gray-700 line-clamp-3">{data.articles[0].content}</p>
                <Button variant="link" className="px-0 mt-4">
                  Read More <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </section>
      )}

      {/* Latest Articles Grid */}
      {data?.articles && data.articles.length > 1 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Latest Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.articles.slice(1, 7).map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-none rounded-none">
                  <AspectRatio ratio={270 / 405}>
                    <Image
                      src={article.image_url || "/placeholder.svg?height=405&width=270"}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                  <CardContent className="p-4 bg-white">
                    <h3 className="text-lg font-semibold line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 text-xs mt-1">By {article.author}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/articles">View All Articles</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Latest Magazine Issues */}
      {data?.magazines && data.magazines.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Latest Magazine Issues</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.magazines.slice(0, 3).map((magazine) => (
              <Link key={magazine.id} href={`/magazine?issue=${magazine.id}`}>
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-none rounded-none">
                  <AspectRatio ratio={270 / 405}>
                    <Image
                      src={magazine.cover_image_url || "/placeholder.svg?height=405&width=270"}
                      alt={magazine.title}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                  <CardContent className="p-4 bg-white">
                    <h3 className="text-lg font-semibold line-clamp-2">{magazine.title}</h3>
                    <p className="text-gray-700 mt-1">₹{magazine.price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/magazine">View All Magazines</Link>
            </Button>
          </div>
        </section>
      )}

      {/* YouTube Videos Section */}
      {data?.youtubeVideos && data.youtubeVideos.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Latest Videos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mainVideo && (
              <div className="lg:col-span-1">
                <AspectRatio ratio={16 / 9}>
                  <iframe
                    src={`https://www.youtube.com/embed/${mainVideo.video_url.split("v=")[1]}`}
                    title={mainVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-lg shadow-lg"
                  ></iframe>
                </AspectRatio>
                <h3 className="text-xl font-bold mt-4">{mainVideo.title}</h3>
              </div>
            )}
            {recommendedVideos && recommendedVideos.length > 0 && (
              <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedVideos.slice(0, 4).map((video) => (
                  <div key={video.id}>
                    <AspectRatio ratio={16 / 9}>
                      <iframe
                        src={`https://www.youtube.com/embed/${video.video_url.split("v=")[1]}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-lg shadow-md"
                      ></iframe>
                    </AspectRatio>
                    <h4 className="text-md font-semibold mt-2 line-clamp-2">{video.title}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="text-center mt-8">
            <Button asChild>
              <Link href="https://www.youtube.com/@TMMIndiaOfficial" target="_blank" rel="noopener noreferrer">
                View All Videos
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Brands Associated Section */}
      {data?.brandImages && data.brandImages.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Brands Associated</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center justify-center">
            {data.brandImages.map((brand) => (
              <div key={brand.id} className="flex justify-center items-center p-4 bg-white rounded-lg shadow-md">
                <Image
                  src={brand.image_url || "/placeholder.svg?height=100&width=200"}
                  alt="Brand Logo"
                  width={200}
                  height={100}
                  className="object-contain max-h-24 w-auto"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
