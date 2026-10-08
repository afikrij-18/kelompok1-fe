// src/pages/BookingList.jsx
// Langkah 7: daftar booking dengan cari, filter status, ubah status, dan hapus
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Trash2 } from "lucide-react";
import { getBookings, updateBookingStatus, deleteBooking } from "../services/bookingService";
import { STATUS_OPSI } from "../services/bookingMapper";
import ConfirmDeleteBooking from "../components/booking/ConfirmDeleteBooking";

const badgeColor = {
  Menunggu: "bg-yellow-100 text-yellow-700",
  Dikonfirmasi: "bg-soft text-primary",
  Selesai: "bg-green-100 text-green-700",
  Dibatalkan: "bg-red-100 text-red-700",
};

// TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

export default function BookingList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gagalMuat, setGagalMuat] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [updatingId, setUpdatingId] = useState(null); // booking yang statusnya sedang disimpan
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pesan, setPesan] = useState(null); // { tipe: "sukses" | "error", teks }

  useEffect(() => {
    getBookings()
      .then(setData)
      .catch((err) => {
        setGagalMuat(true);
        setPesan({ tipe: "error", teks: pesanError(err) });
      })
      .finally(() => setLoading(false));
  }, []);

  const rows = data.filter((b) => {
    const k = keyword.toLowerCase();
    const cocokKata =
      b.kode.toLowerCase().includes(k) ||
      b.pelanggan.toLowerCase().includes(k) ||
      b.telepon.includes(keyword);
    return cocokKata && (filter === "Semua" || b.status === filter);
  });

  // Langkah 7.1: ubah status lewat PUT, baris diganti dengan hasil dari backend
  const handleStatus = async (booking, statusBaru) => {
    setUpdatingId(booking.id);
    setPesan(null);
    try {
      const baru = await updateBookingStatus(booking, statusBaru);
      setData((d) => d.map((b) => (b.id === baru.id ? baru : b)));
      setPesan({ tipe: "sukses", teks: `Status ${booking.kode} diubah menjadi ${statusBaru}.` });
    } catch (err) {
      setPesan({ tipe: "error", teks: pesanError(err) });
    } finally {
      setUpdatingId(null);
    }
  };

  // Langkah 7.2: hapus booking
  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteBooking(deletingItem.id);
      setData((d) => d.filter((b) => b.id !== deletingItem.id));
      setPesan({ tipe: "sukses", teks: `Booking ${deletingItem.kode} berhasil dihapus.` });
    } catch (err) {
      setPesan({ tipe: "error", teks: pesanError(err) });
    } finally {
      setDeleting(false);
      setDeletingItem(null);
    }
  };

  const tombolFilter = (aktif) =>
    `rounded-lg border px-3 py-1 text-sm ${
      aktif ? "border-primary bg-primary text-white" : "border-gray-300 hover:bg-soft"
    }`;

  return (
    <>
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">Booking</h1>
        <Link
          to="/booking/baru"
          className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
        >
          <Plus size={16} /> Booking Baru
        </Link>
      </header>

      <main className="space-y-6 p-6">
        {pesan && (
          <div
            className={`flex items-start justify-between gap-3 rounded-lg px-4 py-2 text-sm ${
              pesan.tipe === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            <span>{pesan.teks}</span>
            <button onClick={() => setPesan(null)} className="font-bold">×</button>
          </div>
        )}

        {loading && <p className="text-sm text-gray-500">Memuat data booking...</p>}

        {!loading && !gagalMuat && (
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari kode, nama, atau no. HP..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="rounded-lg border border-gray-300 py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              {["Semua", ...STATUS_OPSI.map((s) => s.label)].map((s) => (
                <button key={s} onClick={() => setFilter(s)} className={tombolFilter(filter === s)}>
                  {s}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-soft text-primary">
                  <tr>
                    {["No Registrasi", "Pelanggan", "Layanan AC", "Jadwal", "Total", "Status", "Aksi"].map((h) => (
                      <th key={h} className="px-3 py-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((b) => (
                    <tr key={b.id} className="border-b border-gray-100 align-top last:border-0">
                      <td className="px-3 py-2 font-mono text-xs">{b.kode}</td>
                      <td className="px-3 py-2">
                        <p className="font-medium">{b.pelanggan}</p>
                        <p className="text-xs text-gray-500">{b.telepon}</p>
                      </td>
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
                      </td>
                      <td className="px-3 py-2">{b.jadwal}</td>
                      <td className="px-3 py-2">Rp {b.total.toLocaleString("id-ID")}</td>
                      <td className="px-3 py-2">
                        <select
                          value={b.status}
                          disabled={updatingId === b.id}
                          onChange={(e) => handleStatus(b, e.target.value)}
                          className={`rounded-full border-0 px-2 py-1 text-xs font-medium disabled:opacity-60 ${
                            badgeColor[b.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {STATUS_OPSI.map((s) => (
                            <option key={s.value} value={s.label}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => {
                            setPesan(null);
                            setDeletingItem(b);
                          }}
                          title="Hapus"
                          className="rounded p-1.5 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-500">Booking tidak ditemukan</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Menampilkan {rows.length} dari {data.length} booking
            </p>
          </div>
        )}
      </main>

      {deletingItem && (
        <ConfirmDeleteBooking
          item={deletingItem}
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingItem(null)}
        />
      )}
    </>
  );
}