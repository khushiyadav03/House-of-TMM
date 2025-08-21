"use client"

import CategoryLayout from "../../components/CategoryLayout"
import Image from "next/image"
import Link from "next/link"
import Footer from "../../components/Footer"
import { useState } from "react"

const allCoverArticles = [
  {
    id: 1,
    title: "Digital Fashion Revolution: The New Era of Style",
    slug: "digital-fashion-revolution",
    image_url: "https://picsum.photos/400/300?random=1",
    author: "Sarah Johnson",
    publish_date: "2024-12-15",
    category: "Digital Cover",
    excerpt: "Exploring how digital technology is transforming the fashion industry...",
  },
  {
    id: 2,
    title: "Behind the Lens: Editorial Photography Masterclass",
    slug: "editorial-photography-masterclass",
    image_url: "https://picsum.photos/400/300?random=2",
    author: "Michael Chen",
    publish_date: "2024-12-12",
    category: "Editorial Shoot",
    excerpt: "A deep dive into the art of editorial photography and storytelling...",
  },
  {
    id: 3,
    title: "Cover Story: Rising Stars of 2025",
    slug: "rising-stars-2025",
    image_url: "https://picsum.photos/400/300?random=3",
    author: "Emma Wilson",
    publish_date: "2024-12-10",
    category: "Cover Story",
    excerpt: "Meet the personalities who will define the next year...",
  },
  {
    id: 4,
    title: "Fashion Forward: Sustainable Couture",
    slug: "sustainable-couture",
    image_url: "https://picsum.photos/400/300?random=4",
    author: "David Martinez",
    publish_date: "2024-12-08",
    category: "Digital Cover",
    excerpt: "How sustainable practices are reshaping high fashion...",
  },
  {
    id: 5,
    title: "The Art of Visual Storytelling",
    slug: "visual-storytelling-art",
    image_url: "https://picsum.photos/400/300?random=5",
    author: "Lisa Thompson",
    publish_date: "2024-12-05",
    category: "Editorial Shoot",
    excerpt: "Creating compelling narratives through visual media...",
  },
  {
    id: 6,
    title: "Iconic Covers That Changed Fashion",
    slug: "iconic-covers-fashion",
    image_url: "https://picsum.photos/400/300?random=6",
    author: "James Rodriguez",
    publish_date: "2024-12-03",
    category: "Cover Story",
    excerpt: "A retrospective look at magazine covers that made history...",
  },
  {
    id: 7,
    title: "Fashion Photography: Art Meets Commerce",
    slug: "fashion-photography-art-commerce",
    image_url: "https://picsum.photos/400/300?random=7",
    author: "Photo Director",
    publish_date: "2024-12-01",
    category: "Cover Story",
    excerpt: "The intersection of artistic vision and commercial success...",
  },
  {
    id: 8,
    title: "Digital Transformation in Fashion Media",
    slug: "digital-transformation-fashion-media",
    image_url: "https://picsum.photos/400/300?random=8",
    author: "Digital Editor",
    publish_date: "2024-11-28",
    category: "Digital Cover",
    excerpt: "How digital platforms are reshaping fashion journalism...",
  },
  {
    id: 9,
    title: "Sustainable Fashion Editorial",
    slug: "sustainable-fashion-editorial",
    image_url: "https://picsum.photos/400/300?random=9",
    author: "Eco Fashion Editor",
    publish_date: "2024-11-25",
    category: "Editorial Shoot",
    excerpt: "Creating beautiful fashion stories with environmental consciousness...",
  },
  {
    id: 10,
    title: "Celebrity Cover Stories That Made Headlines",
    slug: "celebrity-cover-stories-headlines",
    image_url: "https://picsum.photos/400/300?random=10",
    author: "Celebrity Editor",
    publish_date: "2024-11-22",
    category: "Cover Story",
    excerpt: "The most talked-about celebrity covers of the year...",
  },
  {
    id: 11,
    title: "Virtual Fashion Shows: The New Normal",
    slug: "virtual-fashion-shows-new-normal",
    image_url: "https://picsum.photos/400/300?random=11",
    author: "Fashion Tech Writer",
    publish_date: "2024-11-20",
    category: "Digital Cover",
    excerpt: "How virtual presentations are changing fashion week...",
  },
  {
    id: 12,
    title: "Behind the Scenes: Magazine Production",
    slug: "behind-scenes-magazine-production",
    image_url: "https://picsum.photos/400/300?random=12",
    author: "Production Team",
    publish_date: "2024-11-18",
    category: "Editorial Shoot",
    excerpt: "The intricate process of bringing a magazine to life...",
  },
  // Page 2 articles
  {
    id: 13,
    title: "Fashion Week Backstage Stories",
    slug: "fashion-week-backstage-stories",
    image_url: "https://picsum.photos/400/300?random=13",
    author: "Backstage Reporter",
    publish_date: "2024-11-15",
    category: "Editorial Shoot",
    excerpt: "Exclusive access to the chaos and creativity behind the runway...",
  },
  {
    id: 14,
    title: "Digital Fashion: NFTs and Virtual Clothing",
    slug: "digital-fashion-nfts-virtual-clothing",
    image_url: "https://picsum.photos/400/300?random=14",
    author: "Tech Fashion Writer",
    publish_date: "2024-11-12",
    category: "Digital Cover",
    excerpt: "The future of fashion in the metaverse and blockchain...",
  },
  {
    id: 15,
    title: "Cover Model Spotlight: New Faces",
    slug: "cover-model-spotlight-new-faces",
    image_url: "https://picsum.photos/400/300?random=15",
    author: "Model Scout",
    publish_date: "2024-11-10",
    category: "Cover Story",
    excerpt: "Introducing the fresh faces gracing magazine covers...",
  },
]

export default function CoverPage() {
  return (
    <CategoryLayout
      categoryName="Cover"
      categorySlug="cover"
      description="Discover our featured stories, digital covers, and editorial shoots that define contemporary culture and style."
      initialArticles={allCoverArticles}
    />
  )
}
