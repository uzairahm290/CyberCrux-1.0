"use client";

import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const inputCls = "w-full bg-[#080808] border border-white/[0.07] rounded-lg px-4 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-red-600/40 transition-colors";

function BlogForm() {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState("");
  const [date, setDate] = useState("");
  const [readTime, setReadTime] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featured, setFeatured] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to load blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title);
      setAuthor(editingBlog.author);
      setAuthorAvatar(editingBlog.author_avatar || "");
      setDate(editingBlog.date?.split("T")[0] || "");
      setReadTime(editingBlog.read_time || "");
      setCategory(editingBlog.category || "");
      setTags(editingBlog.tags || "");
      setExcerpt(editingBlog.excerpt || "");
      setFeatured(!!editingBlog.featured);
      if (editorRef.current) editorRef.current.setContent(editingBlog.content || "");
    } else {
      setTitle(""); setAuthor(""); setAuthorAvatar(""); setDate("");
      setReadTime(""); setCategory(""); setTags(""); setExcerpt(""); setFeatured(false);
      if (editorRef.current) editorRef.current.setContent("");
    }
  }, [editingBlog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = editorRef.current?.getContent() || "";
    const blogData = { title, author, author_avatar: authorAvatar, date, read_time: readTime, category, tags, excerpt, content, featured };
    const url = editingBlog
      ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"}/api/blogs/${editingBlog.id}`
      : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/blogs";
    const method = editingBlog ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(blogData) });
      const data = await res.json();
      if (res.ok) {
        alert(`Blog ${editingBlog ? "updated" : "created"} successfully!`);
        setEditingBlog(null);
        fetchBlogs();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Failed to submit blog");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"}/api/blogs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) { fetchBlogs(); } else { alert("Error: " + data.error); }
    } catch { alert("Failed to delete blog"); }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{editingBlog ? "Edit Blog" : "Blog Management"}</h2>
          <p className="text-white/40 text-sm mt-0.5">{editingBlog ? "Update existing blog post" : "Create and manage blog posts"}</p>
        </div>
        {editingBlog && (
          <button onClick={() => setEditingBlog(null)} className="text-white/40 hover:text-white/70 text-sm transition-colors">
            ← Back to list
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#0F0F0F] border border-white/[0.07] rounded-xl p-6 space-y-4">
        <h3 className="text-white font-semibold mb-2">{editingBlog ? "Edit Blog Post" : "Create New Blog Post"}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className={inputCls} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <input className={inputCls} placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} required />
        </div>
        <input className={inputCls} placeholder="Author Avatar URL" value={authorAvatar} onChange={e => setAuthorAvatar(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className={inputCls} type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <input className={inputCls} placeholder="Read Time (e.g., 5 min read)" value={readTime} onChange={e => setReadTime(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className={inputCls} placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
          <input className={inputCls} placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
        </div>
        <textarea className={`${inputCls} resize-none`} placeholder="Excerpt" rows={3} value={excerpt} onChange={e => setExcerpt(e.target.value)} />
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} className="accent-red-600 w-4 h-4" />
          <label htmlFor="featured" className="text-white/60 text-sm">Featured Blog</label>
        </div>

        <div className="rounded-lg overflow-hidden border border-white/[0.07]">
          <Editor
            apiKey="df3itb44jlg0egy6rf936tlz71vxjcb1y5k5ooe516buyft8"
            onInit={(evt, editor) => {
              editorRef.current = editor;
              if (editingBlog?.content) editor.setContent(editingBlog.content);
            }}
            init={{
              height: 400,
              menubar: true,
              skin: "oxide-dark",
              content_css: "dark",
              plugins: "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount emoticons",
              toolbar: "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | code preview fullscreen",
            }}
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
            {editingBlog ? "Update Blog" : "Publish Blog"}
          </button>
          {editingBlog && (
            <button type="button" onClick={() => setEditingBlog(null)} className="px-6 py-2.5 bg-white/[0.05] hover:bg-white/[0.08] text-white/70 rounded-lg transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Blog List */}
      <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-white font-semibold">Published Blogs ({blogs.length})</h3>
        </div>
        {blogs.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-8">No blogs found.</p>
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {blogs.map(blog => (
              <li key={blog.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
                <div>
                  <h4 className="text-white font-medium">{blog.title}</h4>
                  <p className="text-white/40 text-sm">by {blog.author} · {new Date(blog.date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingBlog(blog)} className="p-2 text-white/40 hover:text-blue-400 hover:bg-blue-600/10 rounded-lg transition-colors" title="Edit">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="p-2 text-white/40 hover:text-red-400 hover:bg-red-600/10 rounded-lg transition-colors" title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BlogForm;
