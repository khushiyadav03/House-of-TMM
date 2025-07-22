import React, { useRef, useState, useEffect, useCallback } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bold, Italic, Underline as UnderlineIcon, Image as ImageIcon, Trash2, Move, WrapText, AlignLeft, AlignRight, AlignCenter, Link2, Lock, Unlock } from 'lucide-react';

interface HybridEditorProps {
  initialText?: string;
  initialImages?: Array<ImageState>;
  onChange: (textHtml: string, images: Array<ImageState>) => void;
  uploadUrl: string;
}

interface ImageState {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number;
  zIndex: number;
}

const HybridEditor = ({ initialText, initialImages, onChange, uploadUrl }: HybridEditorProps) => {
  // Only initialize TipTap on the client
  const isClient = typeof window !== 'undefined';
  const editor = isClient ? useEditor({
    extensions: [StarterKit, Image],
    content: initialText || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), images);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg min-h-[400px] max-w-none focus:outline-none',
      },
    },
    immediatelyRender: false, // Fix SSR hydration error
  }) : null;

  // Image layer state
  const [images, setImages] = useState<ImageState[]>(initialImages || []);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [aspectRatioLocked, setAspectRatioLocked] = useState<{ [id: string]: boolean }>({});
  const [inlineImages, setInlineImages] = useState<{ [id: string]: boolean }>({});
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // Global click listener for deselection
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // If click is outside any image or toolbar, deselect
      if (!(e.target as HTMLElement).closest('.hybrid-image, .hybrid-toolbar')) {
        setSelectedImageId(null);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  // Add image
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(uploadUrl, { method: 'POST', body: formData });
      const { url } = await response.json();
      if (url) {
        const img = new window.Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const newImage: ImageState = {
            id: Math.random().toString(36).substr(2, 9),
            src: url,
            x: 100,
            y: 100,
            width: 200,
            height: 200 / aspectRatio,
            aspectRatio,
            zIndex: images.length + 1,
          };
          setImages((prev) => [...prev, newImage]);
          onChange(editor?.getHTML() || '', [...images, newImage]);
        };
        img.src = url;
      }
    } catch (error) {
      alert('Image upload failed');
    }
  };

  // Drag logic
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    setActiveImageId(id);
    const image = images.find((img) => img.id === id);
    if (image) {
      setDragOffset({ x: e.clientX - image.x, y: e.clientY - image.y });
    }
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!activeImageId || !dragOffset) return;
    setImages((prev) =>
      prev.map((img) =>
        img.id === activeImageId
          ? { ...img, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
          : img
      )
    );
  };
  const handleMouseUp = () => {
    setActiveImageId(null);
    setDragOffset(null);
    onChange(editor?.getHTML() || '', images);
  };
  useEffect(() => {
    if (activeImageId && dragOffset) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  });

  // Replace image
  const handleReplaceImage = (id: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event: any) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch(uploadUrl, { method: 'POST', body: formData });
        const { url } = await response.json();
        if (url) {
          setImages((prev) => prev.map((img) => img.id === id ? { ...img, src: url } : img));
          onChange(editor?.getHTML() || '', images.map((img) => img.id === id ? { ...img, src: url } : img));
        }
      } catch (error) {
        alert('Image upload failed');
      }
    };
    input.click();
  };

  // Toggle aspect ratio lock
  const handleToggleAspectRatio = (id: string) => {
    setAspectRatioLocked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Wrap options (simulate by aligning image left/center/right or breaking to new line)
  const handleWrap = (id: string, mode: 'inline' | 'left' | 'right' | 'break') => {
    setImages((prev) => prev.map((img) => {
      if (img.id !== id) return img;
      if (mode === 'inline') return { ...img, y: 100, x: 100 };
      if (mode === 'left') return { ...img, x: 0 };
      if (mode === 'right') return { ...img, x: 600 };
      if (mode === 'break') return { ...img, y: img.y + 100 };
      return img;
    }));
    onChange(editor?.getHTML() || '', images);
  };

  // Update handleResize to respect aspectRatioLocked
  const handleResize = (id: string, dx: number, dy: number) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id !== id) return img;
        let newWidth = img.width + dx;
        let newHeight = aspectRatioLocked[img.id] !== false ? newWidth / img.aspectRatio : img.height + dy;
        if (newWidth < 40) newWidth = 40;
        if (newHeight < 40) newHeight = 40;
        return { ...img, width: newWidth, height: newHeight };
      })
    );
    onChange(editor?.getHTML() || '', images);
  };

  // Delete image
  const handleDeleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    onChange(editor?.getHTML() || '', images.filter((img) => img.id !== id));
  };

  // Insert image inline/wrap in TipTap
  const insertImageInline = (src: string) => {
    // TODO: Add class for inline image using HTMLAttributes extension or custom attribute
    editor?.chain().focus().setImage({ src }).run();
  };
  const insertImageWrap = (src: string, float: 'left' | 'right') => {
    // TODO: Add class for float image using HTMLAttributes extension or custom attribute
    editor?.chain().focus().setImage({ src }).run();
  };

  // Toggle image mode (inline/wrap or free-drag)
  const handleToggleImageMode = (id: string, img: ImageState) => {
    if (inlineImages[id]) {
      // Move to free-drag layer
      setInlineImages((prev) => ({ ...prev, [id]: false }));
      setImages((prev) => [...prev, img]);
      // Remove from TipTap (if possible)
      // (You may need to implement a custom extension to remove by src or id)
    } else {
      // Move to inline/wrap (remove from free-drag layer, insert into TipTap)
      setInlineImages((prev) => ({ ...prev, [id]: true }));
      setImages((prev) => prev.filter((i) => i.id !== id));
      insertImageInline(img.src); // or insertImageWrap(img.src, 'left'/'right')
    }
  };

  // Floating toolbar for images
  const renderImageToolbar = (img: ImageState) => (
    <div
      className="absolute z-50 flex gap-1 bg-white border rounded shadow p-1 hybrid-toolbar"
      style={{ left: img.x, top: img.y - 40 }}
    >
      <Button type="button" variant="ghost" size="icon" onClick={() => handleWrap(img.id, 'inline')} title="Inline"><WrapText className="w-4 h-4" /></Button>
      <Button type="button" variant="ghost" size="icon" onClick={() => handleWrap(img.id, 'left')} title="Align Left"><AlignLeft className="w-4 h-4" /></Button>
      <Button type="button" variant="ghost" size="icon" onClick={() => handleWrap(img.id, 'right')} title="Align Right"><AlignRight className="w-4 h-4" /></Button>
      <Button type="button" variant="ghost" size="icon" onClick={() => handleWrap(img.id, 'break')} title="Break"><AlignCenter className="w-4 h-4" /></Button>
      <Button type="button" variant="ghost" size="icon" onClick={() => handleReplaceImage(img.id)} title="Replace"><Link2 className="w-4 h-4" /></Button>
      <Button type="button" variant="ghost" size="icon" onClick={() => handleToggleAspectRatio(img.id)} title="Aspect Ratio Lock">{aspectRatioLocked[img.id] !== false ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}</Button>
      <Button type="button" variant="ghost" size="icon" onClick={() => handleToggleImageMode(img.id, img)} title="Toggle Inline/Free Drag">{inlineImages[img.id] ? <Move className="w-4 h-4" /> : <WrapText className="w-4 h-4" />}</Button>
      <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteImage(img.id)} title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></Button>
    </div>
  );

  if (!isClient || !editor) return <div className="min-h-[400px] flex items-center justify-center text-gray-500">Loading editor...</div>;

  return (
    <div className="border rounded-lg relative min-h-[500px]">
      {/* Toolbar for text */}
      <div className="toolbar flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <Button type="button" variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleBold().run()} disabled={!editor?.can().toggleBold()}><Bold className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleItalic().run()} disabled={!editor?.can().toggleItalic()}><Italic className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleUnderline().run()} disabled={!editor?.can().toggleUnderline()}><UnderlineIcon className="w-4 h-4" /></Button>
        <label className="inline-flex items-center cursor-pointer">
          <ImageIcon className="w-4 h-4" />
          <Input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
      </div>
      {/* TipTap text layer */}
      <EditorContent editor={editor} />
      {/* Canva-like image layer */}
      <div className="absolute inset-0 pointer-events-none">
        {images.map((img) => (
          <div
            key={img.id}
            className="absolute hybrid-image"
            style={{ left: img.x, top: img.y, width: img.width, height: img.height, zIndex: img.zIndex, pointerEvents: 'auto' }}
            onMouseDown={(e) => handleMouseDown(e, img.id)}
          >
            <img
              src={img.src}
              alt=""
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'contain', border: activeImageId === img.id ? '2px solid #007bff' : 'none' }}
            />
            {/* Resize handle (bottom-right corner) */}
            <div
              className="absolute right-0 bottom-0 w-4 h-4 bg-blue-500 cursor-nwse-resize"
              onMouseDown={(e) => {
                e.stopPropagation();
                const startX = e.clientX;
                const startWidth = img.width;
                const resizeMove = (moveEvent: MouseEvent) => {
                  const dx = moveEvent.clientX - startX;
                  handleResize(img.id, dx, 0);
                };
                const resizeUp = () => {
                  window.removeEventListener('mousemove', resizeMove);
                  window.removeEventListener('mouseup', resizeUp);
                  onChange(editor?.getHTML() || '', images);
                };
                window.addEventListener('mousemove', resizeMove);
                window.addEventListener('mouseup', resizeUp);
              }}
            />
            {/* Floating toolbar */}
            {activeImageId === img.id && renderImageToolbar(img)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HybridEditor; 