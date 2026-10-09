// src/utils/pelanggan.js
// Langkah 3: pencarian dan pengecekan pelanggan berdasarkan nomor HP
// (daftar pelanggan dari getCustomers di bookingService.js)

// huruf besar-kecil dan spasi ganda diabaikan saat membandingkan teks
const rapi = (s) => s.trim().replace(/\s+/g, " ").toLowerCase();

// nomor HP yang sudah bersih (tanpa spasi dan strip), 10-15 digit
export const nomorValid = (telepon) => /^\d{10,15}$/.test(telepon);

// pelanggan dengan nomor yang sama persis, atau undefined
export const cariPelanggan = (telepon, daftar) =>
  nomorValid(telepon) ? daftar.find((p) => p.telepon === telepon) : undefined;

// Langkah 3.1: daftar peringatan untuk langkah data pelanggan (tidak memblokir)
export const cekPelanggan = (customer, telepon, daftar) => {
  const pesan = [];
  const nama = rapi(customer.nama);
  const dikenal = cariPelanggan(telepon, daftar);

  // nomor terdaftar tetapi nama yang diisi berbeda: backend memperbarui nama pelanggan
  if (dikenal && nama && rapi(dikenal.nama) !== nama) {
    pesan.push(
      `Nomor ${telepon} terdaftar atas nama "${dikenal.nama}". Jika dilanjutkan, nama pelanggan akan diganti menjadi "${customer.nama.trim()}".`
    );
  }

  // nama sama tetapi nomor HP berbeda
  if (nama) {
    const kembar = daftar.find((p) => rapi(p.nama) === nama && p.telepon !== telepon);
    if (kembar) {
      pesan.push(
        `Sudah ada pelanggan bernama "${kembar.nama}" dengan nomor ${kembar.telepon}. Pastikan ini orang yang berbeda.`
      );
    }
  }

  return pesan;
};