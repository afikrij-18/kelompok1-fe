import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarClock,
  Snowflake,
  Wrench,
  Users,
  FileText,
  Settings,
  LogOut,
  CalendarPlus,
} from "lucide-react";
import { logout, getUser } from "../../services/authService";

const menuOperasional = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Booking Baru", path: "/booking/baru", icon: CalendarPlus },
  { name: "Jadwal & Dispatch", path: null, icon: CalendarClock },
  { name: "Layanan AC", path: "/layanan", icon: Snowflake },
  { name: "Teknisi Fleet", path: null, icon: Wrench },
  { name: "User", path: "/users", icon: Users },
];

const menuLaporan = [
  { name: "Laporan SLA & Rev", path: null, icon: FileText },
  { name: "Pengaturan", path: null, icon: Settings },
];

function MenuGroup({ title, items }) {
  return (
    <div className="mb-4">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-soft">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((m) => {
          const Icon = m.icon;
          return (
            <li key={m.name}>
              {m.path ? (
                <NavLink
                  to={m.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                      isActive ? "bg-secondary font-semibold" : "hover:bg-accent"
                    }`
                  }
                >
                  <Icon size={18} />
                  {m.name}
                </NavLink>
              ) : (
                <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm opacity-60">
                  <Icon size={18} />
                  {m.name}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();

  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col justify-between bg-primary p-4 text-white md:flex">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Link to="/" className="mb-6 flex items-center gap-2 border-b border-white/20 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-white font-bold text-primary">X</div>
          <span className="font-bold">ServiceAC</span>
        </Link>
        <MenuGroup title="Menu Operasional" items={menuOperasional} />
        <div className="my-4 border-t border-white/20" />
        <MenuGroup title="Laporan & Sistem" items={menuLaporan} />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-white/10 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-white font-bold uppercase text-primary">
            {user?.name?.[0] || "?"}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium">{user?.name || "Tamu"}</p>
            <p className="text-xs capitalize text-soft">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} title="Keluar" className="rounded p-1 hover:bg-accent">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}