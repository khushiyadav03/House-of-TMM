import CategoryLayout from "@/components/CategoryLayout"

// Mock data for Finance articles
const financeArticles = [
  {
    id: 1,
    title: "Investing in the Indian Stock Market: A Beginner's Guide",
    slug: "investing-indian-stock-market",
    image_url: "/placeholder.svg?height=405&width=270&text=Finance+1",
    author: "AI Assistant",
    publish_date: "2024-07-01T10:00:00Z",
    excerpt: "Understand the basics of stock market investments and how to get started in India.",
    category: "Finance",
  },
  {
    id: 2,
    title: "Personal Finance Tips for Young Professionals",
    slug: "personal-finance-young-professionals",
    image_url: "/placeholder.svg?height=405&width=270&text=Finance+2",
    author: "AI Assistant",
    publish_date: "2024-06-28T10:00:00Z",
    excerpt: "Strategies for budgeting, saving, and debt management for early career individuals.",
    category: "Finance",
  },
  {
    id: 3,
    title: "Real Estate Investment in India: What You Need to Know",
    slug: "real-estate-investment-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Finance+3",
    author: "AI Assistant",
    publish_date: "2024-06-25T10:00:00Z",
    excerpt: "A comprehensive guide to property investment opportunities and market trends in India.",
    category: "Finance",
  },
  {
    id: 4,
    title: "Understanding Mutual Funds: A Smart Investment Option",
    slug: "understanding-mutual-funds",
    image_url: "/placeholder.svg?height=405&width=270&text=Finance+4",
    author: "AI Assistant",
    publish_date: "2024-06-20T10:00:00Z",
    excerpt: "Learn how mutual funds work and if they are the right choice for your financial goals.",
    category: "Finance",
  },
  {
    id: 5,
    title: "Retirement Planning: Securing Your Golden Years",
    slug: "retirement-planning",
    image_url: "/placeholder.svg?height=405&width=270&text=Finance+5",
    author: "AI Assistant",
    publish_date: "2024-06-15T10:00:00Z",
    excerpt: "Essential steps to plan for a comfortable and financially secure retirement.",
    category: "Finance",
  },
  {
    id: 6,
    title: "The Impact of Digital Payments on India's Economy",
    slug: "impact-digital-payments-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Finance+6",
    author: "AI Assistant",
    publish_date: "2024-06-10T10:00:00Z",
    excerpt: "How UPI and other digital platforms are transforming India's financial landscape.",
    category: "Finance",
  },
  {
    id: 7,
    title: "Cryptocurrency in India: Regulations and Opportunities",
    slug: "cryptocurrency-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Finance+7",
    author: "AI Assistant",
    publish_date: "2024-06-05T10:00:00Z",
    excerpt: "Navigating the evolving world of digital currencies and their legal status in India.",
    category: "Finance",
  },
  {
    id: 8,
    title: "Tax Saving Strategies for Indian Citizens",
    slug: "tax-saving-strategies-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Finance+8",
    author: "AI Assistant",
    publish_date: "2024-06-01T10:00:00Z",
    excerpt: "Smart ways to reduce your tax burden and maximize your savings.",
    category: "Finance",
  },
  {
    id: 9,
    title: "Starting a Small Business: Financial Planning",
    slug: "small-business-financial-planning",
    image_url: "/placeholder.svg?height=405&width=270&text=Finance+9",
    author: "AI Assistant",
    publish_date: "2024-05-28T10:00:00Z",
    excerpt: "Key financial considerations and steps for launching a successful startup.",
    category: "Finance",
  },
  {
    id: 10,
    title: "Gold Investment in India: Tradition Meets Modernity",
    slug: "gold-investment-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Finance+10",
    author: "AI Assistant",
    publish_date: "2024-05-25T10:00:00Z",
    excerpt: "Exploring the cultural significance and investment potential of gold in India.",
    category: "Finance",
  },
  {
    id: 11,
    title: "Debt Management: Strategies to Become Debt-Free",
    slug: "debt-management-strategies",
    image_url: "/placeholder.svg?height=405&width=270&text=Finance+11",
    author: "AI Assistant",
    publish_date: "2024-05-20T10:00:00Z",
    excerpt: "Practical steps and advice to pay off debt and achieve financial freedom.",
    category: "Finance",
  },
  {
    id: 12,
    title: "Financial Literacy: Empowering Yourself with Knowledge",
    slug: "financial-literacy-empowering",
    image_url: "/placeholder.svg?height=405&width=270&text=Finance+12",
    author: "AI Assistant",
    publish_date: "2024-05-15T10:00:00Z",
    excerpt: "The importance of understanding financial concepts for making informed decisions.",
    category: "Finance",
  },
].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()) // Sort by date

export default function FinancePage() {
  return (
    <CategoryLayout
      categoryName="Finance"
      categorySlug="finance"
      description="Gain insights into personal finance, investments, and economic trends shaping India's future."
      initialArticles={financeArticles}
    />
  )
}
