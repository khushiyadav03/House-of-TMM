"use client"

import CategoryLayout from "../../../components/CategoryLayout"

const financeArticles = [
  {
    id: 1,
    title: "Investing for Beginners: A Simple Guide",
    slug: "investing-for-beginners-guide",
    image_url: "https://picsum.photos/270/405?random=101",
    author: "Financial Advisor",
    publish_date: "2024-12-27",
    category: "Finance",
    excerpt: "Start your investment journey with fundamental concepts and strategies.",
  },
  {
    id: 2,
    title: "Budgeting Basics: Managing Your Money Effectively",
    slug: "budgeting-basics-money-management",
    image_url: "https://picsum.photos/270/405?random=102",
    author: "Money Coach",
    publish_date: "2024-12-25",
    category: "Finance",
    excerpt: "Learn practical tips to create a budget and take control of your finances.",
  },
  {
    id: 3,
    title: "Real Estate in India: Trends and Opportunities",
    slug: "real-estate-india-trends-opportunities",
    image_url: "https://picsum.photos/270/405?random=103",
    author: "Property Analyst",
    publish_date: "2024-12-23",
    category: "Finance",
    excerpt: "Explore the dynamic Indian real estate market and its investment potential.",
  },
  {
    id: 4,
    title: "Retirement Planning: Securing Your Future",
    slug: "retirement-planning-securing-future",
    image_url: "https://picsum.photos/270/405?random=104",
    author: "Retirement Specialist",
    publish_date: "2024-12-21",
    category: "Finance",
    excerpt: "Essential steps to plan for a comfortable and secure retirement.",
  },
  {
    id: 5,
    title: "Understanding Cryptocurrency: A Beginner's Guide",
    slug: "understanding-cryptocurrency-guide",
    image_url: "https://picsum.photos/270/405?random=105",
    author: "Crypto Expert",
    publish_date: "2024-12-19",
    category: "Finance",
    excerpt: "Demystify the world of digital currencies and blockchain technology.",
  },
  {
    id: 6,
    title: "Tax Saving Strategies for Indians",
    slug: "tax-saving-strategies-indians",
    image_url: "https://picsum.photos/270/405?random=106",
    author: "Tax Consultant",
    publish_date: "2024-12-17",
    category: "Finance",
    excerpt: "Smart ways to reduce your tax burden and maximize your savings.",
  },
]

financeArticles.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())

export default function FinancePage() {
  return (
    <CategoryLayout
      categoryName="Finance"
      categorySlug="finance"
      description="Smart financial advice, investment tips, and money management strategies for modern living."
      initialArticles={financeArticles} // Pass static articles to CategoryLayout
    />
  )
}
