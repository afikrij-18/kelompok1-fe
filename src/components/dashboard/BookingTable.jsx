// src/components/dashboard/BookingTable.jsx
// Langkah 2: tabel booking terbaru dari API, status mengikuti backend
import { useState } from "react";
import { Link } from "react-router-dom";

// Langkah 2.1: warna badge tiap status
const badgeColor = {
  Menunggu: "bg-yellow-100 text-yellow-700",
  Dikonfirmasi: "bg-soft text-primary",
  Selesai: "bg-green-100 text-green-700",
  Dibatalkan: "bg-red-100 text-red-700",
};

// Langkah 2.2: tab filter, "Semua" tidak punya status khusus
const tabs = ["Semua", "Menunggu", "Dikonfirmasi", "Selesai", "Dibatalkan"];

// jumlah baris maksimal di dashboard, selengkapnya ada di menu Booking
const MAKS_BARIS = 10;

export default function BookingTable({ data, loading = false }) {
  const [active, setActive] = useState("Semua");

  // jumlah data per tab, tampil di dalam kurung
  const count = (t) => (t === "Semua" ? data.length : data.filter((d) => d.status === t).length);

  // Langkah 2.3: data dari API sudah terurut terbaru lebih dulu
  const terfilter = active === "Semua" ? data : data.filter((d) => d.status === active);
  const rows = terfilter.slice(0, MAKS_BARIS);

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-primary">Booking Terbaru</h2>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`rounded-lg border px-3 py-1 text-sm ${
              active === t ? "border-primary bg-primary text-white" : "border-gray-300 hover:bg-soft"
            }`}
          >
            {t} ({count(t)})
          </button>
        ))}
        <Link to="/booking" className="ml-auto text-sm font-medium text-secondary hover:underline">
          Lihat semua
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-soft text-primary">
            <tr>
              {/* Langkah 2.4: kolom teknisi dihapus, backend belum punya data teknisi */}
              {["No Registrasi", "Pelanggan", "Layanan AC", "Jadwal Service", "Status Operasional"].map((h) => (
                <th key={h} className="px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="border-b border-gray-100 align-top last:border-0">
                <td className="px-3 py-2 font-mono text-xs">{b.kode}</td>
                <td className="px-3 py-2">{b.pelanggan}</td>

                <td className="px-3 py-2">
                  {b.items.length > 1 && (
                    <p className="mb-1 text-xs font-semibold text-primary">{b.items.length} unit AC</p>
                  )}
                  <ul className="space-y-0.5">
                    {b.items.map((it) => (
                      <li key={it.id} className="text-xs">
                        <span className="text-gray-500">{it.unit}:</span> {it.layanan}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1 text-xs font-semibold">
                    Total Rp {b.total.toLocaleString("id-ID")}
                  </p>
                </td>

                <td className="px-3 py-2">{b.jadwal}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${badgeColor[b.status] || "bg-gray-100 text-gray-700"}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">Memuat data booking...</td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">Tidak ada booking</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && terfilter.length > MAKS_BARIS && (
        <p className="mt-3 text-xs text-gray-500">
          Menampilkan {MAKS_BARIS} dari {terfilter.length} booking.
        </p>
      )}
    </div>
  );
}