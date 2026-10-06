import { useState } from "react";

const badgeColor = {
  Menunggu: "bg-yellow-100 text-yellow-700",
  "Sedang dikerjakan": "bg-soft text-primary",
  Selesai: "bg-green-100 text-green-700",
};

const tabs = ["Semua", "Menunggu", "Sedang dikerjakan", "Selesai"];

export default function BookingTable({ data }) {
  const [active, setActive] = useState("Semua");

  const count = (t) => (t === "Semua" ? data.length : data.filter((d) => d.status === t).length);

  const rows = active === "Semua" ? data : data.filter((d) => d.status === active);

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
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-soft text-primary">
            <tr>
              {["No Registrasi", "Pelanggan", "Layanan AC", "Jadwal Service", "Teknisi Bertugas", "Status Operasional"].map((h) => (
                <th key={h} className="px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="border-b border-gray-100 align-top last:border-0">
                <td className="px-3 py-2">{b.id}</td>
                <td className="px-3 py-2">{b.pelanggan}</td>

                <td className="px-3 py-2">
                  {b.items.length > 1 && (
                    <p className="mb-1 text-xs font-semibold text-primary">{b.items.length} unit AC</p>
                  )}

                  <ul className="space-y-0.5">
                    {b.items.map((it, i) => (
                      <li key={i} className="text-xs">
                        <span className="text-gray-500">{it.unit}:</span> {it.layanan}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-1 text-xs font-semibold">
                    Total Rp {b.items.reduce((jumlah, it) => jumlah + it.harga, 0).toLocaleString("id-ID")}
                  </p>
                </td>

                <td className="px-3 py-2">{b.jadwal}</td>
                <td className="px-3 py-2">{b.teknisi}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${badgeColor[b.status]}`}>{b.status}</span>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">Tidak ada booking</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}