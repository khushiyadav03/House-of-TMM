"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Tag } from "lucide-react"
import Footer from "../../../components/Footer"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  created_at: string
  article_count?: number
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = isEditing ? `/api/categories/${currentCategory?.id}` : "/api/categories"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchCategories()
        resetForm()
      } else {
        alert("Failed to save category")
      }
    } catch (error) {
      console.error("Failed to save category:", error)
      alert("Failed to save category")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
    })
    setIsEditing(false)
    setCurrentCategory(null)
  }

  const handleEdit = (category: Category) => {
    setCurrentCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category? This will remove it from all articles.")) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchCategories()
        } else {
          alert("Failed to delete category")
        }
      } catch (error) {
        console.error("Failed to delete category:", error)
        alert("Failed to delete category")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Categories Management</h1>
          <p className="text-xl text-gray-600">Manage article categories and organization</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Form */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Tag className="h-6 w-6" />
                {isEditing ? "Edit Category" : "Add New Category"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                    placeholder="e.g., Fashion, Technology"
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
                    placeholder="e.g., fashion, technology"
                  />
                  <p className="text-xs text-gray-500 mt-1">URL-friendly version of the name</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Brief description of this category..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {isEditing ? "Update Category" : "Add Category"}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold">Categories ({categories.length})</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <div key={category.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="h-5 w-5 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">Slug: /{category.slug}</p>
                        {category.description && <p className="text-gray-600 text-sm mb-2">{category.description}</p>}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Created: {new Date(category.created_at).toLocaleDateString()}</span>
                          {category.article_count !== undefined && <span>Articles: {category.article_count}</span>}
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(category)}
                          className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {categories.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg">No categories found</p>
                    <p className="text-sm">Create your first category to organize your articles</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
