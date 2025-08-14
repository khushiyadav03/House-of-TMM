"use client"

import { useEffect } from "react";
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

export default function ArticleClient({ article }: { article: Article }) {
  useEffect(() => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content_type: 'article',
        content_id: article.slug,
        event_type: 'view',
        event_data: { user_agent: navigator.userAgent }
      })
    }).catch(error => console.error('Failed to track view:', error));
  }, []);

  let images = [];
  try {
    images = article.images ? (typeof article.images === 'string' ? JSON.parse(article.images) : article.images) : [];
  } catch {
    images = [];
  }

  return <ArticleRenderer content={article.content} images={images} />;
}