import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-soft/30">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="min-w-0 flex-1 overflow-y-auto">
        {/* Header with Hamburger */}
        <div className="flex items-center bg-white p-4 shadow-sm md:hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-primary"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="ml-4 font-bold">Service Ac Sumbar</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}