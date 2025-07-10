import Image from "next/image"
import Link from "next/link"
import { getArticlesByCategory } from "@/lib/supabase"
import CategoryLayout from "@/components/CategoryLayout"

interface Article {
  id: number
  title: string
  slug: string
  content?: string
  excerpt?: string
  image_url?: string
  author?: string
  publish_date: string
  created_at?: string
  updated_at?: string
  status: "published" | "draft" | "scheduled"
  scheduled_date?: string
  likes: number
  views: number
  featured: boolean
}

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function BrandFeatureFashionPage(props: PageProps) {
  const searchParams = await props.searchParams
  const currentPage = Number(searchParams.page) || 1
  const articlesPerPage = 12

  let articles: Article[] = []
  let totalArticles = 0

  try {
    const result = await getArticlesByCategory("fashion", currentPage, articlesPerPage)
    articles = result.articles || []
    totalArticles = result.total || 0
  } catch (error) {
    console.error("Failed to fetch fashion articles:", error)
  }

  const totalPages = Math.ceil(totalArticles / articlesPerPage)

  return (
    <CategoryLayout
      title="Brand Feature - Fashion"
      description="Discover the latest fashion brand collaborations and style features"
      currentPage={currentPage}
      totalPages={totalPages}
      baseUrl="/BrandFeature/fashion"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link href={`/articles/${article.slug}`}>
              <div className="relative h-48">
                <Image
                  src={article.image_url || "/placeholder.svg?height=192&width=384"}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h2>
                {article.excerpt && <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.excerpt}</p>}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{article.author}</span>
                  <span>{new Date(article.publish_date).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No fashion articles found</h3>
          <p className="text-gray-600">Check back later for new fashion brand features and collaborations.</p>
        </div>
      )}
    </CategoryLayout>
  )
}
