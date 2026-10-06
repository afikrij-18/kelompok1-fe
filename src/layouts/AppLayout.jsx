import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar"; // lokasi Sidebar tidak dipindah

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-soft/30">
      <Sidebar />
      <div className="min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}