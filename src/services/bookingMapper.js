// src/services/bookingMapper.js
// Langkah 1: terjemahan nama field backend <-> frontend (sesuai bookingController.js terbaru)
import { formatJadwal } from "../utils/booking";

// Langkah 1.1: nilai di database <-> teks tampilan
export const STATUS_OPSI = [
  { value: "pending", label: "Menunggu" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];
const STATUS = Object.fromEntries(STATUS_OPSI.map((s) => [s.value, s.label]));
const STATUS_KE_API = Object.fromEntries(STATUS_OPSI.map((s) => [s.label, s.value]));

export const statusKeApi = (label) => STATUS_KE_API[label];

// Langkah 1.2: backend -> tampilan
// alamat servis ada di b.address (tabel customer_addresses), bukan di customer
export const fromApi = (b) => {
  const jam = (b.booking_time || "").slice(0, 5); // "14:30:00" -> "14:30"
  return {
    id: b.id,
    kode: b.reg_no,
    pelanggan: b.customer?.name || "",
    telepon: b.customer?.phone || "",
    alamatId: b.address_id,
    alamat: b.address?.address || "",
    labelAlamat: b.address?.label || "",
    catatanLokasi: b.address?.notes_location || "",
    catatan: b.notes || "", // catatan booking, harus dikirim ulang saat PUT agar tidak terhapus
    tanggal: b.booking_date,
    jam,
    jadwal: formatJadwal(b.booking_date, jam),
    status: STATUS[b.status] || b.status,
    total: b.total_price,
    items: (b.units || []).map((u) => ({
      id: u.id,
      unit: u.lokasi,
      merek: u.brand_ac,
      kapasitas: `${u.pk} PK`,
      tipe: u.type_ac,
      layananId: u.service_id,
      layanan: u.service?.name || "",
      harga: u.price,
      catatan: u.keluhan || "",
    })),
  };
};

// Langkah 1.3: tampilan -> backend
// - ada alamatId: kirim address_id (alamat tersimpan)
// - tidak ada: kirim alamat baru lengkap dengan label dan catatan lokasi
// harga tidak dikirim, backend menghitungnya dari tabel services
export const toApi = (p) => ({
  customer: {
    name: p.pelanggan,
    phone: p.telepon,
    ...(p.alamatId
      ? { address_id: p.alamatId }
      : {
          address: p.alamat,
          address_label: p.labelAlamat || undefined,
          notes_location: p.catatanLokasi || undefined,
        }),
  },
  booking_date: p.tanggal,
  booking_time: `${p.jam}:00`,
  notes: p.catatan || null,
  units: p.items.map((it) => ({
    service_id: it.layananId,
    brand_ac: it.merek,
    type_ac: it.tipe,
    pk: it.kapasitas.replace(/\s*PK$/i, ""), // "1.5 PK" -> "1.5"
    lokasi: it.unit,
    keluhan: it.catatan || null,
  })),
});