"use client"

import CategoryLayout from "../../../components/CategoryLayout"

const digitalCoverArticles = [
  {
    id: 1,
    title: "Digital Fashion Week: Virtual Runway Revolution",
    slug: "digital-fashion-week-virtual-runway",
    image_url: "https://picsum.photos/270/405?random=11", // Changed to image_url for consistency
    author: "Alexandra Smith",
    publish_date: "2024-12-18", // Changed to consistent date format
    category: "Digital Cover",
    excerpt: "How virtual fashion shows are changing the industry landscape...",
  },
  {
    id: 2,
    title: "NFT Fashion: The Future of Digital Couture",
    slug: "nft-fashion-digital-couture",
    image_url: "https://picsum.photos/270/405?random=12",
    author: "Marcus Johnson",
    publish_date: "2024-12-16",
    category: "Digital Cover",
    excerpt: "Exploring the intersection of blockchain technology and fashion...",
  },
  {
    id: 3,
    title: "Virtual Influencers: The New Face of Fashion",
    slug: "virtual-influencers-fashion",
    image_url: "https://picsum.photos/270/405?random=13",
    author: "Sophie Chen",
    publish_date: "2024-12-14",
    category: "Digital Cover",
    excerpt: "How AI-generated personalities are reshaping fashion marketing...",
  },
  {
    id: 4,
    title: "Augmented Reality Shopping Experience",
    slug: "ar-shopping-experience",
    image_url: "https://picsum.photos/270/405?random=14",
    author: "Ryan Martinez",
    publish_date: "2024-12-12",
    category: "Digital Cover",
    excerpt: "The future of retail through augmented reality technology...",
  },
]

// Sort articles by publish_date in descending order (newest first)
digitalCoverArticles.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())

export default function DigitalCoverPage() {
  return (
    <CategoryLayout
      categoryName="Digital Cover"
      categorySlug="digital-cover"
      description="Explore the cutting-edge world of digital fashion and virtual experiences that are shaping the future of style."
      initialArticles={digitalCoverArticles} // Pass static articles to CategoryLayout
    />
  )
}
