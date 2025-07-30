import { FaBook, FaMap, FaBlog, FaUser } from "react-icons/fa";

export default function AdminHome() {
  // Dummy stats and activity
  const stats = [
    { label: "Total Blogs", value: 12, icon: <FaBlog className="text-2xl" /> },
    { label: "Total Books", value: 8, icon: <FaBook className="text-2xl" /> },
    { label: "Total Roadmaps", value: 5, icon: <FaMap className="text-2xl" /> },
    { label: "Total Users", value: 120, icon: <FaUser className="text-2xl" /> },
  ];
  const activity = [
    "Blog “How to Use Tiptap” was updated.",
    "Book “Cybersecurity Essentials” was added.",
    "Roadmap “Frontend Developer” was published.",
    "User “alice” registered.",
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, Admin!</h1>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-r from-blue-${(i+3)*100} to-blue-${(i+4)*100} text-white rounded-xl p-6 shadow flex flex-col items-start`}
          >
            <div className="flex items-center gap-2 mb-2">{stat.icon}<span className="text-lg font-semibold">{stat.label}</span></div>
            <span className="text-3xl font-bold mt-2">{stat.value}</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <ul className="divide-y">
          {activity.map((item, i) => (
            <li key={i} className="py-2 text-gray-700">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 