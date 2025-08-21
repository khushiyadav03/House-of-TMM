import ArticleLayout from '../../../components/ArticleLayout';
import ArticleRenderer from '@/components/ArticleRenderer';


interface FetchedArticle {
  id: number;
  title: string;
  slug: string;
  image_url: string;
  author: string;
  publish_date: string;
  excerpt?: string;
  content: string;
  relatedArticles: {
    id: number;
    title: string;
    image_url: string;
    author: string;
    publish_date: string;
  }[];
}

interface PageProps {
  params: { slug: string };
}

export default async function ArticlePage({ params }: PageProps) {
  const slug = params.slug;
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/${slug}`);
  const { article: fetched } = (await response.json()) as { article: FetchedArticle };

  const layoutArticle = {
    id: fetched.id.toString(),
    title: fetched.title,
    author: fetched.author,
    date: new Date(fetched.publish_date).toLocaleDateString(),
    imageUrl: fetched.image_url || '',
    content: fetched.content || '',
    relatedArticles:
      fetched.relatedArticles?.map((rel) => ({
        id: rel.id.toString(),
        title: rel.title,
        imageUrl: rel.image_url || '',
        author: rel.author,
        date: new Date(rel.publish_date).toLocaleDateString(),
      })) || [],
  };

  return (
    <ArticleLayout article={layoutArticle}>
      <ArticleRenderer content={layoutArticle.content} />
    </ArticleLayout>
  );
}
