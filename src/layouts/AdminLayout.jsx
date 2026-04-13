import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ImpersonationBanner } from "../components/ImpersonationBanner";
import LenderNavbar from "../lenderpages/LenderNavbar";
import LenderSidebar from "../lenderpages/LenderSidebar";

export default function AdminLayout({ children }) {
 

  const {isImpersonating} = useSelector((state) => state.auth);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useSelector(s => s.auth);

  const isLender = user?.roleId === 1;



  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobileOpen(false);
        setIsCollapsed(false);
      }
    };

    handleResize();

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* impersonation banner */}
      <ImpersonationBanner />

       {/* Role wise Sidebar */}
      {isLender ? (
        <LenderSidebar
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          isCollapsed={isCollapsed}
        />
      ) : (
        <Sidebar
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          isCollapsed={isCollapsed}
        />
      )}

      {/* CONTENT AREA */}
      <div
        className={`
        ${isCollapsed ? "lg:ml-20" : "lg:ml-72"}`}
      >
        {/* Role wise Navbar */}
      {isLender ? (
        <LenderNavbar
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
        />
      ) : (
        <Navbar
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
        />
      )}

        <main className="p-6 pt-20 min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900">
          {children}
          <Outlet />
        </main>
      </div>

    </div>
  );
}