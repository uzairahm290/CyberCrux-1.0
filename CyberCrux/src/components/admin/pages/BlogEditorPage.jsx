import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import DOMPurify from "dompurify";

export default function BlogEditorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const blogs = location.state?.blogs || [];
  const blog = editing ? blogs.find(b => b.id === Number(id)) : null;

  const [form, setForm] = useState({
    title: blog?.title || "",
    author: blog?.author || "",
    html: blog?.content || "",
  });

  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content: form.html,
    onUpdate: ({ editor }) => {
      setForm(f => ({ ...f, html: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: "border p-2 rounded min-h-[120px] bg-white outline-none prose max-w-none",
      },
    },
  });

  useEffect(() => {
    if (editor && form.html !== editor.getHTML()) {
      editor.commands.setContent(form.html || "<p></p>");
    }
    // eslint-disable-next-line
  }, [editor]);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    // For demo: just go back to admin page
    navigate("/admin/blogs");
  }

  function handleCancel() {
    navigate("/admin/blogs");
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{editing ? "Edit Blog" : "Add Blog"}</h1>
      <form className="grid md:grid-cols-2 gap-8 items-start" onSubmit={handleSave}>
        <div className="flex flex-col gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Title"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Author"
            name="author"
            value={form.author}
            onChange={handleFormChange}
            required
          />
          <div>
            <div className="font-semibold mb-1">Content</div>
            <div className="bg-white rounded border">
              <div className="flex gap-2 mb-2 flex-wrap p-2">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 rounded bg-gray-200">B</button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 rounded bg-gray-200">I</button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="px-2 py-1 rounded bg-gray-200">H1</button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 rounded bg-gray-200">H2</button>
                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 rounded bg-gray-200">• List</button>
                <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="px-2 py-1 rounded bg-gray-200">1. List</button>
                <button type="button" onClick={() => editor.chain().focus().setLink({ href: prompt('URL:') || '' }).run()} className="px-2 py-1 rounded bg-gray-200">Link</button>
                <button type="button" onClick={() => editor.chain().focus().setImage({ src: prompt('Image URL:') || '' }).run()} className="px-2 py-1 rounded bg-gray-200">Image</button>
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-1">Live Preview</div>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog?.content) }}
          />
        </div>
      </form>
    </div>
  );
} 