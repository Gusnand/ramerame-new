// components/RichTextEditor.jsx
import { Button } from '@/components/ui/button';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
} from 'lucide-react';
import { EditorContent } from './ui/editor-content-tiptap';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
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
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="mt-1 rounded-md border">
      <div className="flex flex-wrap gap-1 border-r border-gray-600 p-2">
        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('bold') ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('italic') ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('underline') ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('heading', { level: 1 }) ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('heading', { level: 2 }) ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('heading', { level: 3 }) ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('bulletList') ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive('orderedList') ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive({ textAlign: 'left' }) ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive({ textAlign: 'center' }) ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={editor.isActive({ textAlign: 'right' }) ? 'dark:bg-gray-600' : ''}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-100">
        <EditorContent editor={editor} className="min-h-[400px] p-4 outline-none focus:outline-none" />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
