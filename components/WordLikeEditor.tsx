'use client';

import React, { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface WordLikeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const WordLikeEditor: React.FC<WordLikeEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.getContent() !== value) {
      editorRef.current.setContent(value || '');
    }
  }, [value]);

  return (
    <Editor
      tinymceScriptSrc="https://cdn.tiny.cloud/1/a8quqe5cb86zz2y0e5iipkvh0i6sueiqao2fjb4grp3f0dsn/tinymce/6/tinymce.min.js"
      onInit={(_, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={onChange}
      init={{
        height: 400,
        menubar: 'file edit insert view format tools table help',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
          'emoticons', 'template', 'save', 'print', 'imagetools',
        ],
        toolbar:
          'undo redo | blocks | fontsize | fontfamily | ' +
          'bold italic underline strikethrough superscript subscript | forecolor backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'link image media table | removeformat | code fullscreen help',
        content_style:
          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        image_advtab: true,
        image_caption: true,
        image_class_list: [
          { title: 'None', value: '' },
          { title: 'Inline', value: 'inline-image' },
          { title: 'Wrap Left', value: 'wrap-left' },
          { title: 'Wrap Right', value: 'wrap-right' },
          { title: 'Break Text', value: 'break-text' },
        ],
        content_css: [
          `.inline-image { display: inline-block; vertical-align: middle; margin: 10px; } /* Fixed margin for inline */
           .wrap-left, .wrap-right, .break-text { 
             float: left; /* Base float for left wrap (adjust per class below) */
             margin: 50px* Fixed outer margin for spacing from text */
             padding: 8px; /* Fixed inner padding for elegant inset */
             border: 1px solid #ddd; /* Subtle border for definition */
             border-radius: 6px; /* Rounded corners for modern look */
             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
             background-color: #f9f9f9; /* Light background for contrast */
           }
           .wrap-left { float: left; margin: 10px 10px 10px 0; clear: both; } /* Adjusted for left wrap */
           .wrap-right { float: right; margin: 10px 0 10px 10px; clear: both; } /* Adjusted for right wrap */
           .break-text { display: block; margin: 10px auto; text-align: center; clear: both; } /* Centered with fixed margin */`,
        ],
        images_upload_handler: async (blobInfo) => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());
            fetch('/api/upload', { method: 'POST', body: formData })
              .then((res) => res.json())
              .then((data) => resolve(data.url))
              .catch((err) => reject('Image upload failed: ' + err));
          });
        },
        object_resizing: 'img',
        imagetools_toolbar:
          'rotateleft rotateright | flipv fliph | editimage imageoptions',
        contextmenu: 'link image table | delete replace align',
        draggable_modal: true,
        paste_data_images: true,
        quickbars_selection_toolbar:
          'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        quickbars_insert_toolbar: 'quickimage quicktable',
      }}
    />
  );
};

export default WordLikeEditor;
