"use client"

import CategoryLayout from "../../../components/CategoryLayout"

const editorialShootArticles = [
  {
    id: 1,
    title: "Behind the Scenes: Luxury Fashion Editorial",
    slug: "luxury-fashion-editorial-bts",
    image_url: "https://picsum.photos/270/405?random=21",
    author: "Isabella Rodriguez",
    publish_date: "2024-12-20",
    category: "Editorial Shoot",
    excerpt: "An exclusive look at the making of our latest luxury fashion editorial...",
  },
  {
    id: 2,
    title: "Street Style Photography: Urban Elegance",
    slug: "street-style-urban-elegance",
    image_url: "https://picsum.photos/270/405?random=22",
    author: "Thomas Anderson",
    publish_date: "2024-12-18",
    category: "Editorial Shoot",
    excerpt: "Capturing the essence of urban fashion in metropolitan settings...",
  },
  {
    id: 3,
    title: "Minimalist Fashion: Less is More",
    slug: "minimalist-fashion-editorial",
    image_url: "https://picsum.photos/270/405?random=23",
    author: "Grace Kim",
    publish_date: "2024-12-16",
    category: "Editorial Shoot",
    excerpt: "Exploring the beauty of simplicity in contemporary fashion...",
  },
  {
    id: 4,
    title: "Avant-Garde Fashion: Breaking Boundaries",
    slug: "avant-garde-fashion-boundaries",
    image_url: "https://picsum.photos/270/405?random=24",
    author: "Oliver Thompson",
    publish_date: "2024-12-14",
    category: "Editorial Shoot",
    excerpt: "Pushing the limits of conventional fashion through artistic expression...",
  },
]

// Sort articles by publish_date in descending order (newest first)
editorialShootArticles.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())

export default function EditorialShootPage() {
  return (
    <CategoryLayout
      categoryName="Editorial Shoot"
      categorySlug="editorial-shoot"
      description="Dive into the creative process behind our most stunning editorial photography and fashion storytelling."
      initialArticles={editorialShootArticles} // Pass static articles to CategoryLayout
    />
  )
}
