"use client"

import { useState, useRef, useEffect } from "react"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null)
  const [imgRect, setImgRect] = useState<{top: number, left: number, width: number, height: number} | null>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }

    const editor = editorRef.current
    if (!editor) return

    // Remove any previous listeners
    editor.querySelectorAll('img').forEach(img => {
      img.removeAttribute('contenteditable')
      img.removeEventListener('mousedown', handleImageMouseDown as any)
      img.removeEventListener('click', handleImageClick as any)
    })

    // Add resizable logic and click handler to all images
    editor.querySelectorAll('img').forEach(img => {
      img.setAttribute('contenteditable', 'false')
      img.style.cursor = 'pointer'
      img.addEventListener('mousedown', handleImageMouseDown as any)
      img.addEventListener('click', handleImageClick as any)
    })

    // Clean up
    return () => {
      editor.querySelectorAll('img').forEach(img => {
        img.removeEventListener('mousedown', handleImageMouseDown as any)
        img.removeEventListener('click', handleImageClick as any)
      })
    }
  }, [value])

  // --- Image Resize & Select Logic ---
  let resizingImg: HTMLImageElement | null = null
  let startX = 0
  let startY = 0
  let startWidth = 0
  let startHeight = 0
  let resizeDir: string | null = null

  function handleImageMouseDown(e: MouseEvent) {
    if (e.button !== 0) return // Only left click
    resizingImg = e.target as HTMLImageElement
    startX = e.clientX
    startY = e.clientY
    startWidth = resizingImg.width
    startHeight = resizingImg.height
    document.body.style.cursor = 'ew-resize'
    document.addEventListener('mousemove', handleImageMouseMove)
    document.addEventListener('mouseup', handleImageMouseUp)
    e.preventDefault()
  }

  function handleImageMouseMove(e: MouseEvent) {
    if (!resizingImg) return
    const deltaX = e.clientX - startX
    let newWidth = Math.max(50, startWidth + deltaX)
    resizingImg.style.width = newWidth + 'px'
    resizingImg.style.height = 'auto'
  }

  function handleImageMouseUp() {
    if (resizingImg) {
      // Update editor content after resize
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    }
    resizingImg = null
    document.body.style.cursor = ''
    document.removeEventListener('mousemove', handleImageMouseMove)
    document.removeEventListener('mouseup', handleImageMouseUp)
  }

  function handleImageClick(e: MouseEvent) {
    e.stopPropagation()
    const img = e.target as HTMLImageElement
    setSelectedImg(img)
    const rect = img.getBoundingClientRect()
    setImgRect({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
    })
  }

  useEffect(() => {
    // Deselect image on outside click
    function handleDocClick(e: MouseEvent) {
      if (selectedImg && !(e.target instanceof HTMLImageElement)) {
        setSelectedImg(null)
        setImgRect(null)
      }
    }
    document.addEventListener('mousedown', handleDocClick)
    return () => document.removeEventListener('mousedown', handleDocClick)
  }, [selectedImg])

  function handleResizeHandleMouseDown(e: React.MouseEvent, dir: string) {
    e.preventDefault()
    e.stopPropagation()
    if (!selectedImg) return
    resizingImg = selectedImg
    resizeDir = dir
    startX = e.clientX
    startY = e.clientY
    startWidth = selectedImg.width
    startHeight = selectedImg.height
    document.body.style.cursor = dir.includes('e') ? 'ew-resize' : dir.includes('s') ? 'ns-resize' : 'nwse-resize'
    document.addEventListener('mousemove', handleResizeHandleMouseMove)
    document.addEventListener('mouseup', handleResizeHandleMouseUp)
  }

  function handleResizeHandleMouseMove(e: MouseEvent) {
    if (!resizingImg || !resizeDir) return
    let newWidth = startWidth
    let newHeight = startHeight
    if (resizeDir === 'se') {
      newWidth = Math.max(50, startWidth + (e.clientX - startX))
      newHeight = Math.max(30, startHeight + (e.clientY - startY))
    } else if (resizeDir === 'e') {
      newWidth = Math.max(50, startWidth + (e.clientX - startX))
    } else if (resizeDir === 's') {
      newHeight = Math.max(30, startHeight + (e.clientY - startY))
    }
    resizingImg.style.width = newWidth + 'px'
    resizingImg.style.height = newHeight + 'px'
    // Update overlay position
    const rect = resizingImg.getBoundingClientRect()
    setImgRect({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
    })
  }

  function handleResizeHandleMouseUp() {
    if (resizingImg) {
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    }
    resizingImg = null
    resizeDir = null
    document.body.style.cursor = ''
    document.removeEventListener('mousemove', handleResizeHandleMouseMove)
    document.removeEventListener('mouseup', handleResizeHandleMouseUp)
  }

  function handleRemoveImage() {
    if (!selectedImg) return
    selectedImg.remove()
    setSelectedImg(null)
    setImgRect(null)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`
      document.execCommand("insertHTML", false, linkHtml)
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
      setLinkUrl("")
      setLinkText("")
      setIsLinkModalOpen(false)
    }
  }

  const insertImage = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      const imageHtml = `<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" />`
      document.execCommand("insertHTML", false, imageHtml)
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Maximum size is 10MB")
      return
    }
    setUploading(true)
    try {
      const timestamp = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const filePath = `editor/${timestamp}_${safeName}`
      const { data, error } = await supabase.storage
        .from("article-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: false })
      if (error) throw new Error(error.message || "Upload failed")
      const { data: urlData } = supabase.storage.from("article-images").getPublicUrl(filePath)
      if (!urlData?.publicUrl) throw new Error("Failed to get public URL")
      // Insert image at cursor
      const imageHtml = `<img src="${urlData.publicUrl}" alt="Image" style="max-width: 100%; height: auto;" />`
      document.execCommand("insertHTML", false, imageHtml)
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageUpload(file)
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "Bold" },
    { icon: Italic, command: "italic", title: "Italic" },
    { icon: Underline, command: "underline", title: "Underline" },
    { icon: List, command: "insertUnorderedList", title: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
    { icon: Quote, command: "formatBlock", value: "blockquote", title: "Quote" },
    { icon: Code, command: "formatBlock", value: "pre", title: "Code Block" },
    { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
    { icon: AlignRight, command: "justifyRight", title: "Align Right" },
  ]

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleCommand(button.command, button.value)}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title={button.title}
          >
            <button.icon className="h-4 w-4" />
          </button>
        ))}

        <button
          type="button"
          onClick={() => setIsLinkModalOpen(true)}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={insertImage}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Image by URL"
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Upload Image"
          disabled={uploading}
        >
          {uploading ? (
            <span className="h-4 w-4 animate-spin border-2 border-gray-400 rounded-full border-t-transparent inline-block" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />

        <select
          onChange={(e) => handleCommand("formatBlock", e.target.value)}
          className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
          defaultValue=""
        >
          <option value="">Format</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="p">Paragraph</option>
        </select>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none"
        style={{ minHeight: "300px" }}
        data-placeholder={placeholder}
      />
      {/* Resize Handles & Remove Button Overlay */}
      {selectedImg && imgRect && (
        <div
          style={{
            position: 'absolute',
            top: imgRect.top,
            left: imgRect.left,
            width: imgRect.width,
            height: imgRect.height,
            pointerEvents: 'none',
            zIndex: 50,
          }}
        >
          {/* SE handle */}
          <div
            style={{
              position: 'absolute',
              right: -8,
              bottom: -8,
              width: 16,
              height: 16,
              background: '#fff',
              border: '2px solid #333',
              borderRadius: 4,
              cursor: 'nwse-resize',
              pointerEvents: 'auto',
              zIndex: 51,
            }}
            onMouseDown={(e) => handleResizeHandleMouseDown(e, 'se')}
          />
          {/* E handle */}
          <div
            style={{
              position: 'absolute',
              right: -8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 16,
              height: 16,
              background: '#fff',
              border: '2px solid #333',
              borderRadius: 4,
              cursor: 'ew-resize',
              pointerEvents: 'auto',
              zIndex: 51,
            }}
            onMouseDown={(e) => handleResizeHandleMouseDown(e, 'e')}
          />
          {/* S handle */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: -8,
              transform: 'translateX(-50%)',
              width: 16,
              height: 16,
              background: '#fff',
              border: '2px solid #333',
              borderRadius: 4,
              cursor: 'ns-resize',
              pointerEvents: 'auto',
              zIndex: 51,
            }}
            onMouseDown={(e) => handleResizeHandleMouseDown(e, 's')}
          />
          {/* Remove button */}
          <button
            style={{
              position: 'absolute',
              top: -32,
              right: 0,
              background: '#fff',
              border: '2px solid #e53e3e',
              borderRadius: 4,
              padding: 2,
              cursor: 'pointer',
              pointerEvents: 'auto',
              zIndex: 52,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={handleRemoveImage}
            type="button"
            title="Remove image"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}
      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter link text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}


