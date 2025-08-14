"use client"

import { useEffect } from "react"
import ArticleLayout from "../../../components/ArticleLayout"
import ArticleRenderer from "@/components/ArticleRenderer"

export default function ClientArticle({ article, slug }) {
  useEffect(() => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content_type: 'article',
        content_id: parseInt(article.id),
        event_type: 'view',
        event_data: { user_agent: navigator.userAgent }
      })
    }).catch(error => console.error('Failed to track view:', error));
  }, [article.id])

  if (!article) return null;

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