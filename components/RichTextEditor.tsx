/**
 * @file RichTextEditor.tsx
 * @description Advanced canvas-based WYSIWYG editor using Fabric.js for free-form, draggable, and resizable blocks (text, images, headers, etc.).
 * Features: aspect-ratio-locked image resizing, floating toolbar/context menu for images, and persistent block positions.
 */
import React, { useCallback } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import * as lowlight from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
lowlight.registerLanguage('javascript', javascript);
lowlight.registerLanguage('python', python);
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, Quote, Code, Image as ImageIcon, Link2, Undo2, Redo2, Table as TableIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (html: string) => void;
  uploadUrl: string;
}

const RichTextEditor = ({ initialValue, onChange, uploadUrl }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: initialValue || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg min-h-[400px] max-w-none focus:outline-none',
      },
    },
    immediatelyRender: false, // Fix SSR hydration error
  });

  // Image upload handler
  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(uploadUrl, { method: 'POST', body: formData });
      const { url } = await response.json();
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } catch (error) {
      alert('Image upload failed');
    }
  }, [editor, uploadUrl]);

  if (!editor) return <div className="min-h-[400px] flex items-center justify-center text-gray-500">Loading editor...</div>;

  return (
    <div className="border rounded-lg relative">
      <div className="toolbar flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().toggleBold()}><Bold className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().toggleItalic()}><Italic className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleUnderline().run()} disabled={!editor.can().toggleUnderline()}><UnderlineIcon className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().toggleStrike()}><Strikethrough className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().setParagraph().run()}>P</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()}><Undo2 className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()}><Redo2 className="w-4 h-4" /></Button>
        <label className="inline-flex items-center cursor-pointer">
          <ImageIcon className="w-4 h-4" />
          <Input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
        <Button type="button" variant="ghost" size="sm" onClick={() => {
          const url = prompt('Enter URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}><Link2 className="w-4 h-4" /></Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;


