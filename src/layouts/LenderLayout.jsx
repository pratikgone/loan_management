import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import LenderNavbar from "../lenderpages/LenderNavbar";
import LenderSidebar from "../lenderpages/LenderSidebar";

const LenderLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      <LenderSidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
      />

      <div className={`transition-all duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-72"}`}>

        <LenderNavbar
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
        />

        {/* Main Content - Same as AdminLayout */}
        <main className="mt-16 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LenderLayout;