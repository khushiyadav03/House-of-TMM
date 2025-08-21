import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';

export interface CustomImageOptions {
  onSelectImage?: (id: string) => void;
}

function parseStyleString(styleString: string | null): React.CSSProperties {
  if (!styleString) return {};
  return styleString.split(';').filter(Boolean).reduce((acc, rule) => {
    const [key, value] = rule.split(':');
    if (key && value) {
      acc[key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase())] = value.trim();
    }
    return acc;
  }, {} as Record<string, string>) as React.CSSProperties;
}

const CustomImageNodeView = (props: any) => {
  const { node, getPos, editor } = props;
  const id = node.attrs.id;
  const { style, ...restAttrs } = node.attrs;
  return (
    <NodeViewWrapper as="span">
      <img
        {...restAttrs}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          if (props.extension.options.onSelectImage) {
            props.extension.options.onSelectImage(id, typeof getPos === 'function' ? getPos() : null, 'block');
          }
          if (typeof getPos === 'function') {
            editor.commands.setNodeSelection(getPos());
          }
        }}
        style={{
          border: editor.isActive('image', { id }) ? '2px solid #007bff' : undefined,
          ...parseStyleString(style),
        }}
      />
    </NodeViewWrapper>
  );
};

const CustomImage = Node.create<CustomImageOptions>({
  name: 'image',
  group: 'block',
  inline: false,
  draggable: true,
  selectable: true,
  addOptions() {
    return {
      onSelectImage: undefined,
    };
  },
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      style: { default: null },
      id: { default: null },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'img[src]'
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(CustomImageNodeView);
  },
});

export default CustomImage; 