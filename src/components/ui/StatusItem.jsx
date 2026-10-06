import { Check, Navigation, Construction } from "lucide-react";

// Item untuk menampilkan satu tahapan status service
export default function StatusItem({
  completed = false, // Status sudah selesai
  current = false, // Status sedang berjalan
  last = false, // Menentukan apakah item terakhir
  title, // Judul status
  description, // Deskripsi status
  extra, // Informasi tambahan seperti estimasi waktu
}) {
  return (
    <div className="flex items-start gap-4">
      {/* Icon status dan garis penghubung */}
      <div className="flex flex-col items-center">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full ${
            current
              ? "bg-[#1591dc] text-white shadow-md ring-4 ring-[#1591dc]/20"
              : completed
                ? "bg-[#2c5ead] text-white shadow-sm"
                : "bg-[#dcf1ff] text-[#434751]"
          }`}
        >
          {completed ? (
            <Check size={15} />
          ) : current ? (
            <Navigation size={14} />
          ) : (
            <Construction size={14} />
          )}
        </div>

        {!last && (
          <div
            className={`h-7 w-0.5 ${
              completed ? "bg-[#2c5ead]" : "bg-[#c4e2f5]"
            }`}
          />
        )}
      </div>

      {/* Informasi status */}
      {current ? (
        <div className="flex-1 rounded-xl border border-[#c4e2f5] bg-[#e8f5ff] p-3">
          <div className="flex items-center justify-between gap-3">
            <h5 className="text-xs font-bold text-[#2c5ead] sm:text-sm">
              {title}
            </h5>

            {extra && (
              <span className="text-right text-[11px] font-bold text-[#1591dc]">
                {extra}
              </span>
            )}
          </div>

          <p className="mt-0.5 text-[11px] text-[#434751]">{description}</p>
        </div>
      ) : (
        <div>
          <h5
            className={`text-xs font-bold sm:text-sm ${
              completed ? "text-[#0a2540]" : "text-[#434751]"
            }`}
          >
            {title}
          </h5>

          <p className="text-[11px] text-[#434751]">{description}</p>
        </div>
      )}
    </div>
  );
}
