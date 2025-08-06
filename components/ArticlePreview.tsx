"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye, X } from 'lucide-react'
import ArticleLayout from './ArticleLayout'

interface Article {
  id: number
  title: string
  slug: string
  image_url: string
  author: string
  publish_date: string
  excerpt: string
  content: string
  status: 'published' | 'draft' | 'scheduled'
  scheduled_date?: string
  likes: number
  views: number
  featured: boolean
  categories?: { id: number; name: string; slug: string }[]
}

interface ArticlePreviewProps {
  isOpen: boolean
  onClose: () => void
  article: Article
}

export default function ArticlePreview({ isOpen, onClose, article }: ArticlePreviewProps) {
  // Map the article data to ArticleLayout's expected props
  const layoutArticle = {
    id: String(article.id),
    title: article.title,
    author: article.author,
    date: article.publish_date,
    imageUrl: article.image_url,
    content: article.content,
    relatedArticles: [], // You can fetch or pass related articles if needed
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Article Preview
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ArticleLayout article={layoutArticle}>
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </ArticleLayout>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 