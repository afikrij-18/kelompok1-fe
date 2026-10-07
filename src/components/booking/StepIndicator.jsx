// src/components/booking/StepIndicator.jsx
import { User, Snowflake, CalendarDays, ClipboardCheck, CheckCircle2, Check } from "lucide-react";

const LANGKAH = [
  { no: 1, label: "Data Diri", icon: User },
  { no: 2, label: "Unit AC", icon: Snowflake },
  { no: 3, label: "Jadwal", icon: CalendarDays },
  { no: 4, label: "Review", icon: ClipboardCheck },
  { no: 5, label: "Sukses", icon: CheckCircle2 },
];

// Langkah 2.1: maxStep = langkah tertinggi yang pernah dicapai (maks 4)
export default function StepIndicator({ step, maxStep, onJump }) {
  // Langkah 2.2: garis progres mengikuti langkah tertinggi, bukan langkah yang sedang dibuka
  const lebar = ((Math.max(step, maxStep) - 1) / 4) * 100;

  return (
    <>
      <p className="text-xs font-semibold text-primary sm:hidden">
        Langkah {step} dari 5: {LANGKAH[step - 1].label}
      </p>

      <div className="hidden rounded-xl border border-soft bg-white p-4 shadow-sm sm:block">
        <div className="relative grid grid-cols-5 items-center">
          <div className="absolute left-[10%] right-[10%] top-[18px] h-1 bg-soft">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${lebar}%` }} />
          </div>

          {LANGKAH.map(({ no, label, icon: Icon }) => {
            const aktif = no === step;
            // Langkah 2.3: selesai = sudah pernah dicapai dan bukan langkah yang sedang dibuka
            const selesai = !aktif && no <= maxStep;
            // Langkah 2.4: bisa diklik jika sudah pernah dicapai, kecuali setelah booking tersimpan
            const bisaKlik = selesai && step < 5;

            return (
              <button
                key={no}
                type="button"
                disabled={!bisaKlik}
                onClick={() => onJump(no)}
                className={`relative z-10 flex flex-col items-center text-center ${
                  bisaKlik ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    selesai
                      ? "bg-secondary text-white"
                      : aktif
                        ? "bg-primary text-white ring-4 ring-soft"
                        : "bg-soft text-slate-500"
                  }`}
                >
                  {selesai ? <Check size={18} /> : <Icon size={18} />}
                </span>
                <span className={`mt-2 text-xs font-bold ${aktif ? "text-primary" : "text-slate-500"}`}>
                  0{no} {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}