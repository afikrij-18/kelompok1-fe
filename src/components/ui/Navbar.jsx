import { useState } from "react";
import {
  Snowflake,
  CalendarDays,
  ChartNoAxesCombined,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#c4e2f5] bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2c5ead] text-white shadow-md shadow-[#2c5ead]/25 transition-transform group-hover:scale-105">
            <Snowflake className="h-6 w-6 text-[#4bb8fa]" />
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-bold leading-none tracking-tight text-[#024594] sm:text-2xl">
              Sejuk<span className="text-[#1591dc]">Pro</span>
            </span>

            <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[#434751] sm:text-[10px]">
              AC Service & Booking
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-1 md:flex lg:gap-2">
          <a
            href="#hero"
            className="rounded-lg bg-[#e8f5ff] px-3.5 py-2 text-xs font-bold text-[#2c5ead]"
          >
            Beranda
          </a>

          <a
            href="#layanan"
            className="rounded-lg px-3.5 py-2 text-xs font-bold text-[#434751] transition-colors hover:bg-[#e8f5ff] hover:text-[#2c5ead]"
          >
            Layanan
          </a>

          <a
            href="#kenapa-kami"
            className="rounded-lg px-3.5 py-2 text-xs font-bold text-[#434751] transition-colors hover:bg-[#e8f5ff] hover:text-[#2c5ead]"
          >
            Keunggulan
          </a>

          <a
            href="#cara-booking"
            className="rounded-lg px-3.5 py-2 text-xs font-bold text-[#434751] transition-colors hover:bg-[#e8f5ff] hover:text-[#2c5ead]"
          >
            Cara Booking
          </a>

          <a
            href="#cek-status"
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold text-[#434751] transition-colors hover:bg-[#e8f5ff] hover:text-[#2c5ead]"
          >
            <ChartNoAxesCombined className="h-4 w-4 text-[#1591dc]" />
            Cek Status
          </a>
        </nav>

        <div className="hidden md:flex">
          <a
            href="/booking"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2c5ead] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#2c5ead]/30 transition-all hover:-translate-y-0.5 hover:bg-[#1e488d] sm:text-sm"
          >
            <CalendarDays className="h-4 w-4" />
            Booking Service
          </a>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-[#2c5ead] md:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#c4e2f5] bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {[
              ["#hero", "Beranda"],
              ["#layanan", "Layanan"],
              ["#kenapa-kami", "Keunggulan"],
              ["#cara-booking", "Cara Booking"],
              ["#cek-status", "Cek Status"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-bold text-[#434751] hover:bg-[#e8f5ff] hover:text-[#2c5ead]"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
