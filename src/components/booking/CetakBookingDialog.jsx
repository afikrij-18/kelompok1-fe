// src/components/booking/CetakBookingDialog.jsx
// Langkah 4: dialog pilihan keperluan cetak detail booking
import { useState } from "react";
import { X, Printer } from "lucide-react";
import { JENIS_CETAK } from "../../utils/cetakBooking";

// onCetak = (jenis) => void, jenis = "pelanggan" | "teknisi" | "lengkap"
export default function CetakBookingDialog({ booking, onCetak, onClose }) {
  const [jenis, setJenis] = useState("pelanggan");

  const handleCetak = () => {
    onCetak(jenis);
    onClose();
  };

  return (
    // area gelap tidak menutup dialog, hanya tombol Batal atau X
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">
            Cetak Detail Booking
          </h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          Booking{" "}
          <span className="font-mono font-semibold text-gray-800">
            {booking.kode}
          </span>{" "}
          atas nama{" "}
          <span className="font-semibold text-gray-800">
            {booking.pelanggan}
          </span>
          . Pilih keperluan cetak.
        </p>

        <ul className="space-y-2">
          {JENIS_CETAK.map((j) => (
            <li key={j.id}>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${
                  jenis === j.id
                    ? "border-primary bg-primary/5"
                    : "border-soft hover:bg-soft/30"
                }`}
              >
                <input
                  type="radio"
                  name="jenisCetak"
                  checked={jenis === j.id}
                  onChange={() => setJenis(j.id)}
                  className="mt-1"
                />
                <span>
                  <span className="block font-semibold text-slate-900">
                    {j.label}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {j.keterangan}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>

        <p className="mt-3 text-xs text-gray-400">
          Di jendela cetak, pilih printer atau "Simpan sebagai PDF".
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleCetak}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary"
          >
            <Printer size={16} />
            Cetak
          </button>
        </div>
      </div>
    </div>
  );
}