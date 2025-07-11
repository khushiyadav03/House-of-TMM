"use client"

import CategoryLayout from "../../../components/CategoryLayout"

const cricketArticles = [
  {
    id: 1,
    title: "India's Dominance in Test Cricket: A Deep Dive",
    slug: "india-dominance-test-cricket",
    image_url: "https://picsum.photos/270/405?random=121",
    author: "Cricket Analyst",
    publish_date: "2024-12-28",
    category: "Cricket",
    excerpt: "Analyzing the factors behind India's consistent success in the longest format.",
  },
  {
    id: 2,
    title: "IPL 2025: Team Strategies and Player Auctions",
    slug: "ipl-2025-team-strategies-auctions",
    image_url: "https://picsum.photos/270/405?random=122",
    author: "Sports Journalist",
    publish_date: "2024-12-26",
    category: "Cricket",
    excerpt: "A look at how teams are preparing for the upcoming Indian Premier League season.",
  },
  {
    id: 3,
    title: "Rise of Women's Cricket in India",
    slug: "rise-of-womens-cricket-india",
    image_url: "https://picsum.photos/270/405?random=123",
    author: "Sports Reporter",
    publish_date: "2024-12-24",
    category: "Cricket",
    excerpt: "Celebrating the growing popularity and achievements of Indian women cricketers.",
  },
  {
    id: 4,
    title: "Young Talents to Watch in Indian Cricket",
    slug: "young-talents-indian-cricket",
    image_url: "https://picsum.photos/270/405?random=124",
    author: "Talent Scout",
    publish_date: "2024-12-22",
    category: "Cricket",
    excerpt: "Spotlight on the emerging stars who are set to make a big impact.",
  },
  {
    id: 5,
    title: "The Evolution of T20 Cricket",
    slug: "evolution-of-t20-cricket",
    image_url: "https://picsum.photos/270/405?random=125",
    author: "Cricket Historian",
    publish_date: "2024-12-20",
    category: "Cricket",
    excerpt: "How the shortest format of the game has transformed cricket globally.",
  },
  {
    id: 6,
    title: "Fan Culture in Indian Cricket",
    slug: "fan-culture-indian-cricket",
    image_url: "https://picsum.photos/270/405?random=126",
    author: "Social Commentator",
    publish_date: "2024-12-18",
    category: "Cricket",
    excerpt: "Exploring the passion and devotion of cricket fans across India.",
  },
]

cricketArticles.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())

export default function CricketPage() {
  return (
    <CategoryLayout
      categoryName="Cricket"
      categorySlug="cricket"
      description="Follow the latest cricket news, match updates, and player insights from India and around the world."
      initialArticles={cricketArticles} // Pass static articles to CategoryLayout
    />
  )
}
