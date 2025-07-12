"use client"

import CategoryLayout from "../../components/CategoryLayout"
import Footer from "../../components/Footer"
import { useState } from "react"

const sportsArticles = [
  {
    id: 1,
    title: "Cricket World Cup 2025: India's Championship Journey",
    slug: "cricket-world-cup-2025-india",
    image_url: "https://picsum.photos/400/300?random=61",
    author: "Rohit Sharma",
    publish_date: "2024-12-22",
    category: "Cricket",
    excerpt: "Following Team India's incredible journey to the Cricket World Cup...",
  },
  {
    id: 2,
    title: "Golf in India: The Rising Sport",
    slug: "golf-india-rising-sport",
    image_url: "https://picsum.photos/400/300?random=62",
    author: "Anirban Lahiri",
    publish_date: "2024-12-20",
    category: "Golf",
    excerpt: "How golf is gaining popularity among Indian sports enthusiasts...",
  },
  {
    id: 3,
    title: "Olympic Dreams: Indian Athletes Preparation",
    slug: "olympic-dreams-indian-athletes",
    image_url: "https://picsum.photos/400/300?random=63",
    author: "Mary Kom",
    publish_date: "2024-12-18",
    category: "Olympics",
    excerpt: "Behind the scenes with India's Olympic hopefuls and their training...",
  },
  {
    id: 4,
    title: "Football Fever: ISL Season Highlights",
    slug: "football-isl-season-highlights",
    image_url: "https://picsum.photos/400/300?random=64",
    author: "Sunil Chhetri",
    publish_date: "2024-12-16",
    category: "Football",
    excerpt: "The most exciting moments from the Indian Super League season...",
  },
  {
    id: 5,
    title: "Hockey India League: New Talents Emerge",
    slug: "hockey-india-league-new-talents",
    image_url: "https://picsum.photos/400/300?random=65",
    author: "PR Sreejesh",
    publish_date: "2024-12-14",
    category: "Hockey",
    excerpt: "Discover the rising stars of the Hockey India League...",
  },
  {
    id: 6,
    title: "Badminton Buzz: India Open Highlights",
    slug: "badminton-buzz-india-open",
    image_url: "https://picsum.photos/400/300?random=66",
    author: "P.V. Sindhu",
    publish_date: "2024-12-12",
    category: "Badminton",
    excerpt: "Relive the thrilling moments from the India Open badminton tournament...",
  },
  {
    id: 7,
    title: "Tennis Titans: Indian Players on the Global Stage",
    slug: "tennis-titans-indian-players",
    image_url: "https://picsum.photos/400/300?random=67",
    author: "Sania Mirza",
    publish_date: "2024-12-10",
    category: "Tennis",
    excerpt: "A look at the achievements of Indian tennis players worldwide...",
  },
  {
    id: 8,
    title: "Kabaddi Kings: Pro Kabaddi League Season Review",
    slug: "kabaddi-kings-pro-kabaddi-league",
    image_url: "https://picsum.photos/400/300?random=68",
    author: "Anup Kumar",
    publish_date: "2024-12-08",
    category: "Kabaddi",
    excerpt: "The standout performances and memorable matches from the Pro Kabaddi League...",
  },
  {
    id: 9,
    title: "Chess Champions: India's Young Grandmasters",
    slug: "chess-champions-india-grandmasters",
    image_url: "https://picsum.photos/400/300?random=69",
    author: "Viswanathan Anand",
    publish_date: "2024-12-06",
    category: "Chess",
    excerpt: "Meet the talented young chess grandmasters making waves in India...",
  },
  {
    id: 10,
    title: "Wrestling Warriors: Indian Wrestlers at International Events",
    slug: "wrestling-warriors-indian-wrestlers",
    image_url: "https://picsum.photos/400/300?random=70",
    author: "Yogeshwar Dutt",
    publish_date: "2024-12-04",
    category: "Wrestling",
    excerpt: "Celebrating the achievements of Indian wrestlers in international competitions...",
  },
  {
    id: 11,
    title: "Boxing Bonanza: India's Boxing Scene",
    slug: "boxing-bonanza-india-boxing",
    image_url: "https://picsum.photos/400/300?random=71",
    author: "Vijender Singh",
    publish_date: "2024-12-02",
    category: "Boxing",
    excerpt: "An inside look at the vibrant boxing scene in India...",
  },
  {
    id: 12,
    title: "Shooting Stars: Indian Shooters Aim for Gold",
    slug: "shooting-stars-indian-shooters",
    image_url: "https://picsum.photos/400/300?random=72",
    author: "Abhinav Bindra",
    publish_date: "2024-11-30",
    category: "Shooting",
    excerpt: "The journey of Indian shooters as they prepare for major tournaments...",
  },
  {
    id: 13,
    title: "Archery Aces: India's Promising Archers",
    slug: "archery-aces-indian-archers",
    image_url: "https://picsum.photos/400/300?random=73",
    author: "Deepika Kumari",
    publish_date: "2024-11-28",
    category: "Archery",
    excerpt: "Highlighting the skills and dedication of India's top archers...",
  },
  {
    id: 14,
    title: "Weightlifting Wonders: Indian Weightlifters Shine",
    slug: "weightlifting-wonders-indian-weightlifters",
    image_url: "https://picsum.photos/400/300?random=74",
    author: "Mirabai Chanu",
    publish_date: "2024-11-26",
    category: "Weightlifting",
    excerpt: "Celebrating the success of Indian weightlifters on the world stage...",
  },
]

export default function SportsPage() {
  return (
    <CategoryLayout
      categoryName="Sports"
      categorySlug="sports"
      description="Stay updated with the latest in Indian and international sports, from cricket to golf and beyond."
      initialArticles={sportsArticles}
    />
  )
}
