// src/components/Pagination.jsx
// Langkah 2: kontrol halaman di bawah tabel, dipakai semua tabel
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  total,
  perPage,
  onChange,
}) {
  if (total === 0) return null;

  const dari = (page - 1) * perPage + 1;
  const sampai = Math.min(page * perPage, total);

  // Langkah 2.1: nomor yang tampil: pertama, terakhir, dan satu di kiri-kanan halaman aktif, sisanya "..."
  const nomor = [];
  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= 1) nomor.push(n);
    else if (nomor[nomor.length - 1] !== "...") nomor.push("...");
  }

  const tombol =
    "flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-sm";
  const tombolNav = `${tombol} border-gray-300 hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40`;

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-gray-500">
        Menampilkan {dari}-{sampai} dari {total} data
      </p>

      {totalPages > 1 && (
        <nav className="flex items-center gap-1" aria-label="Halaman">
          <button
            type="button"
            onClick={() => onChange(page - 1)}
            disabled={page === 1}
            title="Sebelumnya"
            className={tombolNav}
          >
            <ChevronLeft size={16} />
          </button>

          {nomor.map((n, i) =>
            n === "..." ? (
              <span key={`titik-${i}`} className="px-1 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                aria-current={n === page ? "page" : undefined}
                className={`${tombol} ${
                  n === page
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 hover:bg-soft"
                }`}
              >
                {n}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onChange(page + 1)}
            disabled={page === totalPages}
            title="Berikutnya"
            className={tombolNav}
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      )}
    </div>
  );
}