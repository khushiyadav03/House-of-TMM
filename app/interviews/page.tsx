"use client"

import CategoryLayout from "../../components/CategoryLayout"

const interviewArticles = [
  {
    id: 1,
    title: "In Conversation with Bollywood's Rising Star",
    slug: "bollywood-rising-star-interview",
    image: "https://picsum.photos/400/300?random=71",
    author: "Karan Johar",
    date: "December 22, 2024",
    category: "Celebrity Interview",
    excerpt: "An exclusive chat with the actor who's taking Bollywood by storm...",
  },
  {
    id: 2,
    title: "Tech Entrepreneur: Building India's Future",
    slug: "tech-entrepreneur-india-future",
    image: "https://picsum.photos/400/300?random=72",
    author: "Radhika Gupta",
    date: "December 20, 2024",
    category: "Business Interview",
    excerpt: "Meet the visionary entrepreneur revolutionizing India's tech landscape...",
  },
  {
    id: 3,
    title: "Fashion Designer's Journey to Success",
    slug: "fashion-designer-success-journey",
    image: "https://picsum.photos/400/300?random=73",
    author: "Manish Malhotra",
    date: "December 18, 2024",
    category: "Fashion Interview",
    excerpt: "The inspiring story of how passion became a global fashion empire...",
  },
  {
    id: 4,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image: "https://picsum.photos/400/300?random=74",
    author: "Virat Kohli",
    date: "December 16, 2024",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
]

export default function InterviewsPage() {
  return (
    <CategoryLayout
      categoryName="Interviews"
      categorySlug="interviews"
      description="Exclusive conversations with the personalities shaping India's cultural, business, and creative landscape."
    />
  )
}
