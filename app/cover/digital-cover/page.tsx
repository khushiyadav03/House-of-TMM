import CategoryLayout from "@/components/CategoryLayout"

// Mock data for Digital Cover articles
const digitalCoverArticles = [
  {
    id: 1,
    title: "Digital Cover: The Rise of Virtual Fashion",
    slug: "digital-cover-virtual-fashion",
    image_url: "/placeholder.svg?height=405&width=270&text=Digital+Cover+1",
    author: "AI Assistant",
    publish_date: "2024-07-01T10:00:00Z",
    excerpt: "Explore how digital fashion is transforming the industry and creating new opportunities.",
    category: "Digital Cover",
  },
  {
    id: 2,
    title: "Metaverse Style: Dressing Your Avatar",
    slug: "metaverse-style-avatar-dressing",
    image_url: "/placeholder.svg?height=405&width=270&text=Digital+Cover+2",
    author: "AI Assistant",
    publish_date: "2024-06-25T10:00:00Z",
    excerpt: "A guide to the latest trends in virtual clothing and accessories for your digital self.",
    category: "Digital Cover",
  },
  {
    id: 3,
    title: "NFT Fashion: Collectibles and Wearables",
    slug: "nft-fashion-collectibles",
    image_url: "/placeholder.svg?height=405&width=270&text=Digital+Cover+3",
    author: "AI Assistant",
    publish_date: "2024-06-20T10:00:00Z",
    excerpt: "Dive into the world of non-fungible token fashion and its impact on ownership.",
    category: "Digital Cover",
  },
  {
    id: 4,
    title: "Augmented Reality in Fashion Shows",
    slug: "ar-fashion-shows",
    image_url: "/placeholder.svg?height=405&width=270&text=Digital+Cover+4",
    author: "AI Assistant",
    publish_date: "2024-06-15T10:00:00Z",
    excerpt: "How AR is revolutionizing the way designers present their collections.",
    category: "Digital Cover",
  },
  {
    id: 5,
    title: "The Future of Digital Textiles",
    slug: "future-digital-textiles",
    image_url: "/placeholder.svg?height=405&width=270&text=Digital+Cover+5",
    author: "AI Assistant",
    publish_date: "2024-06-10T10:00:00Z",
    excerpt: "Innovations in digital fabric creation and their sustainable implications.",
    category: "Digital Cover",
  },
  {
    id: 6,
    title: "Virtual Influencers: The New Face of Fashion",
    slug: "virtual-influencers-fashion",
    image_url: "/placeholder.svg?height=405&width=270&text=Digital+Cover+6",
    author: "AI Assistant",
    publish_date: "2024-06-05T10:00:00Z",
    excerpt: "Examining the growing influence of AI-generated personalities in the fashion world.",
    category: "Digital Cover",
  },
  {
    id: 7,
    title: "Gaming and Fashion: A New Frontier",
    slug: "gaming-fashion-frontier",
    image_url: "/placeholder.svg?height=405&width=270&text=Digital+Cover+7",
    author: "AI Assistant",
    publish_date: "2024-05-30T10:00:00Z",
    excerpt: "How video games are becoming a major platform for fashion brands.",
    category: "Digital Cover",
  },
  {
    id: 8,
    title: "Digital Fashion Week: A Global Phenomenon",
    slug: "digital-fashion-week",
    image_url: "/placeholder.svg?height=405&width=270&text=Digital+Cover+8",
    author: "AI Assistant",
    publish_date: "2024-05-25T10:00:00Z",
    excerpt: "Recap of the most innovative digital fashion shows from around the world.",
    category: "Digital Cover",
  },
  {
    id: 9,
    title: "The Ethics of AI in Fashion Design",
    slug: "ethics-ai-fashion",
    image_url: "/placeholder.svg?height=405&width=270&text=Digital+Cover+9",
    author: "AI Assistant",
    publish_date: "2024-05-20T10:00:00Z",
    excerpt: "Discussing the moral implications and responsibilities of using AI in creative processes.",
    category: "Digital Cover",
  },
  {
    id: 10,
    title: "Customizing Your Digital Wardrobe",
    slug: "customizing-digital-wardrobe",
    image_url: "/placeholder.svg?height=405&width=270&text=Digital+Cover+10",
    author: "AI Assistant",
    publish_date: "2024-05-15T10:00:00Z",
    excerpt: "Tips and tricks for personalizing your digital clothing collection.",
    category: "Digital Cover",
  },
  {
    id: 11,
    title: "The Impact of NFTs on Fashion Ownership",
    slug: "nfts-fashion-ownership",
    image_url: "/placeholder.svg?height=405&width=270&text=Digital+Cover+11",
    author: "AI Assistant",
    publish_date: "2024-05-10T10:00:00Z",
    excerpt: "How blockchain technology is redefining what it means to own fashion.",
    category: "Digital Cover",
  },
  {
    id: 12,
    title: "Virtual Try-On: The Future of Online Shopping",
    slug: "virtual-try-on-shopping",
    image_url: "/placeholder.svg?height=405&width=270&text=Digital+Cover+12",
    author: "AI Assistant",
    publish_date: "2024-05-05T10:00:00Z",
    excerpt: "Exploring the technology that allows you to try on clothes virtually before buying.",
    category: "Digital Cover",
  },
].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()) // Sort by date

export default function DigitalCoverPage() {
  return (
    <CategoryLayout
      categoryName="Digital Cover"
      categorySlug="digital-cover"
      description="Explore the cutting-edge world of digital fashion, virtual reality, and the metaverse."
      initialArticles={digitalCoverArticles}
    />
  )
}
