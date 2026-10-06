import { AlertTriangle } from "lucide-react";

export default function ConfirmDeleteLayanan({ item, onConfirm, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="text-red-600" size={24} />
        </div>

        <h2 className="text-lg font-semibold">Hapus Layanan?</h2>

        <p className="mt-2 text-sm text-gray-500">
          Layanan <span className="font-semibold text-gray-800">{item.nama}</span> ({item.kategori}, Rp{" "}
          {item.harga.toLocaleString("id-ID")}) akan dihapus dari katalog.
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Layanan ini belum dipakai di booking mana pun.
        </p>

        <div className="mt-5 flex justify-center gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}