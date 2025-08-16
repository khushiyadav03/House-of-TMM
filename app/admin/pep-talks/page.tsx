"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit, Plus, Eye } from "lucide-react"

interface PepTalk {
  id: number
  title: string
  content: string
  author: string
  status: 'draft' | 'published' | 'scheduled'
  scheduled_date?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  image_url?: string
  excerpt?: string
  display_order: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export default function PepTalksManagement() {
  const [pepTalks, setPepTalks] = useState<PepTalk[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPepTalk, setEditingPepTalk] = useState<PepTalk | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    scheduled_date: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    image_url: '',
    excerpt: '',
    display_order: 0,
    is_featured: false
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchPepTalks()
  }, [])

  const fetchPepTalks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pep-talk')
      const data = await response.json()
      setPepTalks(data || [])
    } catch (error) {
      console.error('Failed to fetch pep talks:', error)
      toast({
        title: "Error",
        description: "Failed to fetch pep talks",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const payload = {
        ...formData,
        seo_keywords: formData.seo_keywords ? formData.seo_keywords.split(',').map(k => k.trim()) : [],
        scheduled_date: formData.scheduled_date || null
      }

      const url = editingPepTalk ? `/api/pep-talk/${editingPepTalk.id}` : '/api/pep-talk'
      const method = editingPepTalk ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Pep talk ${editingPepTalk ? 'updated' : 'created'} successfully`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchPepTalks()
      } else {
        throw new Error(result.error || 'Failed to save pep talk')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (pepTalk: PepTalk) => {
    setEditingPepTalk(pepTalk)
    setFormData({
      title: pepTalk.title,
      content: pepTalk.content,
      author: pepTalk.author,
      status: pepTalk.status,
      scheduled_date: pepTalk.scheduled_date || '',
      seo_title: pepTalk.seo_title || '',
      seo_description: pepTalk.seo_description || '',
      seo_keywords: pepTalk.seo_keywords?.join(', ') || '',
      image_url: pepTalk.image_url || '',
      excerpt: pepTalk.excerpt || '',
      display_order: pepTalk.display_order,
      is_featured: pepTalk.is_featured
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this pep talk?')) return

    try {
      const response = await fetch(`/api/pep-talk/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Pep talk deleted successfully",
        })
        fetchPepTalks()
      } else {
        throw new Error('Failed to delete pep talk')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
      status: 'draft',
      scheduled_date: '',
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      image_url: '',
      excerpt: '',
      display_order: 0,
      is_featured: false
    })
    setEditingPepTalk(null)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pep Talks Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Pep Talk
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPepTalk ? 'Edit Pep Talk' : 'Create New Pep Talk'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={8}
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.status === 'scheduled' && (
                  <div>
                    <Label htmlFor="scheduled_date">Scheduled Date</Label>
                    <Input
                      id="scheduled_date"
                      type="datetime-local"
                      value={formData.scheduled_date}
                      onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
              </div>

              {/* SEO Fields */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                      id="seo_title"
                      value={formData.seo_title}
                      onChange={(e) => handleInputChange('seo_title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <Textarea
                      id="seo_description"
                      value={formData.seo_description}
                      onChange={(e) => handleInputChange('seo_description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_keywords">SEO Keywords (comma-separated)</Label>
                    <Input
                      id="seo_keywords"
                      value={formData.seo_keywords}
                      onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPepTalk ? 'Update' : 'Create'} Pep Talk
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {pepTalks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No pep talks found. Create your first one!</p>
          </div>
        ) : (
          pepTalks.map((pepTalk) => (
            <div key={pepTalk.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{pepTalk.title}</h3>
                  <p className="text-gray-600 mb-2">{pepTalk.excerpt || 'No excerpt available'}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>By {pepTalk.author || 'Unknown'}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      pepTalk.status === 'published' ? 'bg-green-100 text-green-800' :
                      pepTalk.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {pepTalk.status}
                    </span>
                    {pepTalk.is_featured && (
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        Featured
                      </span>
                    )}
                    <span>Order: {pepTalk.display_order}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(pepTalk)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(pepTalk.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}