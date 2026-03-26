import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
      />

      {/* CONTENT AREA */}
      <div
        className={`
        ${isCollapsed ? "lg:ml-20" : "lg:ml-72"}`}
      >
        <Navbar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />

        <main className="p-6 pt-20">
          {children}
          <Outlet />
        </main>
      </div>

    </div>
  );
}