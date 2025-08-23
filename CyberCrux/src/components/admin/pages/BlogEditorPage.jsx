import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

function BlogForm() {
  const editorRef = useRef(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);

  // Fetch all blogs on load
  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to load blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Populate form fields if editing
  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title);
      setAuthor(editingBlog.author);
      if (editorRef.current) {
        editorRef.current.setContent(editingBlog.content);
      }
    } else {
      setTitle("");
      setAuthor("");
      if (editorRef.current) {
        editorRef.current.setContent("");
      }
    }
  }, [editingBlog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = editorRef.current?.getContent() || "";
    const blogData = { title, author, content };

    const url = editingBlog
      ? `http://localhost:5000/api/blogs/${editingBlog.id}`
      : "http://localhost:5000/api/blogs";

    const method = editingBlog ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Blog ${editingBlog ? "updated" : "created"} successfully!`);
        setEditingBlog(null);
        fetchBlogs(); // Refresh list
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("Request failed:", err);
      alert("❌ Failed to submit blog");
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-2 text-blue-800">
          {editingBlog ? "Edit Blog" : "Create Blog"}
        </h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full px-4 py-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Author"
          className="w-full px-4 py-2 border rounded"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <Editor
          apiKey="df3itb44jlg0egy6rf936tlz71vxjcb1y5k5ooe516buyft8"
          onInit={(evt, editor) => {
            editorRef.current = editor;
            if (editingBlog?.content) {
              editor.setContent(editingBlog.content);
            }
          }}
          init={{
            height: 400,
            menubar: true,
            plugins:
              "advlist autolink lists link image charmap preview anchor " +
              "searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount emoticons",
            toolbar:
              "undo redo | formatselect | bold italic backcolor | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist outdent indent | link image media | code preview fullscreen",
            automatic_uploads: true,
            file_picker_types: "image",
            file_picker_callback: (callback) => {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.onchange = function () {
                const file = this.files[0];
                const reader = new FileReader();
                reader.onload = function () {
                  callback(reader.result, { alt: file.name });
                };
                reader.readAsDataURL(file);
              };
              input.click();
            },
          }}
        />

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editingBlog ? "Update Blog" : "Submit Blog"}
        </button>
      </form>

      <div className="bg-white shadow rounded p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Existing Blogs</h3>
        {blogs.length === 0 ? (
          <p className="text-gray-500">No blogs found.</p>
        ) : (
          <ul className="space-y-4">
            {blogs.map((blog) => (
              <li
                key={blog.id}
                className="border p-4 rounded flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <h4 className="font-bold text-blue-700">{blog.title}</h4>
                  <p className="text-sm text-gray-600">
                    by {blog.author} • {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleEdit(blog)}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BlogForm;
