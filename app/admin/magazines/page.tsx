"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Upload, Edit, Trash2, DollarSign, Calendar, TrendingUp } from "lucide-react"
import Footer from "../../../components/Footer"
import ImageUpload from "../../../components/ImageUpload"
import { useToast, ToastContainer } from "../../../components/Toast"

interface Magazine {
  id: number
  title: string
  description: string
  cover_image_url: string
  pdf_file_path: string
  price: number
  issue_date: string
  status: "published" | "draft" | "scheduled"
  scheduled_date?: string
  sales_count: number
  created_at: string
  is_paid: boolean
}

export default function AdminMagazines() {
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentMagazine, setCurrentMagazine] = useState<Magazine | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cover_image_url: "",
    pdf_file_path: "",
    price: "",
    issue_date: "",
    status: "draft" as "published" | "draft" | "scheduled",
    scheduled_date: "",
    is_paid: false,
  })
  const [pdfUploading, setPdfUploading] = useState(false)
  const { showSuccess, showError, toasts, removeToast } = useToast()

  useEffect(() => {
    fetchMagazines()
  }, [])

  const fetchMagazines = async () => {
    try {
      const response = await fetch("/api/magazines")
      const data = await response.json()
      setMagazines(data)
    } catch (error) {
      console.error("Failed to fetch magazines:", error)
    }
  }

  const handlePdfUpload = async (file: File) => {
    setPdfUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", "pdf")

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({ ...prev, pdf_file_path: data.url }))
      } else {
        alert("Failed to upload PDF")
      }
    } catch (error) {
      console.error("Failed to upload PDF:", error)
      alert("Failed to upload PDF")
    } finally {
      setPdfUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const magazineData = {
      ...formData,
      price: Number.parseFloat(formData.price),
    }

    try {
      const url = isEditing ? `/api/magazines/${currentMagazine?.id}` : "/api/magazines"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(magazineData),
      })

      if (response.ok) {
        fetchMagazines()
        resetForm()
      }
    } catch (error) {
      console.error("Failed to save magazine:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      cover_image_url: "",
      pdf_file_path: "",
      price: "",
      issue_date: "",
      status: "draft",
    })
    setIsEditing(false)
    setCurrentMagazine(null)
  }

  const handleEdit = (magazine: Magazine) => {
    setCurrentMagazine(magazine)
    setFormData({
      title: magazine.title,
      description: magazine.description || "",
      cover_image_url: magazine.cover_image_url,
      pdf_file_path: magazine.pdf_file_path,
      price: magazine.price.toString(),
      issue_date: magazine.issue_date,
      status: magazine.status,
      scheduled_date: magazine.scheduled_date || "",
      is_paid: magazine.is_paid,
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this magazine?")) {
      try {
        const response = await fetch(`/api/magazines/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          showSuccess("Magazine deleted successfully")
          setMagazines(prev => prev.filter(mag => mag.id !== id))
        } else {
          showError("Failed to delete magazine")
        }
      } catch (error) {
        console.error("Failed to delete magazine:", error)
        showError("Failed to delete magazine")
      }
    }
  }

  const totalSales = magazines.reduce((sum, mag) => sum + (mag.sales_count || 0), 0)
  const totalRevenue = magazines.reduce((sum, mag) => sum + (mag.sales_count || 0) * mag.price, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Magazine Management</h1>
          <p className="text-xl text-gray-600">Manage magazine issues, pricing, and sales</p>
        </div>

        {/* Sales Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-gray-900">{magazines.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Magazine Form */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">{isEditing ? "Edit Magazine" : "Add New Magazine"}</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                <ImageUpload
                  label="Cover Image *"
                  value={formData.cover_image_url}
                  onChange={(url) => setFormData({ ...formData, cover_image_url: url })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PDF Upload *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {formData.pdf_file_path ? (
                      <div className="text-center">
                        <p className="text-sm text-green-600 mb-2">PDF uploaded successfully!</p>
                        <p className="text-xs text-gray-500 break-all">{formData.pdf_file_path}</p>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, pdf_file_path: "" })}
                          className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                          Remove PDF
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              {pdfUploading ? "Uploading..." : "Upload PDF"}
                            </span>
                            <input
                              type="file"
                              className="sr-only"
                              accept=".pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handlePdfUpload(file)
                              }}
                              disabled={pdfUploading}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_paid}
                    onChange={(e) => setFormData({ ...formData, is_paid: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Is Paid</label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date *</label>
                  <input
                    type="date"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "published" | "draft" | "scheduled" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                {formData.status === "scheduled" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduled_date}
                      onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Brief description of the magazine issue..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={pdfUploading}
                    className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                  >
                    {isEditing ? "Update Magazine" : "Add Magazine"}
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

          {/* Magazines List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold">Magazines ({magazines.length})</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {magazines.map((magazine) => (
                  <div key={magazine.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-20 h-28 flex-shrink-0">
                        <Image
                          src={magazine.cover_image_url || "/placeholder.svg"}
                          alt={magazine.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{magazine.title}</h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  magazine.status === "published" ? "bg-green-100 text-green-800" :
                                  magazine.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                                  "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {magazine.status}
                                {magazine.status === "scheduled" && magazine.scheduled_date && (
                                  <span className="ml-1">({new Date(magazine.scheduled_date).toLocaleString()})</span>
                                )}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                              Issue Date: {new Date(magazine.issue_date).toLocaleDateString()}
                            </p>
                            <p className="text-lg font-bold text-green-600 mb-2">₹{magazine.price}</p>
                            {magazine.description && (
                              <p className="text-gray-600 text-sm line-clamp-2 mb-2">{magazine.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Sales: {magazine.sales_count || 0}</span>
                              <span>Revenue: ₹{((magazine.sales_count || 0) * magazine.price).toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleEdit(magazine)}
                              className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(magazine.id)}
                              className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {magazines.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    <p className="text-lg">No magazines found</p>
                    <p className="text-sm">Add your first magazine using the form on the left</p>
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
