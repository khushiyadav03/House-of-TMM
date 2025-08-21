"use client"

import CategoryLayout from "../../components/CategoryLayout"

const interviewArticles = [
  {
    id: 1,
    title: "In Conversation with Bollywood's Rising Star",
    slug: "bollywood-rising-star-interview",
    image_url: "https://picsum.photos/270/405?random=71",
    author: "Karan Johar",
    publish_date: "2024-12-22",
    category: "Celebrity Interview",
    excerpt: "An exclusive chat with the actor who's taking Bollywood by storm...",
  },
  {
    id: 2,
    title: "Tech Entrepreneur: Building India's Future",
    slug: "tech-entrepreneur-india-future",
    image_url: "https://picsum.photos/270/405?random=72",
    author: "Radhika Gupta",
    publish_date: "2024-12-20",
    category: "Business Interview",
    excerpt: "Meet the visionary entrepreneur revolutionizing India's tech landscape...",
  },
  {
    id: 3,
    title: "Fashion Designer's Journey to Success",
    slug: "fashion-designer-success-journey",
    image_url: "https://picsum.photos/270/405?random=73",
    author: "Manish Malhotra",
    publish_date: "2024-12-18",
    category: "Fashion Interview",
    excerpt: "The inspiring story of how passion became a global fashion empire...",
  },
  {
    id: 4,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image_url: "https://picsum.photos/270/405?random=74",
    author: "Virat Kohli",
    publish_date: "2024-12-16",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 5,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image_url: "https://picsum.photos/270/405?random=75",
    author: "Virat Kohli",
    publish_date: "2024-12-15",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 6,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image_url: "https://picsum.photos/270/405?random=76",
    author: "Virat Kohli",
    publish_date: "2024-12-14",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 7,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image_url: "https://picsum.photos/270/405?random=77",
    author: "Virat Kohli",
    publish_date: "2024-12-13",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 8,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image_url: "https://picsum.photos/270/405?random=78",
    author: "Virat Kohli",
    publish_date: "2024-12-12",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 9,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image_url: "https://picsum.photos/270/405?random=79",
    author: "Virat Kohli",
    publish_date: "2024-12-11",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 10,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image_url: "https://picsum.photos/270/405?random=80",
    author: "Virat Kohli",
    publish_date: "2024-12-10",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 11,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image_url: "https://picsum.photos/270/405?random=81",
    author: "Virat Kohli",
    publish_date: "2024-12-09",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 12,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image_url: "https://picsum.photos/270/405?random=82",
    author: "Virat Kohli",
    publish_date: "2024-12-08",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 13,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image_url: "https://picsum.photos/270/405?random=83",
    author: "Virat Kohli",
    publish_date: "2024-12-07",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 14,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image_url: "https://picsum.photos/270/405?random=84",
    author: "Virat Kohli",
    publish_date: "2024-12-06",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
]

interviewArticles.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())

export default function InterviewsPage() {
  return (
    <CategoryLayout
      categoryName="Interviews"
      categorySlug="interviews"
      description="Exclusive conversations with the personalities shaping India's cultural, business, and creative landscape."
      initialArticles={interviewArticles} // Pass static articles to CategoryLayout
    />
  )
}
