// src/utils/booking.js
// fungsi bantu yang dipakai banyak komponen booking

export const formatRupiah = (n) => `Rp ${Number(n).toLocaleString("id-ID")}`;

// 90 -> "1 jam 30 menit"
export const formatDurasi = (menit) => {
  const jam = Math.floor(menit / 60);
  const sisa = menit % 60;
  if (jam === 0) return `${sisa} menit`;
  if (sisa === 0) return `${jam} jam`;
  return `${jam} jam ${sisa} menit`;
};

// Langkah 4.1: tanggal lokal format YYYY-MM-DD
// (toISOString memakai UTC, bisa mundur sehari di pagi hari WIB)
const dua = (n) => String(n).padStart(2, "0");
export const toISO = (d) => `${d.getFullYear()}-${dua(d.getMonth() + 1)}-${dua(d.getDate())}`;
export const hariIni = () => toISO(new Date());

// "2026-10-19" + "10:00" -> "19 Okt 2026, 10:00" (sama dengan format tabel dashboard)
export const formatJadwal = (tanggal, jam) => {
  const t = new Date(`${tanggal}T00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${t}, ${jam}`;
};

// "2026-10-19" -> "Senin, 19 Oktober 2026"
export const formatTanggalPanjang = (tanggal) =>
  new Date(`${tanggal}T00:00`).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// Langkah 4.2: jam yang sudah lewat (atau kurang dari 1 jam lagi) pada hari ini
export const slotTerlewat = (tanggal, jam) => {
  if (!tanggal || !jam || tanggal !== hariIni()) return false;
  const [h, m] = jam.split(":").map(Number);
  const sekarang = new Date();
  return h * 60 + m < sekarang.getHours() * 60 + sekarang.getMinutes() + 60;
};

// Langkah 4.3: items = [{ layanan: objek layanan atau undefined }]
export const hitungTotal = (items) => items.reduce((j, it) => j + (it.layanan ? it.layanan.harga : 0), 0);
export const hitungDurasi = (items) => items.reduce((j, it) => j + (it.layanan ? it.layanan.durasi : 0), 0);

// Langkah 4.4: nama merek yang dipakai di review dan data booking,
// kalau memilih "Lainnya" yang dipakai adalah tulisan pengguna
export const namaMerek = (u) => (u.merek === "Lainnya" ? u.merekLain.trim() : u.merek);

// Langkah 4.5: kelas input bersama, border merah jika error
export const inputClass = (error) =>
  `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-accent/40 ${
    error ? "border-red-500" : "border-soft"
  }`;