import { useRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Heading2, Italic, Link2, List, Quote, Undo2, Redo2 } from 'lucide-react'
import { compressImage } from '../../utils/compressImage'
import { uploadImage } from '../../lib/api'

function ToolButton({ active, title, onClick, children }) {
  return (
    <button type="button" title={title} aria-label={title} className={active ? 'active' : ''} onClick={onClick}>
      {children}
    </button>
  )
}

export default function RichTextEditor({ content, onChange }) {
  const fileRef = useRef(null)
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder: 'Tulis kabar sekolah di sini…' }),
    ],
    content: content || '',
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
  })

  if (!editor) return <div className="admin-editor"><div className="tiptap" style={{ minHeight: 380 }} /></div>

  async function insertImage(file) {
    if (!file) return
    try {
      const compact = await compressImage(file)
      const url = await uploadImage(compact)
      editor.chain().focus().setImage({ src: url, alt: 'Ilustrasi berita' }).run()
    } catch (err) {
      window.alert(`Gagal memasukkan gambar: ${err.message}`)
    }
  }

  return (
    <div className="admin-editor">
      <div className="admin-editor__toolbar">
        <ToolButton title="Tebal" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></ToolButton>
        <ToolButton title="Miring" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></ToolButton>
        <ToolButton title="Judul bagian" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></ToolButton>
        <ToolButton title="Daftar" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></ToolButton>
        <ToolButton title="Kutipan" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={16} /></ToolButton>
        <ToolButton title="Tautan" active={editor.isActive('link')} onClick={() => {
          const previous = editor.getAttributes('link').href || ''
          const url = window.prompt('Alamat tautan (https://…)', previous)
          if (url === null) return
          if (!url) editor.chain().focus().unsetLink().run()
          else editor.chain().focus().setLink({ href: url }).run()
        }}><Link2 size={16} /></ToolButton>
        <ToolButton title="Gambar dalam artikel" onClick={() => fileRef.current?.click()}>Gambar</ToolButton>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="visually-hidden"
          onChange={(event) => insertImage(event.target.files?.[0])}
        />
        <ToolButton title="Urungkan" onClick={() => editor.chain().focus().undo().run()}><Undo2 size={16} /></ToolButton>
        <ToolButton title="Ulangi" onClick={() => editor.chain().focus().redo().run()}><Redo2 size={16} /></ToolButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
