import CategoryLayout from "@/components/CategoryLayout"

// Mock data for Fitness & Selfcare articles
const fitnessSelfcareArticles = [
  {
    id: 1,
    title: "Building a Home Workout Routine That Works",
    slug: "home-workout-routine",
    image_url: "/placeholder.svg?height=405&width=270&text=Fitness+Selfcare+1",
    author: "AI Assistant",
    publish_date: "2024-07-01T10:00:00Z",
    excerpt: "Effective exercises and tips for staying fit without leaving your house.",
    category: "Fitness & Selfcare",
  },
  {
    id: 2,
    title: "The Importance of Rest Days in Your Fitness Journey",
    slug: "importance-rest-days",
    image_url: "/placeholder.svg?height=405&width=270&text=Fitness+Selfcare+2",
    author: "AI Assistant",
    publish_date: "2024-06-28T10:00:00Z",
    excerpt: "Understand why recovery is as crucial as your workouts for muscle growth and overall health.",
    category: "Fitness & Selfcare",
  },
  {
    id: 3,
    title: "Mind-Body Connection: Enhancing Your Fitness with Mindfulness",
    slug: "mind-body-connection",
    image_url: "/placeholder.svg?height=405&width=270&text=Fitness+Selfcare+3",
    author: "AI Assistant",
    publish_date: "2024-06-25T10:00:00Z",
    excerpt: "How integrating mindfulness can improve your physical performance and mental well-being.",
    category: "Fitness & Selfcare",
  },
  {
    id: 4,
    title: "Nutrition for Athletes: Fueling Your Performance",
    slug: "nutrition-for-athletes",
    image_url: "/placeholder.svg?height=405&width=270&text=Fitness+Selfcare+4",
    author: "AI Assistant",
    publish_date: "2024-06-20T10:00:00Z",
    excerpt: "Dietary guidelines and meal plans to optimize energy and recovery for active individuals.",
    category: "Fitness & Selfcare",
  },
  {
    id: 5,
    title: "Self-Care Rituals for a Busy Schedule",
    slug: "selfcare-rituals-busy-schedule",
    image_url: "/placeholder.svg?height=405&width=270&text=Fitness+Selfcare+5",
    author: "AI Assistant",
    publish_date: "2024-06-15T10:00:00Z",
    excerpt: "Simple yet effective self-care practices you can incorporate into your hectic daily life.",
    category: "Fitness & Selfcare",
  },
  {
    id: 6,
    title: "The Benefits of Outdoor Workouts",
    slug: "benefits-outdoor-workouts",
    image_url: "/placeholder.svg?height=405&width=270&text=Fitness+Selfcare+6",
    author: "AI Assistant",
    publish_date: "2024-06-10T10:00:00Z",
    excerpt: "Discover how exercising in nature can boost your mood and physical health.",
    category: "Fitness & Selfcare",
  },
  {
    id: 7,
    title: "Hydration Hacks for Optimal Performance",
    slug: "hydration-hacks",
    image_url: "/placeholder.svg?height=405&width=270&text=Fitness+Selfcare+7",
    author: "AI Assistant",
    publish_date: "2024-06-05T10:00:00Z",
    excerpt: "Tips and tricks to ensure you're adequately hydrated for peak physical and mental function.",
    category: "Fitness & Selfcare",
  },
  {
    id: 8,
    title: "Strength Training for Women: Dispelling Myths",
    slug: "strength-training-women",
    image_url: "/placeholder.svg?height=405&width=270&text=Fitness+Selfcare+8",
    author: "AI Assistant",
    publish_date: "2024-06-01T10:00:00Z",
    excerpt: "Breaking down misconceptions and highlighting the benefits of strength training for women.",
    category: "Fitness & Selfcare",
  },
  {
    id: 9,
    title: "The Role of Sleep in Muscle Recovery",
    slug: "sleep-muscle-recovery",
    image_url: "/placeholder.svg?height=405&width=270&text=Fitness+Selfcare+9",
    author: "AI Assistant",
    publish_date: "2024-05-28T10:00:00Z",
    excerpt: "Understanding how quality sleep contributes to physical repair and growth after exercise.",
    category: "Fitness & Selfcare",
  },
  {
    id: 10,
    title: "Beginner's Guide to Meditation for Stress Relief",
    slug: "meditation-stress-relief",
    image_url: "/placeholder.svg?height=405&width=270&text=Fitness+Selfcare+10",
    author: "AI Assistant",
    publish_date: "2024-05-25T10:00:00Z",
    excerpt: "Simple meditation techniques to calm your mind and reduce daily stress.",
    category: "Fitness & Selfcare",
  },
  {
    id: 11,
    title: "Yoga Poses for Flexibility and Balance",
    slug: "yoga-flexibility-balance",
    image_url: "/placeholder.svg?height=405&width=270&text=Fitness+Selfcare+11",
    author: "AI Assistant",
    publish_date: "2024-05-20T10:00:00Z",
    excerpt: "A series of yoga postures designed to improve your range of motion and stability.",
    category: "Fitness & Selfcare",
  },
  {
    id: 12,
    title: "Creating a Personalized Fitness Plan",
    slug: "personalized-fitness-plan",
    image_url: "/placeholder.svg?height=405&width=270&text=Fitness+Selfcare+12",
    author: "AI Assistant",
    publish_date: "2024-05-15T10:00:00Z",
    excerpt: "Steps to design a workout and nutrition plan tailored to your individual goals and needs.",
    category: "Fitness & Selfcare",
  },
].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()) // Sort by date

export default function FitnessSelfcarePage() {
  return (
    <CategoryLayout
      categoryName="Fitness & Selfcare"
      categorySlug="fitness-selfcare"
      description="Empower yourself with articles on fitness routines, self-care practices, and healthy living."
      initialArticles={fitnessSelfcareArticles}
    />
  )
}
