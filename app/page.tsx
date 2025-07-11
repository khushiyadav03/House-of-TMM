"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Swiper } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/scrollbar"
import Footer from "../components/Footer"
import { getSupabaseServer, type Article, type YoutubeVideo, type BrandImage } from "@/lib/supabase"
import { safeJson } from "@/lib/utils"

interface Magazine {
  id: number
  title: string
  cover_image_url: string
  price: number
  issue_date: string
}

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

export default async function HomePage() {
  const { articles, youtubeVideos, brandImages } = await fetchHomepageData()

  return (
    <div className="min-h-screen bg-white text-gray-700">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
        <Image
          src="/placeholder.svg?height=700&width=1920"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">House of TMM</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              Your ultimate destination for the latest in fashion, lifestyle, and culture.
            </p>
            <Link
              href="/magazine"
              className="mt-8 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Explore Magazine
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-12 md:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Latest Articles</h2>
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <article className="bg-white shadow-lg rounded-none overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <div className="relative w-full h-[405px]">
                    <Image
                      src={article.image_url || "/placeholder.svg?height=405&width=270"}
                      alt={article.title}
                      fill
                      className="object-cover article-card-image"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.author}</span>
                      <span>{new Date(article.publish_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* YouTube Videos Section */}
      <section className="bg-gray-100 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Our Latest Videos</h2>
          {youtubeVideos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No videos found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {youtubeVideos.map((video) => (
                <div key={video.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={video.thumbnail_url || "/placeholder.svg?height=360&width=640"}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors"
                    >
                      <PlayIcon className="h-12 w-12 text-white" />
                    </a>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Feature Section */}
      <section className="py-12 md:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Featured Brands</h2>
        {brandImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No brand images found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center justify-center">
            {brandImages.map((brand) => (
              <div key={brand.id} className="flex justify-center items-center p-4 bg-white rounded-lg shadow-md">
                <Image
                  src={brand.image_url || "/placeholder.svg?height=100&width=150"}
                  alt={brand.alt_text}
                  width={150}
                  height={100}
                  className="object-contain max-h-[100px] max-w-[150px]"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Carousel Section */}
      <section className="w-full pt-0 pb-4">
        <div className="carousel-wrapper">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={2.5}
            spaceBetween={0}
            loop={true}
            loopAdditionalSlides={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ el: ".swiper-pagination", clickable: true }}
            breakpoints={{
              1280: { slidesPerView: 2.5, spaceBetween: 0 },
              1024: { slidesPerView: 2, spaceBetween: 0 },
              768: { slidesPerView: 1.5, spaceBetween: 0 },
              640: { slidesPerView: 1, spaceBetween: 0 },
              0: { slidesPerView: 1, spaceBetween: 0 },
            }}
            onSwiper={(swiper) => {
              // swiperRef.current = swiper
            }}
          >
            {/* Carousel Articles will be fetched from the server */}
          </Swiper>
        </div>
      </section>

      {/* Main Ad Section */}
      <section className="w-full py-6">
        <div className="ad-container !rounded-none">
          <span className="ad-label">Advertisement</span>
          <div className="ad-placeholder"></div>
        </div>
      </section>

      {/* Main Content: Latest News + Fashion + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-stretch gap-8">
          <div className="lg:w-2/3 flex flex-col gap-8">
            {/* Latest News */}
            <div>
              <div className="flex items-center mb-4">
                <h2 className="text-3xl font-montserrat font-extrabold text-gray-800">Latest News</h2>
                <hr className="fashion-section-line"></hr>
                <Link href="/latest-news" className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap">
                  View All Posts
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Latest News Articles will be fetched from the server */}
              </div>
            </div>

            {/* Fashion Section */}
            <div>
              <div className="flex items-center mb-4">
                <h2 className="text-3xl font-montserrat font-extrabold text-gray-800">Fashion</h2>
                <hr className="fashion-section-line"></hr>
                <Link href="/fashion" className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap">
                  View All Posts
                </Link>
              </div>
              {/* Fashion Articles will be fetched from the server */}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 flex flex-col items-stretch gap-6 min-h-full">
            {/* Featured Magazine */}
            <div className="magazine-cover-container bg-gray-100">
              {/* Featured Magazine will be fetched from the server */}
            </div>

            {/* Health & Wellness */}
            <div className="health-wellness-sidebar">
              <h2 className="text-3xl font-montserrat font-extrabold mb-6">Health & Wellness</h2>
              {/* Health & Wellness Articles will be fetched from the server */}
            </div>

            {/* Sidebar Ad */}
            <div className="ad-container-sidebar flex-1 !rounded-none">
              <span className="ad-label">Advertisement</span>
              <div className="ad-placeholder-sidebar"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech & Auto Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-12">
          <div>
            <div className="flex items-center mb-8">
              <h2 className="text-3xl font-montserrat font-extrabold text-gray-800">Tech & Auto</h2>
              <hr className="fashion-section-line" />
              <Link href="/tech-auto" className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap">
                View All Posts
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {/* Tech & Auto Articles will be fetched from the server */}
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section bg-black py-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="lg:w-[780px] w-full">
              <div className="relative w-full h-0 pb-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Featured Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className="lg:w-[380px] w-full recommended-videos-container">
              <div className="recommended-videos-slider">
                {/* Recommended Videos will be fetched from the server */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-12">
          <div>
            <div className="flex items-center mb-8">
              <h2 className="text-3xl font-montserrat font-extrabold text-gray-800">Sports</h2>
              <hr className="fashion-section-line" />
              <Link href="/sports" className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap">
                View All Posts
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sports Articles will be fetched from the server */}
            </div>
          </div>
        </div>
      </section>

      {/* Finance & Travel Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Finance */}
          <div className="lg:w-[68%] w-full">
            <div className="flex items-center mb-4">
              <h2 className="text-3xl font-montserrat font-extrabold text-gray-800 finance-section-heading">Finance</h2>
              <hr className="fashion-section-line" />
              <Link href="/finance" className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap">
                View All Posts
              </Link>
            </div>
            {/* Finance Articles will be fetched from the server */}
          </div>

          {/* Travel */}
          <div className="lg:w-[32%] w-full">
            <div className="flex items-center mb-4">
              <h2 className="text-3xl font-montserrat font-extrabold text-gray-800">Travel</h2>
              <hr className="fashion-section-line" />
              <Link href="/travel" className="text-sm text-gray-500 hover:text-gray-700">
                View All Posts
              </Link>
            </div>
            {/* Travel Articles will be fetched from the server */}
          </div>
        </div>

        {/* Brands Associated Section */}
        <section className="w-full py-12">
          <h2 className="text-3xl font-montserrat font-extrabold mb-8 text-center">Brands Associated</h2>
          <div className="max-w-[1170px] mx-auto overflow-hidden">
            <Swiper
              className="swiper"
              modules={[Autoplay]}
              slidesPerView="auto"
              spaceBetween={0}
              loop={true}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={5000}
              freeMode={true}
              onSwiper={(swiper) => {
                // brandsSwiperRef.current = swiper
              }}
            >
              {/* Brand Logos will be fetched from the server */}
            </Swiper>
          </div>
        </section>
      </section>
      <Footer />
    </div>
  )
}

async function fetchHomepageData() {
  const supabase = getSupabaseServer() // Use server client for fetching data on the server

  try {
    // Fetch articles
    const articlesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles?limit=6&sort=created_at_desc`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      },
    )
    const articlesData = await safeJson(articlesResponse)
    if (articlesData.error) {
      throw new Error(`Articles fetch error: ${articlesData.error}`)
    }
    const articles: Article[] = articlesData.articles || []

    // Fetch YouTube videos
    const youtubeVideosResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/youtube-videos?limit=3&sort=created_at_desc`,
      {
        next: { revalidate: 3600 },
      },
    )
    const youtubeVideosData = await safeJson(youtubeVideosResponse)
    if (youtubeVideosData.error) {
      throw new Error(`YouTube videos fetch error: ${youtubeVideosData.error}`)
    }
    const youtubeVideos: YoutubeVideo[] = youtubeVideosData.youtubeVideos || []

    // Fetch brand images
    const brandImagesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand-images?limit=5&sort=created_at_desc`,
      {
        next: { revalidate: 3600 },
      },
    )
    const brandImagesData = await safeJson(brandImagesResponse)
    if (brandImagesData.error) {
      throw new Error(`Brand images fetch error: ${brandImagesData.error}`)
    }
    const brandImages: BrandImage[] = brandImagesData.brandImages || []

    return { articles, youtubeVideos, brandImages }
  } catch (error: any) {
    console.error("Failed to fetch homepage data:", error)
    // Return empty arrays on error to prevent crashing the UI
    return { articles: [], youtubeVideos: [], brandImages: [] }
  }
}
