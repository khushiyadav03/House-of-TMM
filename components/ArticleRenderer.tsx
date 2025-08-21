/**
 * @file ArticleRenderer.tsx
 * @description Renders article content created with the Fabric.js editor.
 * It loads the saved JSON into a static, non-editable canvas.
 */
'use client';

import React from 'react';

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

interface ArticleRendererProps {
  content: string; // HTML from TipTap
  images?: ImageState[]; // Image layer state
}

const ArticleRenderer = ({ content, images = [] }: ArticleRendererProps) => {
  return (
    <div className="relative min-h-[500px]">
      {/* Render TipTap HTML content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      {/* Render image layer */}
      <div className="absolute inset-0 pointer-events-none">
        {images.map((img) => (
          <img
            key={img.id}
            src={img.src}
            alt=""
            style={{
              position: 'absolute',
              left: img.x,
              top: img.y,
              width: img.width,
              height: img.height,
              zIndex: img.zIndex,
              objectFit: 'contain',
              pointerEvents: 'auto',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ArticleRenderer; 