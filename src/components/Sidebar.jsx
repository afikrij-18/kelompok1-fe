const menuOperasional = ["Dashboard", "Jadwal & Dispatch", "Layanan AC", "Teknisi Fleet", "Pelanggan"];
const menuLaporan = ["Laporan SLA & Rev", "Pengaturan"];

function MenuGroup({ title, items }) {
  return (
    <div className="mb-4">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-soft">{title}</p>
      <ul className="space-y-1">
        {items.map((m) => (
          <li
            key={m}
            className={`cursor-pointer rounded-lg px-3 py-2 text-sm ${
              m === "Dashboard" ? "bg-secondary font-semibold" : "hover:bg-accent"
            }`}
          >
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between bg-primary p-4 text-white md:flex">
      <div>
        <div className="mb-6 flex items-center gap-2 border-b border-white/20 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-white font-bold text-primary">X</div>
          <span className="font-bold">ServiceAC</span>
        </div>
        <MenuGroup title="Menu Operasional" items={menuOperasional} />
        <div className="my-4 border-t border-white/20" />
        <MenuGroup title="Laporan & Sistem" items={menuLaporan} />
      </div>

      <div className="flex items-center justify-between rounded-lg bg-white/10 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-white font-bold text-primary">A</div>
          <span className="text-sm font-medium">Admin</span>
        </div>
        <button title="Keluar" className="rounded p-1 hover:bg-accent">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </aside>
  );
}