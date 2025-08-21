"use client"

import CategoryLayout from "../../../components/CategoryLayout"

const otherSportsArticles = [
  {
    id: 1,
    title: "Badminton: India's Shuttlecock Superstars",
    slug: "badminton-india-superstars",
    image_url: "https://picsum.photos/270/405?random=141",
    author: "Sports Analyst",
    publish_date: "2024-12-30",
    category: "Other Sports",
    excerpt: "Celebrating the rise of Indian badminton players on the global stage.",
  },
  {
    id: 2,
    title: "Hockey: The Resurgence of India's National Sport",
    slug: "hockey-india-national-sport",
    image_url: "https://picsum.photos/270/405?random=142",
    author: "Sports Historian",
    publish_date: "2024-12-28",
    category: "Other Sports",
    excerpt: "Tracing the journey of Indian hockey back to its glory days.",
  },
  {
    id: 3,
    title: "Tennis: Indian Aces on the Court",
    slug: "tennis-indian-aces-court",
    image_url: "https://picsum.photos/270/405?random=143",
    author: "Tennis Correspondent",
    publish_date: "2024-12-26",
    category: "Other Sports",
    excerpt: "Spotlight on Indian tennis players making their mark in international tournaments.",
  },
  {
    id: 4,
    title: "Kabaddi: India's Indigenous Sport Goes Global",
    slug: "kabaddi-indigenous-sport-global",
    image_url: "https://picsum.photos/270/405?random=144",
    author: "Sports Feature Writer",
    publish_date: "2024-12-24",
    category: "Other Sports",
    excerpt: "The journey of Kabaddi from rural India to an international phenomenon.",
  },
  {
    id: 5,
    title: "Emerging Sports in India: Beyond Cricket",
    slug: "emerging-sports-india-beyond-cricket",
    image_url: "https://picsum.photos/270/405?random=145",
    author: "Sports Enthusiast",
    publish_date: "2024-12-22",
    category: "Other Sports",
    excerpt: "Exploring the growing popularity of non-cricket sports like basketball, football, and more.",
  },
]

otherSportsArticles.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())

export default function OtherSportsPage() {
  return (
    <CategoryLayout
      categoryName="Other Sports"
      categorySlug="other-sports"
      description="Coverage of various sports including tennis, badminton, hockey, and emerging sports in India."
      initialArticles={otherSportsArticles} // Pass static articles to CategoryLayout
    />
  )
}
