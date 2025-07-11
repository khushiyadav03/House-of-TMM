"use client"

import CategoryLayout from "../../../components/CategoryLayout"

const travelArticles = [
  {
    id: 1,
    title: "Exploring the Backwaters of Kerala",
    slug: "exploring-backwaters-kerala",
    image_url: "https://picsum.photos/270/405?random=91",
    author: "Travel Blogger Rohan",
    publish_date: "2024-12-26",
    category: "Travel",
    excerpt: "A serene journey through the picturesque canals and lagoons of Kerala.",
  },
  {
    id: 2,
    title: "Himalayan Treks: Adventures in the Mountains",
    slug: "himalayan-treks-mountains",
    image_url: "https://picsum.photos/270/405?random=92",
    author: "Mountaineer Pooja",
    publish_date: "2024-12-24",
    category: "Travel",
    excerpt: "Conquer breathtaking peaks and discover hidden trails in the Himalayas.",
  },
  {
    id: 3,
    title: "Goa Beyond Beaches: A Cultural Immersion",
    slug: "goa-beyond-beaches-cultural-immersion",
    image_url: "https://picsum.photos/270/405?random=93",
    author: "Culture Enthusiast",
    publish_date: "2024-12-22",
    category: "Travel",
    excerpt: "Uncover the rich history, vibrant markets, and unique traditions of Goa.",
  },
  {
    id: 4,
    title: "Wildlife Safaris in India: A Jungle Adventure",
    slug: "wildlife-safaris-india-jungle-adventure",
    image_url: "https://picsum.photos/270/405?random=94",
    author: "Wildlife Photographer",
    publish_date: "2024-12-20",
    category: "Travel",
    excerpt: "Encounter majestic tigers, elephants, and diverse wildlife in India's national parks.",
  },
  {
    id: 5,
    title: "Desert Delights: Rajasthan's Royal Charms",
    slug: "desert-delights-rajasthan-royal-charms",
    image_url: "https://picsum.photos/270/405?random=95",
    author: "Historian Ananya",
    publish_date: "2024-12-18",
    category: "Travel",
    excerpt: "Journey through the land of kings, forts, and vibrant folk culture.",
  },
  {
    id: 6,
    title: "Spiritual Journeys: Pilgrimage Sites of India",
    slug: "spiritual-journeys-pilgrimage-sites",
    image_url: "https://picsum.photos/270/405?random=96",
    author: "Spiritual Guide",
    publish_date: "2024-12-16",
    category: "Travel",
    excerpt: "Explore the sacred temples, ashrams, and spiritual centers across India.",
  },
]

travelArticles.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())

export default function TravelPage() {
  return (
    <CategoryLayout
      categoryName="Travel"
      categorySlug="travel"
      description="Explore amazing destinations, travel tips, and cultural experiences from around the world."
      initialArticles={travelArticles} // Pass static articles to CategoryLayout
    />
  )
}
