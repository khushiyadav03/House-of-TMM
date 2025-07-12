"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import ImageUpload from "../../../../components/ImageUpload"
import { useToast, ToastContainer } from "../../../../components/Toast"
import AdminRoute from "../../../../components/AdminRoute"

export default function NewMagazine() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cover_image_url: "",
    pdf_file_path: "",
    price: 0,
    issue_date: new Date().toISOString().split("T")[0],
  })
  const [saving, setSaving] = useState(false)

  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Validate required fields
    if (!formData.title.trim()) {
      showError("Title is required")
      setSaving(false)
      return
    }

    if (!formData.cover_image_url) {
      showError("Cover image is required")
      setSaving(false)
      return
    }

    if (!formData.pdf_file_path) {
      showError("PDF file is required")
      setSaving(false)
      return
    }

    if (formData.price <= 0) {
      showError("Price must be greater than 0")
      setSaving(false)
      return
    }

    try {
      const response = await fetch("/api/magazines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        showSuccess("Magazine created successfully!")
        setTimeout(() => {
          router.push("/admin/magazines")
        }, 1500)
      } else {
        const errorData = await response.json()
        showError(errorData.error || "Failed to create magazine")
      }
    } catch (error) {
      console.error("Failed to create magazine:", error)
      showError("Failed to create magazine")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Create New Magazine</h1>
            <p className="text-xl text-gray-600">Add a new magazine issue</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                  placeholder="Magazine title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date *</label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, issue_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Magazine description..."
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            <ImageUpload
              label="Cover Image *"
              value={formData.cover_image_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, cover_image_url: url }))}
              type="image"
            />

            <ImageUpload
              label="PDF File *"
              value={formData.pdf_file_path}
              onChange={(url) => setFormData((prev) => ({ ...prev, pdf_file_path: url }))}
              type="pdf"
            />

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
                disabled={saving}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  "Create Magazine"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </AdminRoute>
  )
} 