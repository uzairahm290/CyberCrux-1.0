"use client";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import RequireAdminAuth from "./RequireAdminAuth";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  
  // Don't wrap login page with the admin layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <RequireAdminAuth>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 p-0">
            {children}
          </main>
        </div>
      </div>
    </RequireAdminAuth>
  );
}
