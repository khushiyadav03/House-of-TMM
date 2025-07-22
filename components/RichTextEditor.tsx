/**
 * @file RichTextEditor.tsx
 * @description A canvas-based WYSIWYG editor using Fabric.js for a free-form layout experience.
 * Supports draggable and resizable text blocks and images with aspect-ratio locking.
 */
'use client';

import { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bold, Italic, Type, Image as ImageIcon } from 'lucide-react';

interface FabricEditorProps {
  initialValue?: string; // Expecting a JSON string for Fabric.js
  onChange: (json: string) => void;
  uploadUrl: string;
}

const FabricEditor = ({ initialValue, onChange, uploadUrl }: FabricEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      height: 600,
      width: 800,
      backgroundColor: '#f8f9fa',
    });
    fabricCanvasRef.current = canvas;

    if (initialValue) {
      canvas.loadFromJSON(initialValue, canvas.renderAll.bind(canvas));
    }

    const saveState = () => {
      const json = JSON.stringify(canvas.toJSON());
      onChange(json);
    };
    
    const updateActiveObject = () => {
        setActiveObject(canvas.getActiveObject());
    }

    canvas.on('object:modified', saveState);
    canvas.on('object:added', saveState);
    canvas.on('selection:created', updateActiveObject);
    canvas.on('selection:updated', updateActiveObject);
    canvas.on('selection:cleared', updateActiveObject);


    return () => {
      canvas.dispose();
    };
  }, [initialValue, onChange]);

  const addText = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const text = new fabric.Textbox('Type something...', {
      left: 50,
      top: 50,
      width: 200,
      fontSize: 20,
    });
    canvas.add(text);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const canvas = fabricCanvasRef.current;
    if (!file || !canvas) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(uploadUrl, { method: 'POST', body: formData });
      const { url } = await response.json();
      if (url) {
        fabric.Image.fromURL(url, (img) => {
          img.scaleToWidth(200); // Initial scale
          img.set({ left: 100, top: 100 });
          canvas.add(img);
        }, { crossOrigin: 'anonymous' });
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };
  
  const toggleBold = () => {
    const text = activeObject as fabric.Textbox;
    if (text && text.type === 'textbox') {
        const isBold = text.get('fontWeight') === 'bold';
        text.set('fontWeight', isBold ? 'normal' : 'bold');
        fabricCanvasRef.current?.renderAll();
        onChange(JSON.stringify(fabricCanvasRef.current?.toJSON()));
    }
  }

  const toggleItalic = () => {
    const text = activeObject as fabric.Textbox;
    if (text && text.type === 'textbox') {
        const isItalic = text.get('fontStyle') === 'italic';
        text.set('fontStyle', isItalic ? 'normal' : 'italic');
        fabricCanvasRef.current?.renderAll();
        onChange(JSON.stringify(fabricCanvasRef.current?.toJSON()));
    }
  }

  return (
    <div className="border rounded-lg">
      <div className="toolbar flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <Button variant="ghost" size="sm" onClick={addText}><Type className="w-4 h-4" /> Add Text</Button>
        <Button variant="ghost" size="sm" onClick={triggerFileInput}><ImageIcon className="w-4 h-4" /> Add Image</Button>
        <Input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        <div className="h-6 border-l mx-2"></div>
        <Button variant="ghost" size="sm" onClick={toggleBold} disabled={!activeObject || activeObject.type !== 'textbox'}><Bold className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={toggleItalic} disabled={!activeObject || activeObject.type !== 'textbox'}><Italic className="w-4 h-4" /></Button>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default FabricEditor;


