// src/components/booking/StepUnits.jsx
// Langkah 8: langkah 2, daftar unit AC
import { Timer, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import UnitCard from "./UnitCard";
import BookingSummary from "./BookingSummary";
import { MAKS_UNIT } from "../../data/bookingOptions";
import { formatDurasi, hitungDurasi } from "../../utils/booking";

// Langkah 8.1: units = state unit, ringkasan = unit + layanan terpilih, errors = error per uid
export default function StepUnits({ units, ringkasan, layananList, errors = {}, onChangeUnit, onAdd, onRemove, onBack, onNext, labelNext }) {
  const durasi = hitungDurasi(ringkasan);

  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-8">
        <div className="rounded-xl border border-soft bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft font-bold text-primary">2</span>
            <div>
              <h2 className="text-lg font-bold uppercase text-slate-900">Layanan & Detail Unit AC</h2>
              <p className="text-sm text-slate-600">
                Tambahkan satu atau beberapa unit AC di lokasi yang sama. Setiap unit bisa memilih layanan berbeda.
              </p>
            </div>
          </div>

          {/* Langkah 8.2: estimasi durasi dihitung dari layanan yang sudah dipilih */}
          {durasi > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-soft bg-soft/30 px-3 py-1.5 text-xs font-bold text-primary">
              <Timer size={16} />
              Estimasi Durasi: {ringkasan.length} Unit AC = ± {formatDurasi(durasi)}
            </div>
          )}
        </div>

        {units.map((u, i) => (
          <UnitCard
            key={u.uid}
            index={i}
            data={u}
            error={errors[u.uid]}
            canRemove={units.length > 1}
            layananList={layananList}
            onChange={(field, value) => onChangeUnit(u.uid, field, value)}
            onRemove={() => onRemove(u.uid)}
          />
        ))}

        {/* Langkah 8.3: tombol tambah, nonaktif jika sudah mencapai batas */}
        <button
          type="button"
          onClick={onAdd}
          disabled={units.length >= MAKS_UNIT}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-secondary/50 bg-soft/20 py-4 text-sm font-bold text-secondary hover:border-secondary hover:bg-soft/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          Tambah Unit AC (Maks. {MAKS_UNIT} Unit per Lokasi)
        </button>

        <div className="flex items-center justify-between border-t border-soft pt-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-soft"
          >
            <ArrowLeft size={18} />
            Kembali ke Data Diri
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary"
          >
            {labelNext || "Lanjutkan ke Jadwal"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Langkah 8.4: ringkasan menempel saat area kanan di-scroll */}
      <div className="lg:sticky lg:top-6 lg:col-span-4">
        <BookingSummary items={ringkasan} />
      </div>
    </div>
  );
}