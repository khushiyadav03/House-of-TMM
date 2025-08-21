"use client";

import { Editor } from "@tinymce/tinymce-react";
import React, { useRef } from "react";

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
}

export default function TinyMCEEditor({
  value,
  onChange,
  height = 400,
  placeholder = "Start writing your article…",
}: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "no-api-key";
  const scriptSrc = '/vendor/tinymce/tinymce.min.js';

  return (
    <Editor
      apiKey={apiKey}
      tinymceScriptSrc={scriptSrc}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height,
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
          "emoticons",
          "template",
          "codesample",
          "hr",
          "pagebreak",
          "nonbreaking",
          "toc",
          "imagetools",
        ],
        toolbar:
          "undo redo | blocks | bold italic underline strikethrough | " +
          "link image media | alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | removeformat | code fullscreen",
        placeholder,
        content_style:
          'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; font-size: 16px; line-height: 1.6; } img { max-width: 100%; height: auto; }',
      }}
    />
  );
}
