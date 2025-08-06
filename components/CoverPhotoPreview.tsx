"use client"

import React from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye, X } from 'lucide-react'

interface CoverPhotoPreviewProps {
  isOpen: boolean
  onClose: () => void
  coverPhoto: {
    title: string
    image_url: string
    description: string
    category: string
    status: string
    scheduled_date?: string
  }
}

export default function CoverPhotoPreview({ isOpen, onClose, coverPhoto }: CoverPhotoPreviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Published'
      case 'draft':
        return 'Draft'
      case 'scheduled':
        return 'Scheduled'
      default:
        return 'Unknown'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'digital-cover':
        return 'Digital Cover'
      case 'editorial-shoot':
        return 'Editorial Shoot'
      default:
        return category
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Cover Photo Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status and Category Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(coverPhoto.status)}`}>
                {getStatusLabel(coverPhoto.status)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Category:</span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                {getCategoryLabel(coverPhoto.category)}
              </span>
            </div>
            {coverPhoto.scheduled_date && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Scheduled for:</span>
                <span className="text-sm text-gray-600">
                  {new Date(coverPhoto.scheduled_date).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Main Image */}
          <div className="relative">
            <Image
              src={coverPhoto.image_url || "/placeholder.svg"}
              alt={coverPhoto.title}
              width={800}
              height={600}
              className="w-full h-auto object-cover rounded-lg"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-black bg-opacity-75 text-white text-sm font-medium rounded">
                {getCategoryLabel(coverPhoto.category)}
              </span>
            </div>
          </div>

          {/* Content Details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{coverPhoto.title}</h2>
              {coverPhoto.description && (
                <p className="text-gray-600 leading-relaxed">{coverPhoto.description}</p>
              )}
            </div>

            {/* Article Layout Simulation */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">How it will appear on the site:</h3>
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">TMM India</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {coverPhoto.status === 'published' ? 'Published' : 'Preview'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <Image
                    src={coverPhoto.image_url || "/placeholder.svg"}
                    alt={coverPhoto.title}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover rounded"
                  />
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{coverPhoto.title}</h4>
                    {coverPhoto.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {coverPhoto.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 