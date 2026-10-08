// src/services/bookingMapper.js
// Langkah 2: terjemahan nama field backend <-> frontend (sesuai bookingController.js)
import { formatJadwal } from "../utils/booking";

// nilai di database <-> teks tampilan
export const STATUS_OPSI = [
  { value: "pending", label: "Menunggu" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];
const STATUS = Object.fromEntries(STATUS_OPSI.map((s) => [s.value, s.label]));
const STATUS_KE_API = Object.fromEntries(STATUS_OPSI.map((s) => [s.label, s.value]));

export const statusKeApi = (label) => STATUS_KE_API[label];

// backend -> tampilan
export const fromApi = (b) => {
  const jam = (b.booking_time || "").slice(0, 5); // "14:30:00" -> "14:30"
  return {
    id: b.id,
    kode: b.reg_no,
    pelanggan: b.customer?.name || "",
    telepon: b.customer?.phone || "",
    alamat: b.customer?.address || "",
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

// tampilan -> backend, harga tidak dikirim (backend menghitung dari tabel services)
export const toApi = (p) => ({
  customer: { name: p.pelanggan, phone: p.telepon, address: p.alamat },
  booking_date: p.tanggal,
  booking_time: `${p.jam}:00`,
  units: p.items.map((it) => ({
    service_id: it.layananId,
    brand_ac: it.merek,
    type_ac: it.tipe,
    pk: it.kapasitas.replace(/\s*PK$/i, ""), // "1.5 PK" -> "1.5"
    lokasi: it.unit,
    keluhan: it.catatan || null,
  })),
});