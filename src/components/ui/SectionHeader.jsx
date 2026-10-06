// Component header yang digunakan ulang untuk setiap section halaman
export default function SectionHeader({
  eyebrow, // Label kecil di atas judul
  title, // Judul utama section
  description, // Deskripsi singkat section
}) {
  return (
    <div className="mx-auto mb-14 max-w-2xl text-center">
      {/* Tampilkan eyebrow jika diberikan */}
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-widest text-[#1591dc]">
          {eyebrow}
        </span>
      )}

      {/* Judul section */}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#024594] sm:text-3xl lg:text-4xl">
        {title}
      </h2>

      {/* Deskripsi section */}
      <p className="mt-2 text-xs text-[#434751] sm:text-sm">{description}</p>
    </div>
  );
}
