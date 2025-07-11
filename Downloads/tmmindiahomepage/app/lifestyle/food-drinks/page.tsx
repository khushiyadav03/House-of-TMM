"use client"

import CategoryLayout from "../../../components/CategoryLayout"

const foodDrinksArticles = [
  {
    id: 1,
    title: "Mumbai's Hidden Culinary Gems",
    slug: "mumbai-hidden-culinary-gems",
    image_url: "https://picsum.photos/270/405?random=51",
    author: "Chef Meera Tandon",
    publish_date: "2024-12-22",
    category: "Food & Drinks",
    excerpt: "Discover the secret restaurants and street food spots that locals love...",
  },
  {
    id: 2,
    title: "Craft Cocktails: Indian Flavors Revolution",
    slug: "craft-cocktails-indian-flavors",
    image_url: "https://picsum.photos/270/405?random=52",
    author: "Arjun Mixologist",
    publish_date: "2024-12-20",
    category: "Food & Drinks",
    excerpt: "How Indian spices and ingredients are transforming the cocktail scene...",
  },
  {
    id: 3,
    title: "Farm to Table: Sustainable Dining",
    slug: "farm-to-table-sustainable-dining",
    image_url: "https://picsum.photos/270/405?random=53",
    author: "Priya Organic",
    publish_date: "2024-12-18",
    category: "Food & Drinks",
    excerpt: "Restaurants leading the sustainable and organic food movement...",
  },
  {
    id: 4,
    title: "Regional Indian Cuisines: A Culinary Journey",
    slug: "regional-indian-cuisines-journey",
    image_url: "https://picsum.photos/270/405?random=54",
    author: "Ravi Foodie",
    publish_date: "2024-12-16",
    category: "Food & Drinks",
    excerpt: "Exploring the diverse flavors from different states of India...",
  },
]

// Sort articles by publish_date in descending order (newest first)
foodDrinksArticles.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())

export default function FoodDrinksPage() {
  return (
    <CategoryLayout
      categoryName="Food & Drinks"
      categorySlug="food-drinks"
      description="Savor the flavors of India and beyond with our culinary adventures and beverage discoveries."
      initialArticles={foodDrinksArticles} // Pass static articles to CategoryLayout
    />
  )
}
