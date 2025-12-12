import React, { useState } from "react";
import AdminSidebar from "../AdminView/AdminSidebar";
import ConsellorComponent from "./ConsellorComponent";

const ConsellorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <ConsellorComponent setSidebarOpen={setSidebarOpen} />
    </div>
  );
};

export default ConsellorDashboard;
