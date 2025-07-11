"use client"

import CategoryLayout from "../../../components/CategoryLayout"

const foodDrinksArticles = [
  {
    id: 1,
    title: "Mumbai's Hidden Culinary Gems",
    slug: "mumbai-hidden-culinary-gems",
    image: "https://picsum.photos/400/300?random=51",
    author: "Chef Meera Tandon",
    date: "December 22, 2024",
    category: "Food & Drinks",
    excerpt: "Discover the secret restaurants and street food spots that locals love...",
  },
  {
    id: 2,
    title: "Craft Cocktails: Indian Flavors Revolution",
    slug: "craft-cocktails-indian-flavors",
    image: "https://picsum.photos/400/300?random=52",
    author: "Arjun Mixologist",
    date: "December 20, 2024",
    category: "Food & Drinks",
    excerpt: "How Indian spices and ingredients are transforming the cocktail scene...",
  },
  {
    id: 3,
    title: "Farm to Table: Sustainable Dining",
    slug: "farm-to-table-sustainable-dining",
    image: "https://picsum.photos/400/300?random=53",
    author: "Priya Organic",
    date: "December 18, 2024",
    category: "Food & Drinks",
    excerpt: "Restaurants leading the sustainable and organic food movement...",
  },
  {
    id: 4,
    title: "Regional Indian Cuisines: A Culinary Journey",
    slug: "regional-indian-cuisines-journey",
    image: "https://picsum.photos/400/300?random=54",
    author: "Ravi Foodie",
    date: "December 16, 2024",
    category: "Food & Drinks",
    excerpt: "Exploring the diverse flavors from different states of India...",
  },
]

export default function FoodDrinksPage() {
  return (
    <CategoryLayout
      categoryName="Food & Drinks"
      categorySlug="food-drinks"
      description="Savor the flavors of India and beyond with our culinary adventures and beverage discoveries."
    >
      {/* Placeholder for additional content */}
    </CategoryLayout>
  )
}
