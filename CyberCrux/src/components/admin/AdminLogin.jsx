import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "cybercrux123";
const ADMIN_AUTH_KEY = "cybercrux_admin_logged_in";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      form.username === ADMIN_USERNAME &&
      form.password === ADMIN_PASSWORD
    ) {
      localStorage.setItem(ADMIN_AUTH_KEY, "true");
      navigate("/admin/blogs");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6 border border-blue-200"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-2">Admin Login</h1>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <input
          className="border p-3 rounded text-lg"
          placeholder="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          required
        />
        <input
          className="border p-3 rounded text-lg"
          placeholder="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition"
        >
          Login
        </button>
      </form>
    </div>
  );
} 