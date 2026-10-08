// src/components/booking/ConfirmDeleteBooking.jsx
// konfirmasi hapus booking
import { AlertTriangle } from "lucide-react";

export default function ConfirmDeleteBooking({ item, loading = false, onConfirm, onClose }) {
  return (
    // area gelap tidak menutup dialog, hanya tombol Batal
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="text-red-600" size={24} />
        </div>

        <h2 className="text-lg font-semibold">Hapus Booking?</h2>

        <p className="mt-2 text-sm text-gray-500">
          Booking <span className="font-mono font-semibold text-gray-800">{item.kode}</span> atas nama{" "}
          <span className="font-semibold text-gray-800">{item.pelanggan}</span> ({item.items.length} unit AC) akan
          dihapus permanen. Untuk membatalkan tanpa menghapus, ubah statusnya menjadi Dibatalkan.
        </p>

        <div className="mt-5 flex justify-center gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-60"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}