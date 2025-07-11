"use client"

import CategoryLayout from "../../components/CategoryLayout"

const trendingArticlesData = [
  {
    id: 1,
    title: "Viral Fashion Trends Taking Over Social Media",
    slug: "viral-fashion-trends-social-media",
    image_url: "https://picsum.photos/270/405?random=111",
    author: "Social Media Team",
    publish_date: "2024-12-22",
    category: "Trending",
    excerpt: "The fashion trends that are breaking the internet right now...",
  },
  {
    id: 2,
    title: "Celebrity Style Moments That Went Viral",
    slug: "celebrity-style-moments-viral",
    image_url: "https://picsum.photos/270/405?random=112",
    author: "Style Reporter",
    publish_date: "2024-12-20",
    category: "Trending",
    excerpt: "Red carpet looks and street style that captured everyone's attention...",
  },
  {
    id: 3,
    title: "Tech Gadgets Everyone's Talking About",
    slug: "tech-gadgets-everyone-talking",
    image_url: "https://picsum.photos/270/405?random=113",
    author: "Tech Reviewer",
    publish_date: "2024-12-18",
    category: "Trending",
    excerpt: "The latest tech innovations creating buzz in the market...",
  },
  {
    id: 4,
    title: "Wellness Trends Dominating 2025",
    slug: "wellness-trends-dominating-2025",
    image_url: "https://picsum.photos/270/405?random=114",
    author: "Wellness Expert",
    publish_date: "2024-12-16",
    category: "Trending",
    excerpt: "Health and wellness practices that are gaining massive popularity...",
  },
  {
    id: 5,
    title: "Food Trends: What's Hot in Culinary World",
    slug: "food-trends-hot-culinary-world",
    image_url: "https://picsum.photos/270/405?random=115",
    author: "Food Critic",
    publish_date: "2024-12-14",
    category: "Trending",
    excerpt: "Culinary innovations and food trends taking over restaurants...",
  },
  {
    id: 6,
    title: "Travel Destinations Going Viral",
    slug: "travel-destinations-going-viral",
    image_url: "https://picsum.photos/270/405?random=116",
    author: "Travel Blogger",
    publish_date: "2024-12-12",
    category: "Trending",
    excerpt: "Hidden gems and popular destinations trending on social media...",
  },
  {
    id: 7,
    title: "Beauty Trends: Makeup Looks Everyone's Copying",
    slug: "beauty-trends-makeup-looks-copying",
    image_url: "https://picsum.photos/270/405?random=117",
    author: "Beauty Guru",
    publish_date: "2024-12-10",
    category: "Trending",
    excerpt: "The beauty looks and techniques going viral on beauty platforms...",
  },
  {
    id: 8,
    title: "Lifestyle Hacks That Actually Work",
    slug: "lifestyle-hacks-actually-work",
    image_url: "https://picsum.photos/270/405?random=118",
    author: "Lifestyle Coach",
    publish_date: "2024-12-08",
    category: "Trending",
    excerpt: "Practical life hacks that are changing how people live...",
  },
  {
    id: 9,
    title: "Another Trend",
    slug: "another-trend",
    image_url: "https://picsum.photos/270/405?random=119",
    author: "Trend Setter",
    publish_date: "2024-12-06",
    category: "Trending",
    excerpt: "A new trend on the rise...",
  },
  {
    id: 10,
    title: "Yet Another Trend",
    slug: "yet-another-trend",
    image_url: "https://picsum.photos/270/405?random=120",
    author: "Trend Watcher",
    publish_date: "2024-12-04",
    category: "Trending",
    excerpt: "Keeping up with the latest...",
  },
  {
    id: 11,
    title: "One More Trend",
    slug: "one-more-trend",
    image_url: "https://picsum.photos/270/405?random=121",
    author: "Trend Analyst",
    publish_date: "2024-12-02",
    category: "Trending",
    excerpt: "Analyzing the trend landscape...",
  },
  {
    id: 12,
    title: "The Last Trend",
    slug: "the-last-trend",
    image_url: "https://picsum.photos/270/405?random=122",
    author: "Trend Forecaster",
    publish_date: "2024-11-30",
    category: "Trending",
    excerpt: "Forecasting future trends...",
  },
  {
    id: 13,
    title: "Extra Trend 1",
    slug: "extra-trend-1",
    image_url: "https://picsum.photos/270/405?random=123",
    author: "Trend Expert",
    publish_date: "2024-11-28",
    category: "Trending",
    excerpt: "More trends to explore...",
  },
  {
    id: 14,
    title: "Extra Trend 2",
    slug: "extra-trend-2",
    image_url: "https://picsum.photos/270/405?random=124",
    author: "Trend Enthusiast",
    publish_date: "2024-11-26",
    category: "Trending",
    excerpt: "Enjoying the trend wave...",
  },
]

trendingArticlesData.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())

export default function TrendingPage() {
  return (
    <CategoryLayout
      categoryName="Trending"
      categorySlug="trending"
      description="Stay ahead of the curve with the latest trends in fashion, lifestyle, technology, and culture that everyone's talking about."
      initialArticles={trendingArticlesData} // Pass static articles to CategoryLayout
    />
  )
}
