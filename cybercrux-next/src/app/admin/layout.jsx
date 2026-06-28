"use client";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import RequireAdminAuth from "./RequireAdminAuth";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <RequireAdminAuth>
      <div className="flex min-h-screen bg-[#080808]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </RequireAdminAuth>
  );
}
