// Card kecil untuk menampilkan keunggulan/kepercayaan layanan
export default function TrustCard({
  icon: Icon, // Icon dari lucide-react
  title, // Judul card
  description, // Deskripsi singkat
  secondary = false, // Menentukan warna icon
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#c4e2f5] bg-white p-3 shadow-sm">
      {/* Container icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f5ff] ${
          secondary ? "text-[#1591dc]" : "text-[#2c5ead]"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Informasi card */}
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-[#024594]">{title}</p>

        <p className="truncate text-[10px] text-[#434751]">{description}</p>
      </div>
    </div>
  );
}
