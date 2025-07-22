/**
 * @file ArticleRenderer.tsx
 * @description Renders article content created with the Fabric.js editor.
 * It loads the saved JSON into a static, non-editable canvas.
 */
'use client';

import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

interface ArticleRendererProps {
  content: string; // The JSON string from the database
}

const ArticleRenderer = ({ content }: ArticleRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!content || !canvasRef.current) return;

    const canvas = new fabric.StaticCanvas(canvasRef.current); // Use StaticCanvas for non-editable display

    try {
      const parsedContent = JSON.parse(content);
      // Adjust canvas dimensions to match the saved content
      canvas.setDimensions({ width: parsedContent.width || 800, height: parsedContent.height || 600 });
      canvas.loadFromJSON(parsedContent, canvas.renderAll.bind(canvas));
    } catch (error) {
      console.error("Failed to parse or load canvas content:", error);
      // Optionally, display a fallback message
      const text = new fabric.Text('Could not display article content.', {
        left: 10,
        top: 10,
        fontSize: 16,
        fill: 'red',
      });
      canvas.add(text);
    }
    
    return () => {
      canvas.dispose();
    };
  }, [content]);

  return <canvas ref={canvasRef} />;
};

export default ArticleRenderer; 