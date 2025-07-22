import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CodeBlock from '@tiptap/extension-code-block';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  FileCode,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo,
  Trash2,
  Underline as UnderlineIcon,
  Undo,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { EditorContent } from './ui/editor-content-tiptap';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Write here...',
      }),
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-200',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'dark:bg-gray-700 bg-gray-700 p-4 rounded font-mono my-2',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
    } else {
      editor.chain().focus().unsetLink().run();
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      toast.promise(
        axios
          .post(`/products/editproduct/upload-image`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
          })
          .then((response) => {
            if (response.data.success) {
              editor.chain().focus().setImage({ src: response.data.url }).run();
              return response.data;
            }
            throw new Error('Failed to upload image');
          }),
        {
          loading: 'Uploading image...',
          success: 'Image uploaded successfully',
          error: 'Failed to upload image',
        },
      );
    }
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  return (
    <div className="mt-1 rounded-md border">
      <div className="flex flex-wrap gap-1 border-gray-200 p-2">
        {/* Format controls */}
        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('bold') ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('italic') ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('underline') ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('highlight') ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          title="Highlight"
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('code') ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className={editor.isActive('link') ? 'dark:bg-gray-600' : ''} title="Add Link">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium">Add Link</p>
              <div className="flex space-x-2">
                <Input type="url" placeholder="https://example.com" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="flex-1" />
                <Button size="sm" onClick={addLink}>
                  Add
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* Heading controls */}
        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('heading', { level: 1 }) ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('heading', { level: 2 }) ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('heading', { level: 3 }) ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* List controls */}
        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('bulletList') ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('orderedList') ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* Alignment controls */}
        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive({ textAlign: 'left' }) ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive({ textAlign: 'center' }) ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive({ textAlign: 'right' }) ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* Code block */}
        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('codeBlock') ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
        >
          <FileCode className="h-4 w-4" />
        </Button>

        {/* Image controls */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" title="Add Image">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium">Add Image</p>
              <div className="flex space-x-2">
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={addImage}>
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-500">Or upload an image</p>
              <div>
                <Input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="hidden" />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  Upload
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* Undo/Redo */}
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo className="h-4 w-4" />
        </Button>

        {/* Clear formatting */}
        <Button variant="ghost" size="sm" onClick={clearFormatting} title="Clear Formatting">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea>
        <EditorContent
          editor={editor}
          className="editor-content min-h-80 p-4 focus-within:shadow-none focus-within:ring-0 focus-within:outline-none focus:border-none focus:ring-0 focus:outline-none"
        />
        <ScrollBar className="dark:bg-gray-700" />
      </ScrollArea>
    </div>
  );
}
