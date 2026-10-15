// src/services/bookingMapper.js
// Langkah 1: terjemahan nama field backend <-> frontend (sesuai bookingController.js)
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
// b.transactions diisi bookingService (digabung dari GET /transactions)
export const fromApi = (b) => {
  const jam = (b.booking_time || "").slice(0, 5); // "14:30:00" -> "14:30"
  const transaksiMentah = b.transactions || [];

  // hanya pembayaran berstatus paid yang dihitung
  const totalDibayar = transaksiMentah
    .filter((t) => t.payment_status === "paid")
    .reduce((j, t) => j + (Number(t.amount_paid) || 0), 0);
  const total = Number(b.total_price || 0);

  // Gunakan pembulatan kecil untuk menghindari masalah presisi floating point
  const isLunas = Math.round(totalDibayar) >= Math.round(total);

  return {
    id: b.id,
    kode: b.reg_no,
    pelanggan: b.customer_name_snapshot || b.customer?.name || "",
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
    totalDibayar,
    // lunas kalau pembayaran menutupi total tagihan
    paid: total > 0 && isLunas,
    teknisiId: b.technician_id || b.technician?.id || "",
    teknisi: b.technician?.name || "",
    teleponTeknisi: b.technician?.phone || "",
    transaksi: transaksiMentah.map((t) => ({
      id: t.id,
      invoice: t.invoice_no,
      metode: t.payment_method,
      bankId: t.bank_id ?? t.bank_ref?.id ?? null,
      bank: t.bank_ref?.nama || "",
      jumlah: t.amount_paid,
      status: t.payment_status,
      tanggal: t.payment_date,
      catatan: t.notes || "",
    })),
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
      garansi: Number(u.service?.warranty_days) || 0,
      warrantyExpiry: u.warranty_expiry_date || null,
    })),
  };
};

// Langkah 1.3: tampilan -> backend
// - ada alamatId: kirim address_id (alamat tersimpan)
// - tidak ada: kirim alamat baru lengkap dengan label dan catatan lokasi
// harga tidak dikirim, backend menghitungnya dari tabel services
// technician_id diabaikan backend sampai kolomnya ada, tetapi ikut dikirim dan dikirim ulang apa adanya
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
  technician_id: p.teknisiId ? Number(p.teknisiId) : null,
  units: p.items.map((it) => ({
    service_id: it.layananId,
    brand_ac: it.merek,
    type_ac: it.tipe,
    pk: it.kapasitas.replace(/\s*PK$/i, ""), // "1.5 PK" -> "1.5"
    lokasi: it.unit,
    keluhan: it.catatan || null,
  })),
});