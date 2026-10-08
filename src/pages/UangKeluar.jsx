// src/pages/UangKeluar.jsx (BARU)
import { useEffect, useState } from "react";
import { getExpenses } from "../services/expenseService";

export default function UangKeluar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getExpenses()
      .then(setData)
      .catch((err) =>
        setError(
          err instanceof TypeError
            ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
            : err.message
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const total = data.reduce((jumlah, e) => jumlah + e.jumlah, 0);

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">Uang Keluar</h1>
      </header>

      <main className="p-6">
        {loading && <p className="text-sm text-gray-500">Memuat data uang keluar...</p>}
        {error && <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto rounded-xl bg-white p-5 shadow">
            <table className="w-full text-left text-sm">
              <thead className="bg-soft text-primary">
                <tr>
                  {["No", "Tanggal", "Keterangan", "Jumlah"].map((h) => (
                    <th key={h} className="px-3 py-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((e, i) => (
                  <tr key={e.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2">{e.tanggal}</td>
                    <td className="px-3 py-2">{e.keterangan}</td>
                    <td className="px-3 py-2">Rp {e.jumlah.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-gray-500">Belum ada data uang keluar</td></tr>
                )}
              </tbody>
              {data.length > 0 && (
                <tfoot>
                  <tr className="font-semibold">
                    <td colSpan={3} className="px-3 py-2 text-right">Total</td>
                    <td className="px-3 py-2">Rp {total.toLocaleString("id-ID")}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </main>
    </>
  );
}