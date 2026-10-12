// src/components/booking/StepUnits.jsx
// Daftar unit AC - dipakai di dalam card "Unit AC & Layanan" di Booking.jsx
import { ArrowLeft, ArrowRight } from "lucide-react";
import UnitCard from "./UnitCard";

export default function StepUnits({ units, ringkasan, layananList, errors = {}, onChangeUnit, onRemove, canRemove, onBack, onNext, labelNext, hideNavigation = false, unitIndex = 0 }) {
  return (
    <div className="space-y-4">
        {units.map((u, i) => (
          <UnitCard
            key={u.uid}
            index={unitIndex + i}
            data={u}
            error={errors[u.uid] || {}}
            canRemove={canRemove ?? (units.length > 1)}
            layananList={layananList}
            onChange={(field, value) => onChangeUnit(u.uid, field, value)}
            onRemove={() => onRemove(u.uid)}
          />
        ))}

        {!hideNavigation && (
          <div className="flex items-center justify-between border-t border-soft pt-4">
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
        )}
    </div>
  );
}
