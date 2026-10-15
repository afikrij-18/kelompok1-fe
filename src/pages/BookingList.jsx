// src/pages/BookingList.jsx
// Langkah 7: daftar booking dengan cari, filter status, ubah status, hapus, dan pagination
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Trash2, Eye, Pencil } from "lucide-react";
import {
  getBookings,
  updateBookingStatus,
  updateBookingTechnician,
  deleteBooking,
} from "../services/bookingService";
import { getTechnicians } from "../services/technicianService";
import { STATUS_OPSI, statusKeApi } from "../services/bookingMapper";
import ConfirmDeleteBooking from "../components/booking/ConfirmDeleteBooking";
import Pagination from "../components/Pagination";

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
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalItems: 0, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [gagalMuat, setGagalMuat] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null); // booking yang statusnya sedang disimpan
  const [updatingTeknisiId, setUpdatingTeknisiId] = useState(null); // booking yang teknisinya sedang disimpan
  const [teknisiList, setTeknisiList] = useState([]);
  const [deletingItem, setDeletingItem] = useState(null);
  const [confirmTeknisi, setConfirmTeknisi] = useState(null);
  const [confirmStatus, setConfirmStatus] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pesan, setPesan] = useState(null); // { tipe: "sukses" | "error", teks }

  // Debounce keyword biar tidak request tiap ketik
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword), 400);
    return () => clearTimeout(t);
  }, [keyword]);

  // Reset ke halaman 1 saat pencarian / filter berubah
  useEffect(() => {
    setPage((p) => (p === 1 ? p : 1));
  }, [debouncedKeyword, filter]);

  useEffect(() => {
    setLoading(true);
    const statusApi = filter === "Semua" ? "" : statusKeApi(filter) || filter;
    getBookings(page, 10, { search: debouncedKeyword, status: statusApi })
      .then((res) => {
        setData(res.data);
        setMeta(res.meta);
        setGagalMuat(false);
      })
      .catch((err) => {
        setGagalMuat(true);
        setPesan({ tipe: "error", teks: pesanError(err) });
      })
      .finally(() => setLoading(false));
  }, [page, debouncedKeyword, filter]);

  useEffect(() => {
    getTechnicians()
      .then((res) => {
        setTeknisiList(res.filter((t) => t.status === "Aktif"));
      })
      .catch(() => {});
  }, []);

  // ubah status lewat PUT, baris diganti dengan hasil dari backend
  const handleStatus = async (booking, statusBaru) => {
    setUpdatingId(booking.id);
    setPesan(null);
    try {
      const baru = await updateBookingStatus(booking, statusBaru);
      setData((d) => d.map((b) => (b.id === baru.id ? baru : b)));
      setPesan({
        tipe: "sukses",
        teks: `Status ${booking.kode} diubah menjadi ${statusBaru}.`,
      });
    } catch (err) {
      setPesan({ tipe: "error", teks: pesanError(err) });
    } finally {
      setUpdatingId(null);
      setConfirmStatus(null);
    }
  };

  // ubah penugasan teknisi dari list booking
  const handleTeknisi = async (booking, teknisiId) => {
    setUpdatingTeknisiId(booking.id);
    setPesan(null);
    try {
      const baru = await updateBookingTechnician(booking, teknisiId);
      setData((d) => d.map((b) => (b.id === baru.id ? baru : b)));
      const namaTeknisi =
        teknisiList.find((t) => String(t.id) === String(teknisiId))?.nama ||
        "Belum ditugaskan";
      setPesan({
        tipe: "sukses",
        teks: `Penugasan teknisi untuk ${booking.kode} diperbarui (${namaTeknisi}).`,
      });
    } catch (err) {
      setPesan({ tipe: "error", teks: pesanError(err) });
    } finally {
      setUpdatingTeknisiId(null);
      setConfirmTeknisi(null);
    }
  };

  // Langkah 7.2: hapus booking
  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteBooking(deletingItem.id);
      setData((d) => d.filter((b) => b.id !== deletingItem.id));
      setPesan({
        tipe: "sukses",
        teks: `Booking ${deletingItem.kode} berhasil dihapus.`,
      });
    } catch (err) {
      setPesan({ tipe: "error", teks: pesanError(err) });
    } finally {
      setDeleting(false);
      setDeletingItem(null);
    }
  };

  const tombolFilter = (aktif) =>
    `rounded-lg border px-3 py-1 text-sm ${
      aktif
        ? "border-primary bg-primary text-white"
        : "border-gray-300 hover:bg-soft"
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
              pesan.tipe === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <span>{pesan.teks}</span>
            <button onClick={() => setPesan(null)} className="font-bold">
              ×
            </button>
          </div>
        )}

        {loading && (
          <p className="text-sm text-gray-500">Memuat data booking...</p>
        )}

        {!loading && !gagalMuat && (
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Cari kode, nama, atau no. HP..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="rounded-lg border border-gray-300 py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              {["Semua", ...STATUS_OPSI.map((s) => s.label)].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={tombolFilter(filter === s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-soft text-primary uppercase text-xs">
                  <tr>
                    {["No", "Registrasi", "Pelanggan", "Layanan", "Jadwal", "Teknisi", "Total", "Pembayaran", "Status", "Aksi"].map((h) => (
                      <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((b, i) => (
                    <tr key={b.id} className="hover:bg-soft/20 align-top transition">
                      <td className="px-4 py-3 text-xs text-gray-500">{(meta.currentPage - 1) * 10 + i + 1}</td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold">{b.kode}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{b.pelanggan}</p>
                        <p className="text-xs text-gray-500">{b.telepon}</p>
                      </td>
                      <td className="px-4 py-3">
                        <ul className="space-y-1">
                          {b.items.map((it) => (
                            <li key={it.id} className="text-xs">
                              <span className="font-medium text-gray-900">{it.layanan}</span>
                              <div className="mt-0.5">
                                {it.warrantyExpiry ? (
                                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                                    🛡️ s/d {new Date(it.warrantyExpiry).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                  </span>
                                ) : it.garansi > 0 ? (
                                  <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                                    🛡️ Garansi {it.garansi} Hari (belum aktif)
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-gray-400">
                                    Tanpa garansi
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{b.jadwal}</td>
                      <td className="px-4 py-3">
                        <select
                          value={b.teknisiId || ""}
                          disabled={updatingTeknisiId === b.id}
                          onChange={(e) => {
                            const teknisiBaruNama = teknisiList.find((t) => String(t.id) === String(e.target.value))?.nama || "Belum ditugaskan";
                            setConfirmTeknisi({
                              booking: b,
                              teknisiLama: b.teknisi || "Belum ditugaskan",
                              teknisiBaruId: e.target.value,
                              teknisiBaruNama: teknisiBaruNama
                            });
                          }}
                          className="w-32 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-slate-800 focus:border-secondary focus:outline-none disabled:opacity-60"
                        >
                          <option value="">-- Pilih --</option>
                          {teknisiList.map((t) => (
                            <option key={t.id} value={t.id}>{t.nama}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        Rp {b.total.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase ${b.paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {b.paid ? "Lunas" : "Belum"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={b.status}
                          disabled={updatingId === b.id}
                          onChange={(e) => {
                            setConfirmStatus({
                              booking: b,
                              statusBaru: e.target.value
                            });
                          }}
                          className={`rounded-full border-0 px-3 py-1 text-xs font-medium uppercase ${badgeColor[b.status] || "bg-gray-100 text-gray-700"}`}
                        >
                          {STATUS_OPSI.map((s) => (
                            <option key={s.value} value={s.label}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link to={`/booking/${b.id}`} className="p-2 text-primary hover:bg-blue-50 rounded" title="Detail"><Eye size={16} /></Link>
                          <Link to={`/booking/edit/${b.id}`} className="p-2 text-amber-600 hover:bg-amber-50 rounded" title="Edit"><Pencil size={16} /></Link>
                          <button onClick={() => {setPesan(null); setDeletingItem(b);}} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Hapus"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-10 text-center text-gray-500 italic">Booking tidak ditemukan</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Langkah 7.4: kontrol halaman, menggantikan teks "Menampilkan x dari y booking" */}
            <Pagination
              page={meta.currentPage}
              totalPages={meta.totalPages}
              total={meta.totalItems}
              perPage={10}
              onChange={(newPage) => setPage(newPage)}
            />
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

      {confirmTeknisi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Konfirmasi Perubahan Teknisi</h3>
            <p className="mt-1 text-sm text-slate-600">Apakah Anda yakin ingin mengubah teknisi untuk booking ini?</p>
            <div className="mt-4 space-y-2 rounded-lg bg-soft/40 p-4 text-sm">
              <p><span className="font-semibold text-slate-700">No. Registrasi:</span> {confirmTeknisi.booking.kode}</p>
              <p><span className="font-semibold text-slate-700">Pelanggan:</span> {confirmTeknisi.booking.pelanggan}</p>
              <p><span className="font-semibold text-slate-700">Teknisi Lama:</span> <span className="rounded bg-red-50 px-2 py-0.5 text-red-700">{confirmTeknisi.teknisiLama}</span></p>
              <p><span className="font-semibold text-slate-700">Teknisi Baru:</span> <span className="rounded bg-green-50 px-2 py-0.5 text-green-700">{confirmTeknisi.teknisiBaruNama}</span></p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmTeknisi(null)}
                disabled={updatingTeknisiId === confirmTeknisi.booking.id}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleTeknisi(confirmTeknisi.booking, confirmTeknisi.teknisiBaruId)}
                disabled={updatingTeknisiId === confirmTeknisi.booking.id}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {updatingTeknisiId === confirmTeknisi.booking.id ? "Menyimpan..." : "Ya, Ubah Teknisi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Konfirmasi Perubahan Status</h3>
            <p className="mt-1 text-sm text-slate-600">Apakah Anda yakin ingin mengubah status booking ini?</p>
            <div className="mt-4 space-y-2 rounded-lg bg-soft/40 p-4 text-sm">
              <p><span className="font-semibold text-slate-700">No. Registrasi:</span> {confirmStatus.booking.kode}</p>
              <p><span className="font-semibold text-slate-700">Pelanggan:</span> {confirmStatus.booking.pelanggan}</p>
              <p><span className="font-semibold text-slate-700">Status Lama:</span> <span className={`rounded px-2 py-0.5 text-xs font-bold ${badgeColor[confirmStatus.booking.status] || "bg-gray-100 text-gray-700"}`}>{confirmStatus.booking.status}</span></p>
              <p><span className="font-semibold text-slate-700">Status Baru:</span> <span className={`rounded px-2 py-0.5 text-xs font-bold ${badgeColor[confirmStatus.statusBaru] || "bg-gray-100 text-gray-700"}`}>{confirmStatus.statusBaru}</span></p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmStatus(null)}
                disabled={updatingId === confirmStatus.booking.id}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleStatus(confirmStatus.booking, confirmStatus.statusBaru)}
                disabled={updatingId === confirmStatus.booking.id}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {updatingId === confirmStatus.booking.id ? "Menyimpan..." : "Ya, Ubah Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}