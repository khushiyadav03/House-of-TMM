"use client"

import CategoryLayout from "../../../components/CategoryLayout"

const golfArticles = [
  {
    id: 1,
    title: "Indian Golfers Making Waves on the International Stage",
    slug: "indian-golfers-international-stage",
    image_url: "https://picsum.photos/270/405?random=131",
    author: "Golf Correspondent",
    publish_date: "2024-12-29",
    category: "Golf",
    excerpt: "Highlighting the achievements of Indian golf professionals globally.",
  },
  {
    id: 2,
    title: "Top Golf Courses in India: A Golfer's Paradise",
    slug: "top-golf-courses-india",
    image_url: "https://picsum.photos/270/405?random=132",
    author: "Course Reviewer",
    publish_date: "2024-12-27",
    category: "Golf",
    excerpt: "Discover the most scenic and challenging golf courses across India.",
  },
  {
    id: 3,
    title: "Beginner's Guide to Golf: Tips and Essentials",
    slug: "beginners-guide-to-golf",
    image_url: "https://picsum.photos/270/405?random=133",
    author: "Golf Coach",
    publish_date: "2024-12-25",
    category: "Golf",
    excerpt: "Everything you need to know to start your journey in golf.",
  },
  {
    id: 4,
    title: "The Business of Golf: Investments and Sponsorships",
    slug: "business-of-golf-investments-sponsorships",
    image_url: "https://picsum.photos/270/405?random=134",
    author: "Sports Economist",
    publish_date: "2024-12-23",
    category: "Golf",
    excerpt: "An insight into the financial aspects and growth of golf as a sport.",
  },
  {
    id: 5,
    title: "Golf Fitness: Training for Performance",
    slug: "golf-fitness-training-performance",
    image_url: "https://picsum.photos/270/405?random=135",
    author: "Fitness Trainer",
    publish_date: "2024-12-21",
    category: "Golf",
    excerpt: "Specialized workouts to improve your swing and overall game.",
  },
]

golfArticles.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())

export default function GolfPage() {
  return (
    <CategoryLayout
      categoryName="Golf"
      categorySlug="golf"
      description="Discover the world of golf with course reviews, player profiles, and tournament coverage."
      initialArticles={golfArticles} // Pass static articles to CategoryLayout
    />
  )
}
