"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function TiptapEditor({ value, onChange }: Props) {
  // Track whether we've fired the initial normalization callback.
  // When an existing course is opened in edit mode, the DB may hold plain text
  // (pre-TipTap). TipTap wraps it in <p> internally but never fires onUpdate
  // unless the user types. We fire onChange once on mount so the form value
  // is updated to proper HTML and saved correctly on the next submit.
  const initializedRef = useRef(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[180px] p-4 cursor-text",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Normalize plain-text → HTML on first editor mount.
  useEffect(() => {
    if (!editor || initializedRef.current) return;
    initializedRef.current = true;

    const html = editor.getHTML();
    // Only fire if TipTap produced a different (i.e. HTML-wrapped) version.
    // Empty editors return "<p></p>" — skip those to avoid polluting empty fields.
    const isEmpty = html === "<p></p>" || html === "";
    if (!isEmpty && html !== value) {
      onChange(html);
    }
  }, [editor]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep editor in sync when `value` is changed externally (e.g. reset/refill).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `p-1.5 rounded hover:bg-gold/15 hover:text-gold transition-colors cursor-pointer ${
      active ? "bg-gold/20 text-gold font-bold" : "text-text-secondary"
    }`;

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-bg/50">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1.5 bg-surface/50 border-b border-border/80">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive("bold"))}
          title="Bold"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive("italic"))}
          title="Italic"
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btnClass(editor.isActive("strike"))}
          title="Strike"
        >
          <Strikethrough size={14} />
        </button>

        <div className="h-4 w-[1px] bg-border mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={btnClass(editor.isActive("heading", { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 size={14} />
        </button>

        <div className="h-4 w-[1px] bg-border mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive("orderedList"))}
          title="Ordered List"
        >
          <ListOrdered size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive("blockquote"))}
          title="Blockquote"
        >
          <Quote size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={btnClass(false)}
          title="Divider"
        >
          <Minus size={14} />
        </button>

        <div className="h-4 w-[1px] bg-border mx-1 ml-auto" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-gold/15 hover:text-gold text-text-secondary disabled:opacity-30 transition-colors cursor-pointer"
          title="Undo"
        >
          <Undo size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-gold/15 hover:text-gold text-text-secondary disabled:opacity-30 transition-colors cursor-pointer"
          title="Redo"
        >
          <Redo size={14} />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent
        editor={editor}
      />
    </div>
  );
}