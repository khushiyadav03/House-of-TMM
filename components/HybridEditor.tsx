import React, { useState, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import { Node } from '@tiptap/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';  // Assume you have shadcn/ui Select
import { Bold, Italic, Underline as UnderlineIcon, Image as ImageIcon, Trash2, AlignLeft, AlignRight, AlignCenter, AlignJustify, Link as LinkIcon, Lock, Unlock, Type, Palette, Highlighter, Undo, Redo, List, ListOrdered, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from 'lucide-react';

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

// Custom Block Image Node
const CustomImage = Image.extend({
  name: 'image',
  addAttributes() {
    return {
      ...this.parent?.(),
      id: { default: null },
      style: { default: 'display:block;margin:1em auto;' },
    };
  },
  addOptions() {
    return {
      ...this.parent?.(),
      onSelectImage: (id: string, pos: number, type: 'block') => {},
    };
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', HTMLAttributes];
  },
});

// Custom Inline Image Node
const InlineImage = Node.create({
  name: 'inlineImage',
  group: 'inline',
  inline: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      id: { default: null },
      style: { default: 'display:inline-block;vertical-align:middle;' },
    };
  },
  parseHTML() {
    return [{ tag: 'img[data-inline-image]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', { ...HTMLAttributes, 'data-inline-image': true }];
  },
  addOptions() {
    return {
      onSelectImage: (id: string, pos: number, type: 'inline') => {},
    };
  },
});

const HybridEditor = ({ initialText = '', initialImages = [], onChange, uploadUrl }: HybridEditorProps) => {
  const isClient = typeof window !== 'undefined';
  const editor = isClient ? useEditor({
    extensions: [
      StarterKit,
      CustomImage.configure({
        inline: false,
        onSelectImage: (id, pos, type) => setSelectedImage({ id, pos, type }),
      }),
      InlineImage.configure({
        onSelectImage: (id, pos, type) => setSelectedImage({ id, pos, type }),
      }),
      Link,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      FontFamily,
      Color,
      Highlight,
      Superscript,
      Subscript,
      Typography,
      Placeholder.configure({ placeholder: 'Start typing...' }),
    ],
    content: initialText,
    onUpdate: ({ editor }) => onChange(editor.getHTML(), images),
    editorProps: { attributes: { class: 'prose prose-lg min-h-[400px] max-w-none focus:outline-none p-4' } },
    immediatelyRender: false,
  }) : null;

  const [images, setImages] = useState<ImageState[]>(initialImages);
  const [selectedImage, setSelectedImage] = useState<{ id: string; pos: number; type: 'block' | 'inline' } | null>(null);
  const [aspectRatioLocked, setAspectRatioLocked] = useState<{ [id: string]: boolean }>({});
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.hybrid-image, .hybrid-toolbar')) {
        setSelectedImage(null);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(uploadUrl, { method: 'POST', body: formData });
      const { url } = await response.json();
      if (url) {
        const img = new window.Image();
        img.src = url;
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const id = Math.random().toString(36).substr(2, 9);
          editor.chain().focus().setImage({ src: url, id }).run();
          setAspectRatioLocked((prev) => ({ ...prev, [id]: true }));
          setSelectedImage({ id, pos: editor.state.selection.from, type: 'block' });
        };
      }
    } catch (error) {
      console.error('Image upload failed', error);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const image = images.find((img) => img.id === id);
    if (image) {
      setDragOffset({ x: e.clientX - image.x, y: e.clientY - image.y });
      setSelectedImage({ id, pos: -1, type: 'block' }); // Free-drag is treated as block
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!selectedImage?.id || !dragOffset) return;
    setImages((prev) =>
      prev.map((img) =>
        img.id === selectedImage.id ? { ...img, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } : img
      )
    );
  };

  const handleMouseUp = () => {
    setDragOffset(null);
    if (editor) onChange(editor.getHTML(), images);
  };

  useEffect(() => {
    if (selectedImage?.id && dragOffset) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [selectedImage, dragOffset]);

  const handleWrap = (mode: 'inline' | 'left' | 'right' | 'break') => {
    if (!selectedImage || !editor) return;
    const { id, pos } = selectedImage;
    const tr = editor.state.tr;
    tr.delete(pos, pos + 1);

    let style = '';
    let nodeType = 'image';
    if (mode === 'left') style = 'float:left;margin:0 1em 1em 0;max-width:40%;';
    else if (mode === 'right') style = 'float:right;margin:0 0 1em 1em;max-width:40%;';
    else if (mode === 'inline') {
      style = 'display:inline-block;vertical-align:middle;';
      nodeType = 'inlineImage';
    } else style = 'display:block;margin:1em auto;';

    const node = editor.schema.nodes[nodeType].create({ src: images.find((img) => img.id === id)?.src || '', id, style });
    tr.insert(pos, node);
    editor.view.dispatch(tr);
    setSelectedImage({ id, pos, type: mode === 'inline' || mode === 'left' || mode === 'right' ? 'inline' : 'block' });
  };

  const handleResize = (dx: number, dy: number) => {
    if (!selectedImage) return;
    const id = selectedImage.id;
    setImages((prev) =>
      prev.map((img) => {
        if (img.id !== id) return img;
        let newWidth = img.width + dx;
        let newHeight = aspectRatioLocked[id] ? newWidth / img.aspectRatio : img.height + dy;
        if (newWidth < 40) newWidth = 40;
        if (newHeight < 40) newHeight = 40;
        return { ...img, width: newWidth, height: newHeight };
      })
    );
    if (editor) onChange(editor.getHTML(), images);
  };

  const handleDeleteImage = () => {
    if (!selectedImage || !editor) return;
    const { pos } = selectedImage;
    const tr = editor.state.tr.delete(pos, pos + 1);
    editor.view.dispatch(tr);
    setImages((prev) => prev.filter((img) => img.id !== selectedImage.id));
    setSelectedImage(null);
  };

  const handleReplaceImage = () => {
    if (!selectedImage) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch(uploadUrl, { method: 'POST', body: formData });
        const { url } = await response.json();
        const tr = editor.state.tr.setNodeMarkup(selectedImage.pos, undefined, { src: url });
        editor.view.dispatch(tr);
      } catch (error) {
        console.error('Replace failed', error);
      }
    };
    input.click();
  };

  const toggleAspectRatio = () => {
    if (!selectedImage) return;
    const id = selectedImage.id;
    setAspectRatioLocked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isClient || !editor) return <div className="min-h-[400px] flex items-center justify-center text-gray-500">Loading editor...</div>;

  return (
    <div className="border rounded-lg relative min-h-[500px]">
      {/* Main Toolbar (MS Word-like) */}
      <div className="toolbar flex flex-wrap items-center gap-2 p-2 border-b bg-gray-50 overflow-x-auto">
        {/* Text Formatting */}
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleStrike().run()}><Highlighter className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleSuperscript().run()} title="Superscript"><sup className="text-xs">2</sup></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleSubscript().run()} title="Subscript"><sub className="text-xs">2</sub></Button>

        {/* Font Size */}
        <Select onValueChange={(value) => editor.chain().focus().setFontSize(`${value}pt`).run()}>
          <SelectTrigger className="w-[80px]"><SelectValue placeholder="Size" /></SelectTrigger>
          <SelectContent>
            {[8, 9, 10, 11, 12, 14, 18, 24, 36, 48, 72].map(size => <SelectItem key={size} value={size.toString()}>{size}pt</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Font Family */}
        <Select onValueChange={(value) => editor.chain().focus().setFontFamily(value).run()}>
          <SelectTrigger className="w-[120px]"><SelectValue placeholder="Font" /></SelectTrigger>
          <SelectContent>
            {['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'].map(font => <SelectItem key={font} value={font}>{font}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Headings */}
        <Select onValueChange={(value) => editor.chain().focus().toggleHeading({ level: parseInt(value) }).run()}>
          <SelectTrigger className="w-[100px]"><SelectValue placeholder="Heading" /></SelectTrigger>
          <SelectContent>
            {[1,2,3,4,5,6].map(lvl => <SelectItem key={lvl} value={lvl.toString()}>H{lvl}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Alignments */}
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('justify').run()}><AlignJustify className="w-4 h-4" /></Button>

        {/* Lists */}
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-4 h-4" /></Button>

        {/* Colors */}
        <Input type="color" className="w-8 h-8 p-0" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} title="Text Color" />
        <Input type="color" className="w-8 h-8 p-0" onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()} title="Highlight" />

        {/* Link */}
        <Button variant="ghost" size="sm" onClick={() => {
          const url = prompt('Enter URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}><LinkIcon className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().unsetLink().run()}><LinkIcon className="w-4 h-4 text-red-500" /></Button>

        {/* Image Upload */}
        <label className="cursor-pointer">
          <ImageIcon className="w-4 h-4" />
          <Input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>

        {/* Undo/Redo */}
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()}><Undo className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()}><Redo className="w-4 h-4" /></Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Free-Drag Image Layer */}
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
              style={{ width: '100%', height: '100%', objectFit: 'contain', border: selectedImage?.id === img.id ? '2px solid blue' : 'none' }}
            />
            {/* Resize Handle */}
            <div
              className="absolute right-0 bottom-0 w-4 h-4 bg-blue-500 cursor-se-resize"
              onMouseDown={(e) => {
                e.stopPropagation();
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = img.width;
                const startHeight = img.height;
                const resizeMove = (moveE: MouseEvent) => {
                  const dx = moveE.clientX - startX;
                  const dy = moveE.clientY - startY;
                  handleResize(dx, dy);
                };
                const resizeUp = () => {
                  window.removeEventListener('mousemove', resizeMove);
                  window.removeEventListener('mouseup', resizeUp);
                };
                window.addEventListener('mousemove', resizeMove);
                window.addEventListener('mouseup', resizeUp);
              }}
            />
          </div>
        ))}
      </div>

      {/* Floating Image Toolbar (appears when image selected) */}
      {selectedImage && (
        <div className="hybrid-toolbar absolute z-50 bg-white shadow-md rounded p-2 flex gap-1" style={{ top: 10, right: 10 }}>
          <Button variant="ghost" size="sm" onClick={() => handleWrap('inline')} title="Inline with text"><WrapText className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleWrap('left')} title="Text wrap left"><AlignLeft className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleWrap('right')} title="Text wrap right"><AlignRight className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleWrap('break')} title="Break text"><AlignCenter className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={handleReplaceImage} title="Replace"><ImageIcon className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={toggleAspectRatio} title="Toggle Aspect Lock">
            {aspectRatioLocked[selectedImage.id] ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDeleteImage} title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></Button>
        </div>
      )}
    </div>
  );
};

export default HybridEditor;
