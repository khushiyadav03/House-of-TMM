import { Metadata } from 'next';
import ArticleClientPage from './ArticleClientPage';

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

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ArticleClientPage slug={slug} />
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/${slug}`);
  const data = await response.json();
  const article = data.article;

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    keywords: article.seo_keywords || article.categories?.map(cat => cat.name),
  };
}
