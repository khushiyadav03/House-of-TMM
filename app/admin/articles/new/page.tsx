"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FabricEditor from "@/components/RichTextEditor"; // Changed import
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/components/ui/use-toast";
import AdminRoute from "../../../../components/AdminRoute"
import { supabase } from "@/lib/supabase";

interface Category {
  id: number
  name: string
  slug: string
}

export default function NewArticle() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image_url: "",
    author: "",
    publish_date: new Date().toISOString().split("T")[0],
    categories: [] as number[],
    featured: false,
  })
  const [saving, setSaving] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchCategories()
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (formData.title && formData.content && !saving) {
      const timer = setTimeout(() => {
        handleAutoSave()
      }, 30000) // Auto-save every 30 seconds

      return () => clearTimeout(timer)
    }
  }, [formData.title, formData.content])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      toast({
        title: "Error",
        description: "Failed to fetch categories.",
        variant: "destructive",
      });
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const handleCategoryChange = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }))
  }

  const handleAutoSave = async () => {
    if (!formData.title || !formData.content) return

    setAutoSaving(true)
    try {
      // Save as draft
      const draftData = { ...formData, status: "draft" }
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draftData),
      })

      if (response.ok) {
        setLastSaved(new Date())
        toast({
          title: "Info",
          description: "Draft auto-saved.",
        });
      }
    } catch (error) {
      console.error("Auto-save failed:", error)
    } finally {
      setAutoSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Error",
        description: "Content is required.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (formData.categories.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one category.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("articles").insert([
        { ...formData, image_url: formData.image_url, content: formData.content }, // formData.content is now JSON
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Article created successfully.",
      });
      router.push("/admin/articles");
    } catch (error) {
      console.error("Error creating article:", error);
      toast({
        title: "Error",
        description: "Failed to create article.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <AdminRoute>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create New Article</h1>
          <p className="text-xl text-gray-600">Write and publish a new article</p>
            {lastSaved && (
              <p className="text-sm text-gray-500 mt-2">
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
            )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
                  placeholder="Enter article title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
                  placeholder="article-slug"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
                  placeholder="Author name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date *</label>
              <input
                type="date"
                value={formData.publish_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, publish_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          <ImageUpload
            label="Featured Image"
            value={formData.image_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="mr-2"
                  />
                  {category.name}
                </label>
              ))}
            </div>
            {formData.categories.length === 0 && (
              <p className="text-red-500 text-sm mt-1">Please select at least one category</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Brief description of the article..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <FabricEditor
              initialValue={formData.content}
              onChange={(json) => setFormData((prev) => ({ ...prev, content: json }))} // Simplified onChange
              uploadUrl="/api/upload"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex items-center">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="mr-2"
                />
                Featured Article
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
                disabled={saving || autoSaving || loading}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  "Create Article"
                )}
            </button>
          </div>
        </form>
      </div>

        {/* Toast Notifications */}
    </div>
    </AdminRoute>
  )
}
