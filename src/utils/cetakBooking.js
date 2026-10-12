// src/utils/cetakBooking.js
// Langkah 3: isi dokumen cetak invoice dan detail booking (dicetak lewat cetakDokumen di cetak.js)
// booking   = bentuk dari bookingMapper (kode, pelanggan, telepon, alamat, catatanLokasi, catatan,
//             tanggal, jam, status, total, items [{ unit, merek, tipe, kapasitas, layanan, harga, catatan }])
// transaksi = bentuk dari transactionMapper (id, invoice, metode, dibayar, status, waktuBayar, catatan)
import { kopDokumen, bagianHtml, ringkasanHtml, tabelHtml, rp, esc } from "./cetak";
import { hitungPembayaran } from "./pembayaran";
import { formatTanggalPanjang } from "./booking";

const STATUS_BAYAR = { paid: "Lunas", pending: "Menunggu", failed: "Gagal" };

// Langkah 3.1: cap status di invoice, warna mengikuti keadaan
const stempel = (teks, warna) =>
  `<div style="display:inline-block;border:2px solid ${warna};color:${warna};font-weight:800;padding:4px 14px;border-radius:6px;letter-spacing:.08em;font-size:13px;margin:6px 0">${esc(teks)}</div>`;

// Langkah 3.2: daftar "label : isi" tanpa garis tabel
const info = (pasangan) =>
  `<table style="width:100%;border-collapse:collapse">${pasangan
    .map(
      ([k, v]) =>
        `<tr><td style="width:26%;border:0;padding:2px 0;color:#64748b">${esc(k)}</td><td style="border:0;padding:2px 0">: ${esc(
          v || "-"
        )}</td></tr>`
    )
    .join("")}</table>`;

const jadwalTeks = (b) => `${formatTanggalPanjang(b.tanggal)}, pukul ${b.jam}`;

// Langkah 3.3: data pelanggan dan lokasi, catatan booking hanya jika diminta
const blokPelanggan = (b, denganCatatan = false) =>
  info([
    ["Nama", b.pelanggan],
    ["No. HP", b.telepon],
    ["Alamat servis", b.labelAlamat ? `${b.alamat} (${b.labelAlamat})` : b.alamat],
    ["Patokan lokasi", b.catatanLokasi],
    ...(denganCatatan ? [["Catatan booking", b.catatan]] : []),
  ]);

// Langkah 3.4: tabel unit AC. mode: "harga" (dengan harga dan total), "tanpa" (tanpa harga), "kerja" (lembar kerja teknisi)
const tabelUnit = (b, mode) => {
  const kolom = [
    { label: "No" },
    { label: "Lokasi Unit" },
    { label: "AC" },
    { label: "Layanan" },
    { label: mode === "kerja" ? "Keluhan" : "Keluhan / Catatan" },
  ];
  if (mode === "harga") kolom.push({ label: "Harga", kanan: true });
  if (mode === "kerja") kolom.push({ label: "Selesai" }, { label: "Catatan Teknisi" });

  const baris = b.items.map((it, i) => {
    const r = [String(i + 1), it.unit, `${it.merek} ${it.tipe} ${it.kapasitas}`, it.layanan, it.catatan || "-"];
    if (mode === "harga") r.push(rp(it.harga));
    if (mode === "kerja") r.push("[   ]", "");
    return r;
  });

  return tabelHtml({ kolom, baris, kaki: mode === "harga" ? ["Total", rp(b.total)] : undefined });
};

// Langkah 3.5: kotak ringkasan pembayaran sebuah booking
const kotakPembayaran = (b, transaksi) => {
  const p = hitungPembayaran(b.total, transaksi);
  return ringkasanHtml([
    { label: "Total Tagihan", nilai: rp(b.total) },
    { label: "Sudah Dibayar", nilai: rp(p.dibayar) },
    p.lebih > 0 ? { label: "Kelebihan Bayar", nilai: rp(p.lebih) } : { label: "Sisa Tagihan", nilai: rp(p.sisa) },
    { label: "Status", nilai: p.status },
  ]);
};

// Langkah 3.6: riwayat pembayaran, daftar yang diberikan sudah disaring oleh pemanggil
const riwayat = (daftar) =>
  daftar.length === 0
    ? `<p class="kosong">Belum ada pembayaran.</p>`
    : tabelHtml({
        kolom: [
          { label: "No Invoice" },
          { label: "Waktu Bayar" },
          { label: "Metode" },
          { label: "Status" },
          { label: "Jumlah", kanan: true },
        ],
        baris: daftar.map((t) => [t.invoice, t.waktuBayar, t.metode, STATUS_BAYAR[t.status] || t.status, rp(t.dibayar)]),
      });

// Langkah 3.7: kotak tanda tangan
const tandaTangan = (peran) =>
  `<div style="display:flex;gap:40px;margin-top:30px">${peran
    .map(
      (p) =>
        `<div style="flex:1;text-align:center"><div style="height:56px;border-bottom:1px solid #1e293b"></div><div style="margin-top:4px;font-size:10px">${esc(
          p
        )}</div></div>`
    )
    .join("")}</div>`;

// ------------------------------------------------------------------ INVOICE
// Langkah 3.8: invoice untuk satu transaksi. semuaTransaksi = semua transaksi booking yang sama,
// dipakai untuk menghitung total terbayar sampai transaksi ini dan sisanya
export function dokumenInvoice({ booking: b, transaksi: t, semuaTransaksi = [] }) {
  // transaksi lunas sampai dengan transaksi ini (berdasarkan urutan id)
  const sampaiIni = semuaTransaksi.filter((x) => x.status === "paid" && x.id <= t.id);
  const terbayar = sampaiIni.reduce((j, x) => j + Number(x.dibayar || 0), 0);
  const sisa = Math.max(0, b.total - terbayar);

  let cap;
  if (t.status === "paid") cap = sisa === 0 ? stempel("LUNAS", "#15803d") : stempel("DIBAYAR SEBAGIAN", "#b45309");
  else if (t.status === "pending") cap = stempel("MENUNGGU PEMBAYARAN", "#b45309");
  else cap = stempel("PEMBAYARAN GAGAL", "#b91c1c");

  let isi = kopDokumen({
    judul: "Invoice",
    keterangan: [`No. Invoice: ${t.invoice}`, `Tanggal: ${t.waktuBayar}`, `Booking: ${b.kode}`],
  });

  isi += cap;
  isi += bagianHtml("Pelanggan", blokPelanggan(b));
  isi += bagianHtml("Rincian Layanan", tabelUnit(b, "harga"));
  isi += bagianHtml(
    "Pembayaran",
    ringkasanHtml([
      { label: "Total Tagihan", nilai: rp(b.total) },
      { label: "Pembayaran Ini", nilai: rp(t.dibayar) },
      { label: "Total Terbayar", nilai: rp(terbayar) },
      { label: "Sisa Tagihan", nilai: rp(sisa) },
    ]) + info([["Metode", t.metode], ["Catatan", t.catatan]])
  );
  isi += `<p class="catatan">Terima kasih telah memilih SejukPro. Simpan invoice ini sebagai bukti pembayaran.</p>`;

  return isi;
}

// ------------------------------------------------------------ DETAIL BOOKING
// Langkah 3.9: pilihan keperluan cetak detail booking
export const JENIS_CETAK = [
  {
    id: "pelanggan",
    label: "Rincian untuk Pelanggan",
    keterangan: "Layanan, harga, dan pembayaran yang sudah lunas",
  },
  {
    id: "teknisi",
    label: "Lembar Kerja Teknisi",
    keterangan: "Alamat, patokan, unit, dan keluhan tanpa harga, dengan kolom centang dan tanda tangan",
  },
  {
    id: "lengkap",
    label: "Detail Lengkap (internal)",
    keterangan: "Semua data booking beserta seluruh riwayat pembayaran",
  },
];

// Langkah 3.10: jenis = "pelanggan" | "teknisi" | "lengkap"
export function dokumenDetailBooking({ booking: b, transaksi = [], jenis }) {
  if (jenis === "teknisi") {
    return (
      kopDokumen({
        judul: "Lembar Kerja Teknisi",
        keterangan: [`Kode booking: ${b.kode}`, `Jadwal: ${jadwalTeks(b)}`],
      }) +
      bagianHtml("Pelanggan dan Lokasi", blokPelanggan(b, true)) +
      bagianHtml("Daftar Unit AC", tabelUnit(b, "kerja")) +
      tandaTangan(["Teknisi", "Pelanggan"])
    );
  }

  if (jenis === "lengkap") {
    return (
      kopDokumen({
        judul: "Detail Booking",
        keterangan: [`Kode booking: ${b.kode}`, `Status: ${b.status}`, `Jadwal: ${jadwalTeks(b)}`],
      }) +
      bagianHtml("Pelanggan dan Lokasi", blokPelanggan(b, true)) +
      bagianHtml("Layanan", tabelUnit(b, "harga")) +
      bagianHtml("Pembayaran", kotakPembayaran(b, transaksi)) +
      bagianHtml("Riwayat Pembayaran", riwayat(transaksi))
    );
  }

  // jenis "pelanggan": hanya pembayaran yang lunas yang diperlihatkan
  const lunas = transaksi.filter((t) => t.status === "paid");
  return (
    kopDokumen({
      judul: "Rincian Booking",
      keterangan: [`Kode booking: ${b.kode}`, `Jadwal: ${jadwalTeks(b)}`],
    }) +
    bagianHtml("Pelanggan", blokPelanggan(b)) +
    bagianHtml("Layanan", tabelUnit(b, "harga")) +
    bagianHtml("Pembayaran", kotakPembayaran(b, transaksi)) +
    bagianHtml("Riwayat Pembayaran", riwayat(lunas)) +
    `<p class="catatan">Terima kasih telah memilih SejukPro.</p>`
  );
}