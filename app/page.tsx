"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { Swiper as SwiperInstance } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/scrollbar"
import Footer from "../components/Footer"

interface Article {
  id: number
  title: string
  slug: string
  image_url: string
  author: string
  publish_date: string
  excerpt: string
  category: string
  categories?: { id: number; name: string; slug: string }[] // Add this for subcategory support
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

export default function Home() {
  const swiperRef = useRef<SwiperInstance | null>(null)
  const brandsSwiperRef = useRef<SwiperInstance | null>(null)

  const [carouselArticles, setCarouselArticles] = useState<Article[]>([])
  const [latestNews, setLatestNews] = useState<Article[]>([])
  const [fashionArticles, setFashionArticles] = useState<Article[]>([])
  const [techAutoArticles, setTechAutoArticles] = useState<Article[]>([])
  const [sportsArticles, setSportsArticles] = useState<Article[]>([])
  const [financeArticles, setFinanceArticles] = useState<Article[]>([])
  const [travelArticles, setTravelArticles] = useState<Article[]>([])
  const [healthWellnessArticles, setHealthWellnessArticles] = useState<Article[]>([])
  const [featuredMagazine, setFeaturedMagazine] = useState<Magazine | null>(null)
  const [mainVideo, setMainVideo] = useState<YoutubeVideo | null>(null)
  const [recommendedVideos, setRecommendedVideos] = useState<YoutubeVideo[]>([])
  const [brandLogos, setBrandLogos] = useState<BrandImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomepageData()
    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }
      if (brandsSwiperRef.current) {
        brandsSwiperRef.current.destroy(true, true)
        brandsSwiperRef.current = null
      }
    }
  }, [])

  const fetchHomepageData = async () => {
    try {
      setLoading(true)

      // Fetch all data in parallel
      const [articlesResponse, magazinesResponse, videosResponse, brandsResponse, homepageContentResponse] = await Promise.all([
        fetch("/api/articles?limit=100"),
        fetch("/api/magazines"),
        fetch("/api/youtube-videos"),
        fetch("/api/brand-images"),
        fetch("/api/homepage-content"),
      ])

      const articlesData = await articlesResponse.json()
      const magazinesData = await magazinesResponse.json()
      const videosData = await videosResponse.json()
      const brandsData = await brandsResponse.json()
      const homepageContentData = await homepageContentResponse.json()

      const allArticles = articlesData.articles || []
      const allMagazines = magazinesData || []
      const allVideos = videosData || []
      const allBrands = brandsData || []

      // Convert homepage content to object
      const homepageContent: any = {}
      homepageContentData.forEach((item: any) => {
        homepageContent[item.section_name] = item.content
      })

      // Use saved content from admin panel, fallback to hardcoded logic
      const carouselContent = homepageContent.carousel_articles?.selected_articles || []
      const latestContent = homepageContent.latest_news?.selected_articles || []
      const fashionContent = homepageContent.fashion_section?.selected_articles || []
      const techAutoContent = homepageContent.tech_auto_section?.selected_articles || []
      const sportsContent = homepageContent.sports_section?.selected_articles || []
      const financeContent = homepageContent.finance_section?.selected_articles || []
      const travelContent = homepageContent.travel_section?.selected_articles || []
      const featuredMagazineId = homepageContent.featured_magazine?.selected_magazine

      // Set carousel articles (use saved content or fallback)
      if (carouselContent.length > 0) {
        const selectedArticles = allArticles.filter((article: Article) => 
          carouselContent.includes(article.id)
        )
        setCarouselArticles(selectedArticles)
      } else {
      setCarouselArticles(allArticles.slice(0, 8))
      }

      // Set latest news (use saved content or fallback)
      if (latestContent.length > 0) {
        const selectedArticles = allArticles.filter((article: Article) => 
          latestContent.includes(article.id)
        )
        setLatestNews(selectedArticles)
      } else {
      setLatestNews(allArticles.slice(8, 14))
      }

      // Set fashion articles (use saved content or fallback)
      if (fashionContent.length > 0) {
        const selectedArticles = allArticles.filter((article: Article) => 
          fashionContent.includes(article.id)
        )
        setFashionArticles(selectedArticles)
      } else {
      const fashionArticles = allArticles.filter((article: Article) =>
        article.category?.toLowerCase().includes("fashion"),
      )
      setFashionArticles(fashionArticles.slice(0, 3))
      }

      // Set tech & auto articles (use saved content or fallback)
      if (techAutoContent.length > 0) {
        const selectedArticles = allArticles.filter((article: Article) => 
          techAutoContent.includes(article.id)
        )
        setTechAutoArticles(selectedArticles)
      } else {
      const techArticles = allArticles.filter(
        (article: Article) =>
          article.category?.toLowerCase().includes("tech") || article.category?.toLowerCase().includes("auto"),
      )
      setTechAutoArticles(techArticles.slice(0, 8))
      }

      // Set sports articles (use saved content or fallback)
      if (sportsContent.length > 0) {
        const selectedArticles = allArticles.filter((article: Article) => 
          sportsContent.includes(article.id)
        )
        setSportsArticles(selectedArticles)
      } else {
      const sportsArticles = allArticles.filter((article: Article) => article.category?.toLowerCase().includes("sport"))
      setSportsArticles(sportsArticles.slice(0, 8))
      }

      // Set finance articles (use saved content or fallback)
      if (financeContent.length > 0) {
        const selectedArticles = allArticles.filter((article: Article) => 
          financeContent.includes(article.id)
        )
        setFinanceArticles(selectedArticles)
      } else {
      const financeArticles = allArticles.filter((article: Article) =>
        article.category?.toLowerCase().includes("finance"),
      )
      setFinanceArticles(financeArticles.slice(0, 4))
      }

      // Set travel articles (use saved content or fallback)
      if (travelContent.length > 0) {
        const selectedArticles = allArticles.filter((article: Article) => 
          travelContent.includes(article.id)
        )
        setTravelArticles(selectedArticles)
      } else {
      const travelArticles = allArticles.filter((article: Article) =>
        article.category?.toLowerCase().includes("travel"),
      )
      setTravelArticles(travelArticles.slice(0, 4))
      }

      // Set health & wellness articles (fallback only, no admin section for this)
      const healthArticles = allArticles.filter(
        (article: Article) =>
          article.category?.toLowerCase().includes("health") || article.category?.toLowerCase().includes("wellness"),
      )
      setHealthWellnessArticles(healthArticles.slice(0, 3))

      // Set featured magazine (use saved content or fallback)
      if (featuredMagazineId) {
        const selectedMagazine = allMagazines.find((magazine: Magazine) => magazine.id === featuredMagazineId)
        setFeaturedMagazine(selectedMagazine || allMagazines[0] || null)
      } else {
      setFeaturedMagazine(allMagazines[0] || null)
      }

      // Set videos
      const mainVideo = allVideos.find((video: YoutubeVideo) => video.is_main_video)
      setMainVideo(mainVideo || allVideos[0] || null)

      const recommendedVideos = allVideos.filter((video: YoutubeVideo) => !video.is_main_video)
      setRecommendedVideos(recommendedVideos.slice(0, 7))

      // Set brand images
      setBrandLogos(allBrands)
    } catch (error) {
      console.error("Failed to fetch homepage data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Carousel Section */}
      <section className="w-full pt-4 pb-4">
        <div className="carousel-wrapper p-0 m-0">
          <Swiper
            className="homepage-main-carousel"
            modules={[Autoplay, Pagination]}
            slidesPerView={1.2}
            spaceBetween={8}
            loop={true}
            loopAdditionalSlides={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ el: ".swiper-pagination", clickable: true }}
            centeredSlides={true}
            breakpoints={{
              1280: { slidesPerView: 4, spaceBetween: 0, centeredSlides: false },
              1024: { slidesPerView: 3.5, spaceBetween: 0, centeredSlides: false },
              768: { slidesPerView: 3, spaceBetween: 0, centeredSlides: false },
              0: { slidesPerView: 1.2, spaceBetween: 8, centeredSlides: true },
            }}
            style={{ margin: 0, padding: 0, display: 'flex', gap: 0 }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper
            }}
          >
            {carouselArticles.map((article, index) => (
              <SwiperSlide key={article.id} className="!w-[325px] !h-[500px] !m-0 !p-0 block">
                <Link href={`/articles/${article.slug}`} className="block w-full">
                  <div
                    className="custom-carousel-slide relative flex items-end justify-center"
                    style={{
                      width: '325px',
                      height: '500px',
                      backgroundImage: `url(${article.image_url || "/placeholder.svg?height=500&width=325"})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <div className="custom-carousel-overlay absolute bottom-0 left-0 w-full flex flex-col items-center justify-end p-6">
                      <div className="custom-carousel-category mb-2">
                        {article.categories && article.categories.length > 0 ? (
                          <span className="custom-carousel-category-label">
                            {article.categories[0].name}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="custom-carousel-title text-white text-xl font-extrabold text-center mb-2">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
            <div className="swiper-pagination"></div>
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
                {latestNews.map((article) => (
                  <article key={article.id} className="news-card !rounded-none">
                    <Link href={`/articles/${article.slug}`} className="block">
                      <div className="relative w-[283px] h-[400px] news-image-container">
                        <Image
                          src={article.image_url || "/placeholder.svg?height=400&width=283"}
                          alt={article.title}
                          fill
                          className="object-cover !rounded-none"
                          loading="lazy"
                          sizes="283px"
                        />
                      </div>
                      <div className="news-content">
                        <span className="news-category">{article.category}</span>
                        <h3 className="news-title">
                          {article.title}
                          <div className="news-tooltip">
                            {article.title}
                            <div className="news-tooltip-arrow"></div>
                          </div>
                        </h3>
                        <div className="news-meta">
                          <span className="news-author">{article.author}</span>
                          <span className="news-date">{new Date(article.publish_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
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
              {fashionArticles.length > 0 && (
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Main Fashion Article */}
                  <article className="news-card-large md:w-3/5 !rounded-none">
                    <Link href={`/articles/${fashionArticles[0].slug}`}>
                      <div className="relative w-[483px] h-[520px] news-image-container-large">
                        <Image
                          src={fashionArticles[0].image_url || "/placeholder.svg?height=520&width=483"}
                          alt={fashionArticles[0].title}
                          fill
                          className="object-cover !rounded-none"
                          loading="lazy"
                          sizes="483px"
                        />
                      </div>
                      <div className="news-content-large text-center">
                        <h3 className="news-title-large">{fashionArticles[0].title}</h3>
                        <div className="news-meta">
                          <span className="news-author">{fashionArticles[0].author}</span>
                          <span className="news-date">
                            {new Date(fashionArticles[0].publish_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>

                  {/* Side Fashion Articles */}
                  <div className="md:w-2/5 flex flex-col gap-3">
                    {fashionArticles.slice(1).map((article) => (
                      <article key={article.id} className="news-card-small !rounded-none">
                        <Link href={`/articles/${article.slug}`}>
                          <div className="relative w-[300px] h-[208px] news-image-container-small">
                            <Image
                              src={article.image_url || "/placeholder.svg?height=208&width=300"}
                              alt={article.title}
                              fill
                              className="object-cover w-full h-[208px]"
                              loading="lazy"
                              sizes="300px"
                            />
                          </div>
                          <div className="news-content-small">
                            <h3 className="news-title">{article.title}</h3>
                            <div className="news-meta-small">
                              <span className="news-author">{article.author}</span>
                              <span className="news-date">{new Date(article.publish_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 flex flex-col items-stretch gap-6 min-h-full">
            {/* Featured Magazine */}
            <div className="magazine-cover-container bg-gray-100">
              {featuredMagazine ? (
                <>
                  <Image
                    src={featuredMagazine.cover_image_url || "/placeholder.svg?height=500&width=350"}
                    alt={featuredMagazine.title}
                    width={350}
                    height={500}
                    className="w-full max-w-full h-auto object-cover mb-2 !rounded-none aspect-[7/10]"
                    loading="lazy"
                    sizes="350px"
                  />
                  <Link
                    href="/magazine"
                    className="inline-block w-full text-center py-3 bg-black text-white font-montserrat font-semibold hover:bg-gray-800 transition-colors !rounded-none"
                  >
                    Get It - ₹{featuredMagazine.price}
                  </Link>
                </>
              ) : (
                <>
                  <Image
                    src="/placeholder.svg?height=500&width=350"
                    alt="Magazine Cover"
                    width={350}
                    height={500}
                    className="w-full max-w-full h-auto object-cover mb-2 !rounded-none aspect-[7/10]"
                    loading="lazy"
                    sizes="350px"
                  />
                  <Link
                    href="/magazine"
                    className="inline-block w-full text-center py-3 bg-black text-white font-montserrat font-semibold hover:bg-gray-800 transition-colors !rounded-none"
                  >
                    Get It
                  </Link>
                </>
              )}
            </div>

            {/* Health & Wellness */}
            <div className="health-wellness-sidebar">
              <h2 className="text-3xl font-montserrat font-extrabold mb-6">Health & Wellness</h2>
              {healthWellnessArticles.map((article) => (
                <article key={article.id} className="health-wellness-article flex gap-4 mb-6">
                  <Link href={`/articles/${article.slug}`}>
                    <Image
                      src={article.image_url || "/placeholder.svg?height=109&width=146"}
                      alt={article.title}
                      width={146}
                      height={109}
                      className="health-wellness-image object-cover !rounded-none"
                      loading="lazy"
                      sizes="146px"
                    />
                  </Link>
                  <div className="flex flex-col justify-between">
                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="news-title">{article.title}</h3>
                    </Link>
                    <div className="news-meta">
                      <span className="news-author">{article.author}</span>
                      <span className="news-date">{new Date(article.publish_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              ))}
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
              {techAutoArticles.map((article) => (
                <article key={article.id} className="news-card !rounded-none">
                  <Link href={`/articles/${article.slug}`} className="block">
                    <div className="relative w-[283px] h-[400px] news-image-container">
                      <Image
                        src={article.image_url || "/placeholder.svg?height=400&width=283"}
                        alt={article.title}
                        fill
                        className="object-cover !rounded-none"
                        loading="lazy"
                        sizes="283px"
                      />
                    </div>
                    <div className="news-content">
                      <h3 className="news-title">{article.title}</h3>
                      <div className="news-meta">
                        <span className="news-author">{article.author}</span>
                        <span className="news-date">{new Date(article.publish_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
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
                  src={mainVideo?.video_url || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                  title={mainVideo?.title || "Featured Video"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className="lg:w-[380px] w-full recommended-videos-container">
              <div className="recommended-videos-slider">
                {recommendedVideos.map((video) => (
                  <div key={video.id} className="recommended-video-item mb-4">
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3"
                    >
                      <div className="relative w-[120px] h-[80px] flex-shrink-0">
                        <Image
                          src={video.thumbnail_url || "/placeholder.svg?height=80&width=120"}
                          alt={video.title}
                          width={120}
                          height={80}
                          className="absolute top-0 left-0 w-full h-full object-cover"
                          sizes="120px"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white line-clamp-2">{video.title}</h4>
                      </div>
                    </a>
                  </div>
                ))}
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
              {sportsArticles.map((article) => (
                <article key={article.id} className="news-card !rounded-none">
                  <Link href={`/articles/${article.slug}`} className="block">
                    <div className="relative w-[283px] h-[400px] news-image-container">
                      <Image
                        src={article.image_url || "/placeholder.svg?height=400&width=283"}
                        alt={article.title}
                        fill
                        className="object-cover !rounded-none"
                        loading="lazy"
                        sizes="283px"
                      />
                    </div>
                    <div className="news-content">
                      <h3 className="news-title">{article.title}</h3>
                      <div className="news-meta">
                        <span className="news-author">{article.author}</span>
                        <span className="news-date">{new Date(article.publish_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
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
            {financeArticles.map((article) => (
              <article key={article.id} className="finance-article flex flex-row lg:items-start gap-4 mb-6">
                <Link href={`/articles/${article.slug}`}>
                  <div className="relative w-[226px] h-[300px]">
                  <Image
                      src={article.image_url || "/placeholder.svg?height=300&width=226"}
                    alt={article.title}
                      fill
                      className="object-cover !rounded-none flex-shrink-0"
                    loading="lazy"
                    sizes="226px"
                  />
                  </div>
                </Link>
                <div className="flex flex-col justify-start">
                  <Link href={`/articles/${article.slug}`}>
                    <h3 className="news-title text-lg font-extrabold text-gray-900 hover:text-gray-600 line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                  <div className="news-meta flex gap-4 text-sm text-gray-600">
                    <span className="news-author">{article.author}</span>
                    <span className="news-date">{new Date(article.publish_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}
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
            {travelArticles.map((article) => (
              <article key={article.id} className="travel-article relative mb-16 mx-auto max-w-[360px] pb-4">
                <Link href={`/articles/${article.slug}`}>
                  <div className="relative w-[360px] h-[250px]">
                    <Image
                      src={article.image_url || "/placeholder.svg?height=250&width=360"}
                      alt={article.title}
                      fill
                      className="object-cover !rounded-none !w-full !h-[250px] aspect-[360/250]"
                      loading="lazy"
                      sizes="360px"
                    />
                    <div className="travel-overlay absolute top-[60%] left-0 w-[320px] mx-5 h-[153px] bg-white text-center flex flex-col justify-center pb-2 hover:border hover:border-black transition-all duration-200">
                      <h3 className="text-lg font-montserrat font-extrabold text-gray-800 mb-2 hover:text-gray-900 line-clamp-3">
                        {article.title}
                      </h3>
                      <div className="text-sm text-gray-600 flex justify-center items-center gap-2">
                        <span>{article.author}</span>
                        <span>{new Date(article.publish_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
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
                brandsSwiperRef.current = swiper
              }}
            >
              {[...brandLogos, ...brandLogos].map((logo, index) => (
                <SwiperSlide
                  key={`${logo.id}-${index}`}
                  style={{
                    width: "376.66px",
                    height: "150.66px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={logo.image_url || "/placeholder.svg?height=150&width=376"}
                      alt={logo.title}
                      width={376}
                      height={150}
                      className="object-contain"
                      loading="lazy"
                      sizes="376px"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </section>
    </div>
  )
}