"use client"

import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'

interface TinyMCEEditorProps {
  value: string
  onChange: (content: string) => void
  height?: number
  placeholder?: string
}

export default function TinyMCEEditor({ 
  value, 
  onChange, 
  height = 400,
  placeholder = "Start writing your article..." 
}: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null)

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Editor
        apiKey="v0qgtlasbzuzc5ajt6itfh6fq1fpdjzepz31wpwt5cok8e65"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: height,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
            'template', 'codesample', 'hr', 'pagebreak', 'nonbreaking', 'toc', 'imagetools'
          ],
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
            'link image media table mergetags | addcomment showcomments | ' +
            'spellcheckdialog a11ycheck typography | align lineheight | ' +
            'checklist numlist bullist indent outdent | emoticons charmap | removeformat | preview code fullscreen',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333; } img { max-width: 100%; height: auto; }',
          placeholder: placeholder,
          branding: false,
          promotion: false,
          setup: (editor) => {
            editor.ui.registry.addButton('customimage', {
              text: 'Upload Image',
              onAction: () => {
                const input = document.createElement('input')
                input.setAttribute('type', 'file')
                input.setAttribute('accept', 'image/*')
                input.onchange = async function() {
                  const file = (this as HTMLInputElement).files?.[0]
                  if (file) {
                    // Create FormData for upload
                    const formData = new FormData()
                    formData.append('file', file)
                    
                    try {
                      const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                      })
                      
                      if (response.ok) {
                        const data = await response.json()
                        editor.insertContent(`<img src="${data.url}" alt="${file.name}" style="max-width: 100%; height: auto;" />`)
                      }
                    } catch (error) {
                      console.error('Upload failed:', error)
                    }
                  }
                }
                input.click()
              }
            })
          },
          images_upload_handler: async (blobInfo, progress) => {
            return new Promise(async (resolve, reject) => {
              const formData = new FormData()
              formData.append('file', blobInfo.blob(), blobInfo.filename())
              
              try {
                const response = await fetch('/api/upload', {
                  method: 'POST',
                  body: formData,
                })
                
                if (response.ok) {
                  const data = await response.json()
                  resolve(data.url)
                } else {
                  reject('Upload failed')
                }
              } catch (error) {
                reject('Upload failed')
              }
            })
          },
          automatic_uploads: true,
          file_picker_types: 'image',
          file_picker_callback: (callback, value, meta) => {
            if (meta.filetype === 'image') {
              const input = document.createElement('input')
              input.setAttribute('type', 'file')
              input.setAttribute('accept', 'image/*')
              input.onchange = function() {
                const file = (this as HTMLInputElement).files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = () => {
                    callback(reader.result as string, {
                      alt: file.name
                    })
                  }
                  reader.readAsDataURL(file)
                }
              }
              input.click()
            }
          }
        }}
      />
    </div>
  )
}
