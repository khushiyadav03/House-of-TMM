import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

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

interface CategoryLayoutProps {
  categoryName: string
  articles: Article[]
  children?: ReactNode
}

export default function CategoryLayout({ categoryName, articles, children }: CategoryLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="category-header">
        <h1 className="text-4xl font-extrabold text-gray-900">{categoryName}</h1>
        <p className="text-gray-600 mt-2">Explore the latest articles in {categoryName}.</p>
      </header>
      {children} {/* Render any additional content passed to the layout */}
      <section className="mt-8">
        <div className="category-grid">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="block">
              <Card className="category-article-card">
                <div className="category-article-image-container">
                  <Image
                    src={article.image_url || "/placeholder.svg?height=405&width=270"}
                    alt={article.title}
                    width={270}
                    height={405}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="category-article-content">
                  <h3 className="category-article-title">{article.title}</h3>
                  <div className="category-article-meta">
                    <span className="category-article-author">By {article.author}</span>
                    <span className="category-article-date">
                      {new Date(article.publish_date).toLocaleDateDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
