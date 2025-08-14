"use client"

import { useState, useEffect } from "react"
import ArticleLayout from "../../../components/ArticleLayout"
import ArticleRenderer from "@/components/ArticleRenderer";

interface Article {
    id: string;
    title: string;
    slug: string;
    image_url: string;
    author: string;
    publish_date: string;
    excerpt: string;
    category: string;
    categories?: { name: string; slug: string }[];
    images?: any;
    content: string;
    relatedArticles: { id: string; title: string; imageUrl: string; author: string; date: string }[];
}

interface ArticleClientPageProps {
    slug: string;
}

export default function ArticleClientPage({ slug }: ArticleClientPageProps) {
    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (slug) {
            fetchArticle()
            // Track view
            fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content_type: 'article',
                    content_id: slug,
                    event_type: 'view',
                    event_data: { user_agent: navigator.userAgent }
                })
            }).catch(error => console.error('Failed to track view:', error));
        }
    }, [slug])

    const fetchArticle = async () => {
        try {
            const response = await fetch(`/api/articles/${slug}`)
            const data = await response.json()

            if (data.article) {
                const formattedArticle: Article = {
                    id: data.article.id.toString(),
                    title: data.article.title,
                    slug: data.article.slug,
                    author: data.article.author,
                    publish_date: new Date(data.article.publish_date).toLocaleDateString(),
                    image_url: data.article.image_url,
                    excerpt: data.article.excerpt || '',
                    category: data.article.category || '',
                    categories: data.article.article_categories?.map((ac: any) => ({
                        name: ac.categories?.name || '',
                        slug: ac.categories?.slug || ''
                    })) || [],
                    images: data.article.images,
                    content: data.article.content,
                    relatedArticles:
                        data.relatedArticles?.map((related: any) => ({
                            id: related.id.toString(),
                            title: related.title,
                            imageUrl: related.image_url,
                            author: related.author,
                            date: new Date(related.publish_date).toLocaleDateString(),
                        })) || [],
                }
                setArticle(formattedArticle)
            }
        } catch (error) {
            console.error("Failed to fetch article:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
                    <p className="mt-4 text-gray-600">Loading article...</p>
                </div>
            </div>
        )
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
                    <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
                    <a href="/" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                        Back to Home
                    </a>
                </div>
            </div>
        )
    }

    // Parse images JSON if present
    let images = [];
    try {
        images = article.images ? (typeof article.images === 'string' ? JSON.parse(article.images) : article.images) : [];
    } catch {
        images = [];
    }

    return (
        <ArticleLayout
            article={{
                ...article,
                imageUrl: article.image_url,
                date: article.publish_date,
            }}
        >
            <ArticleRenderer content={article.content} images={images} />
        </ArticleLayout>
    )
}