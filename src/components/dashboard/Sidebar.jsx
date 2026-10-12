// src/components/dashboard/Sidebar.jsx
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarClock,
  Snowflake,
  Wrench,
  Users,
  FileText,
  Settings,
  LogOut,
  Wallet,
  UserCircle,
  KeyRound,
  Store,
  ChevronUp,
} from "lucide-react";
import { logout, getUser } from "../../services/authService";

// Langkah 3.1: path null = halaman belum dibuat, menu tampil redup dan tidak bisa diklik
const menuOperasional = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Booking", path: "/booking", icon: ClipboardList },
  { name: "Jadwal & Dispatch", path: "/jadwal", icon: CalendarClock },
  { name: "Layanan AC", path: "/layanan", icon: Snowflake },
  { name: "Teknisi", path: "/technician", icon: Wrench },
  { name: "User", path: "/users", icon: Users },
  { name: "Uang Keluar", path: "/uang-keluar", icon: Wallet },
];

const menuLaporan = [
  { name: "Laporan Penjualan", path: "/laporan-penjualan", icon: FileText },
  { name: "Pengaturan", path: "/pengaturan", icon: Settings },
];

// Langkah 3.2: pintasan di menu pengguna, membuka tab pengaturan yang sesuai
const menuPengguna = [
  { name: "Profil Saya", to: "/pengaturan?tab=profil", icon: UserCircle },
  {
    name: "Keamanan & Password",
    to: "/pengaturan?tab=keamanan",
    icon: KeyRound,
  },
  { name: "Pengaturan Usaha", to: "/pengaturan?tab=usaha", icon: Store },
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
                // menu "Booking" ikut aktif saat berada di /booking/baru
                // karena alamatnya diawali /booking
                <NavLink
                  to={m.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                      isActive
                        ? "bg-secondary font-semibold"
                        : "hover:bg-accent"
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

  // Langkah 3.3: menu pengguna terbuka atau tertutup, tertutup saat klik di luar atau tekan Esc
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const kartuRef = useRef(null);

  useEffect(() => {
    if (!menuTerbuka) return;

    const klikLuar = (e) => {
      if (kartuRef.current && !kartuRef.current.contains(e.target))
        setMenuTerbuka(false);
    };
    const tekanEsc = (e) => {
      if (e.key === "Escape") setMenuTerbuka(false);
    };

    document.addEventListener("mousedown", klikLuar);
    document.addEventListener("keydown", tekanEsc);
    return () => {
      document.removeEventListener("mousedown", klikLuar);
      document.removeEventListener("keydown", tekanEsc);
    };
  }, [menuTerbuka]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col justify-between bg-primary p-4 text-white md:flex">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* logo sama dengan homepage (ikon salju + SejukPro + keterangan) */}
        <Link
          to="/"
          className="mb-6 flex items-center gap-3 border-b border-white/20 pb-4"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-white shadow">
            <Snowflake size={24} />
          </div>
          <div className="leading-tight">
            <p className="text-xl font-extrabold tracking-tight text-white">
              Sejuk<span className="text-soft">Pro</span>
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-soft">
              AC Service &amp; Booking
            </p>
          </div>
        </Link>
        <MenuGroup title="Menu Operasional" items={menuOperasional} />
        <div className="my-4 border-t border-white/20" />
        <MenuGroup title="Laporan & Sistem" items={menuLaporan} />
      </div>

      {/* Langkah 3.4: kartu pengguna, klik avatar dan nama membuka menu, logout di sebelah kanan */}
      <div ref={kartuRef} className="relative mt-4">
        {menuTerbuka && (
          <div
            role="menu"
            className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-lg bg-white text-slate-800 shadow-lg"
          >
            <div className="border-b border-gray-100 p-3">
              <p className="truncate text-sm font-semibold">
                {user?.name || "Tamu"}
              </p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-soft px-2 py-0.5 text-[10px] font-medium capitalize text-primary">
                {user?.role}
              </span>
            </div>
            <ul className="p-1">
              {menuPengguna.map((m) => {
                const Icon = m.icon;
                return (
                  <li key={m.name}>
                    <Link
                      to={m.to}
                      role="menuitem"
                      onClick={() => setMenuTerbuka(false)}
                      className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-soft"
                    >
                      <Icon size={16} className="text-secondary" />
                      {m.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 rounded-lg bg-white/10 p-3">
          <button
            type="button"
            onClick={() => setMenuTerbuka(!menuTerbuka)}
            aria-haspopup="menu"
            aria-expanded={menuTerbuka}
            title="Profil dan pengaturan"
            className="-m-1 flex min-w-0 flex-1 items-center gap-2 rounded-lg p-1 text-left hover:bg-white/10"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-white font-bold uppercase text-primary">
              {user?.name?.[0] || "?"}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium">
                {user?.name || "Tamu"}
              </p>
              <p className="text-xs capitalize text-soft">{user?.role}</p>
            </div>
            <ChevronUp
              size={16}
              className={`shrink-0 transition-transform ${menuTerbuka ? "" : "rotate-180"}`}
            />
          </button>
          <button
            onClick={handleLogout}
            title="Keluar"
            className="shrink-0 rounded p-1 hover:bg-accent"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}