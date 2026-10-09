// src/components/booking/StepSchedule.jsx
// Langkah 9: langkah 3, kalender dan jam kedatangan
import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { SLOT_JAM } from "../../data/bookingOptions";
import { hariIni, toISO, slotTerlewat, formatTanggalPanjang, formatDurasi } from "../../utils/booking";

const HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

// Langkah 9.1: kalender bulanan sungguhan, tanggal lewat dan hari Minggu tidak bisa dipilih
function Kalender({ value, onSelect }) {
  const awal = value ? new Date(`${value}T00:00`) : new Date();
  const [bulan, setBulan] = useState({ y: awal.getFullYear(), m: awal.getMonth() });

  const today = hariIni();
  const sekarang = new Date();
  const bulanIni = bulan.y === sekarang.getFullYear() && bulan.m === sekarang.getMonth();

  // Langkah 9.2: kolom pertama = Senin, offset = jumlah sel kosong sebelum tanggal 1
  const offset = (new Date(bulan.y, bulan.m, 1).getDay() + 6) % 7;
  const jumlahHari = new Date(bulan.y, bulan.m + 1, 0).getDate();
  const sel = [...Array(offset).fill(null), ...Array.from({ length: jumlahHari }, (_, i) => i + 1)];

  const geser = (n) => {
    const d = new Date(bulan.y, bulan.m + n, 1);
    setBulan({ y: d.getFullYear(), m: d.getMonth() });
  };

  const judul = new Date(bulan.y, bulan.m, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <div className="rounded-xl border border-soft bg-soft/20 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold capitalize text-slate-900">
          <CalendarDays size={18} className="text-primary" />
          {judul}
        </h3>
        <div className="flex gap-1">
          {/* Langkah 9.3: tidak bisa mundur ke bulan yang sudah lewat */}
          <button
            type="button"
            disabled={bulanIni}
            onClick={() => geser(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-soft bg-white hover:bg-soft disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => geser(1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-soft bg-white hover:bg-soft"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-bold">
        {HARI.map((h) => (
          <span key={h} className={h === "Min" ? "text-red-500" : "text-slate-500"}>
            {h}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {sel.map((hari, i) => {
          if (hari === null) return <div key={`kosong-${i}`} />;

          const d = new Date(bulan.y, bulan.m, hari);
          const iso = toISO(d);
          const lewat = iso < today;
          const libur = d.getDay() === 0;
          const nonaktif = lewat || libur;
          const dipilih = iso === value;

          return (
            <button
              key={iso}
              type="button"
              disabled={nonaktif}
              onClick={() => onSelect(iso)}
              className={`flex h-12 flex-col items-center justify-center rounded-lg border text-sm transition-colors ${
                dipilih
                  ? "border-primary bg-primary font-bold text-white ring-2 ring-primary/40"
                  : nonaktif
                    ? "cursor-not-allowed border-transparent bg-soft/30 text-slate-300"
                    : "border-soft bg-white font-bold text-slate-800 hover:bg-soft"
              }`}
            >
              <span>{hari}</span>
              <span className={`text-[9px] font-normal ${libur && !lewat && !dipilih ? "text-red-500" : ""}`}>
                {dipilih ? "Dipilih" : libur && !lewat ? "Libur" : ""}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 border-t border-soft pt-3 text-[11px] text-slate-600">
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-primary" /> Dipilih</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-white ring-1 ring-slate-300" /> Tersedia</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-soft" /> Minggu libur / lewat</span>
      </div>
    </div>
  );
}

// Langkah 9.4: jumlahUnit dan durasi hanya untuk label di atas
export default function StepSchedule({ jadwal, errors, jumlahUnit, durasi, onTanggal, onJam, onBack, onNext, labelNext, hideNavigation = false }) {
  return (
    <div>
      {/* <div className="flex flex-col justify-between gap-3 border-b border-soft pb-4 sm:flex-row sm:items-center">
        
        <span className="inline-flex items-center gap-1 rounded-full bg-soft/50 px-3 py-1 text-xs font-bold text-secondary">
          <CheckCircle2 size={16} />
          {jumlahUnit} Unit AC • Estimasi ± {durasi > 0 ? formatDurasi(durasi) : "-"}
        </span>
      </div> */}

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-12">
        <div className="md:col-span-7">
          <Kalender value={jadwal.tanggal} onSelect={onTanggal} />
          {errors.tanggal && <p className="mt-2 text-xs text-red-600">{errors.tanggal}</p>}
        </div>

        <div className="md:col-span-5">
          <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-900">
            <Clock size={18} className="text-primary" />
            PILIH JAM KEDATANGAN
          </h3>
          <p className="mb-3 text-xs text-slate-600">Perkiraan awal kehadiran teknisi di lokasi pelanggan.</p>

          <div className="grid grid-cols-2 gap-2">
            {SLOT_JAM.map((jam) => {
              const lewat = slotTerlewat(jadwal.tanggal, jam);
              const dipilih = jadwal.jam === jam;
              return (
                <button
                  key={jam}
                  type="button"
                  disabled={lewat}
                  onClick={() => onJam(jam)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm ${
                    dipilih
                      ? "border-2 border-primary bg-soft font-bold text-primary"
                      : lewat
                        ? "cursor-not-allowed border-soft bg-soft/30 text-slate-300 line-through"
                        : "border-soft bg-white text-slate-800 hover:border-secondary"
                  }`}
                >
                  <span>{jam} WIB</span>
                  {dipilih && <CheckCircle2 size={18} />}
                </button>
              );
            })}
          </div>
          {errors.jam && <p className="mt-2 text-xs text-red-600">{errors.jam}</p>}

          <div className="mt-4 rounded-xl border border-secondary/30 bg-soft/30 p-3">
            <p className="text-[11px] font-bold uppercase text-secondary">Jadwal Dipilih:</p>
            <p className="mt-0.5 text-sm font-bold text-slate-900">
              {jadwal.tanggal && jadwal.jam
                ? `${formatTanggalPanjang(jadwal.tanggal)} • Pukul ${jadwal.jam} WIB`
                : "Belum memilih tanggal dan jam"}
            </p>
          </div>
        </div>
      </div>

      {/* {!hideNavigation && (
        <div className="mt-8 flex items-center justify-between border-t border-soft pt-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-soft"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary"
          >
            {labelNext || "Lanjutkan"}
            <ArrowRight size={18} />
          </button>
        </div>
      )} */}
    </div>
  );
}