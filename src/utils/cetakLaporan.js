// src/utils/cetakLaporan.js
// Langkah 2: isi dokumen cetak Laporan Penjualan dan Laporan Uang Keluar
import { kopDokumen, bagianHtml, ringkasanHtml, tabelHtml, rp } from "./cetak";
import { METODE } from "../services/transactionMapper";
import { formatTanggalPendek, ringkasPengeluaran } from "./pengeluaran";
import { labelMetodeKeluar } from "../data/expenseOptions";

// Langkah 2.1: teks periode laporan penjualan dari rentang { from, to }
export const teksRentangPenjualan = ({ from, to }) =>
  from && to ? `${formatTanggalPendek(from)} - ${formatTanggalPendek(to)}` : "Semua waktu";

// Langkah 2.2: Laporan Penjualan. bagian = id bagian yang dipilih: "ringkasan", "metode", "rincian"
export function dokumenLaporanPenjualan({ laporan, periode, bagian }) {
  const rata =
    laporan.totalTransaksi > 0 ? Math.round(laporan.totalOmzet / laporan.totalTransaksi) : 0;

  let isi = kopDokumen({
    judul: "Laporan Penjualan",
    keterangan: [`Periode: ${periode}`, "Hanya pembayaran berstatus lunas (paid)"],
  });

  if (bagian.includes("ringkasan")) {
    isi += bagianHtml(
      "Ringkasan",
      ringkasanHtml([
        { label: "Total Omzet", nilai: rp(laporan.totalOmzet) },
        { label: "Jumlah Transaksi", nilai: String(laporan.totalTransaksi) },
        { label: "Rata-rata per Transaksi", nilai: rp(rata) },
      ])
    );
  }

  if (bagian.includes("metode")) {
    const baris = Object.entries(laporan.perMetode).map(([kode, nominal]) => [
      METODE[kode] || kode,
      rp(nominal),
      `${laporan.totalOmzet > 0 ? Math.round((nominal / laporan.totalOmzet) * 100) : 0}%`,
    ]);
    isi += bagianHtml(
      "Rekap per Metode Pembayaran",
      tabelHtml({
        kolom: [{ label: "Metode" }, { label: "Nominal", kanan: true }, { label: "Porsi", kanan: true }],
        baris,
      })
    );
  }

  if (bagian.includes("rincian")) {
    const baris = laporan.transaksi.map((t, i) => [
      String(i + 1),
      t.invoice,
      t.kodeBooking,
      t.waktuBayar,
      t.metode,
      rp(t.dibayar),
      t.catatan || "-",
    ]);
    isi += bagianHtml(
      "Rincian Transaksi",
      tabelHtml({
        kolom: [
          { label: "No" },
          { label: "No Invoice" },
          { label: "Booking" },
          { label: "Waktu Bayar" },
          { label: "Metode" },
          { label: "Dibayar", kanan: true },
          { label: "Catatan" },
        ],
        baris,
        kaki: ["Total", rp(laporan.totalOmzet)],
      })
    );
  }

  return isi;
}

// Langkah 2.3: Laporan Uang Keluar. data = pengeluaran pada periode, kategori = "Semua" atau satu kategori
export function dokumenLaporanPengeluaran({ data, periode, bagian, kategori = "Semua" }) {
  const rows = (kategori === "Semua" ? data : data.filter((e) => e.kategori === kategori))
    .slice()
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  const ringkas = ringkasPengeluaran(rows);

  let isi = kopDokumen({
    judul: "Laporan Uang Keluar",
    keterangan: [`Periode: ${periode}`, `Kategori: ${kategori === "Semua" ? "Semua kategori" : kategori}`],
  });

  if (bagian.includes("ringkasan")) {
    isi += bagianHtml(
      "Ringkasan",
      ringkasanHtml([
        { label: "Total Pengeluaran", nilai: rp(ringkas.total) },
        { label: "Jumlah Catatan", nilai: `${ringkas.jumlah} catatan` },
        {
          label: "Kategori Terbesar",
          nilai: ringkas.terbesar ? `${ringkas.terbesar.kategori} (${ringkas.terbesar.persen}%)` : "-",
        },
      ])
    );
  }

  if (bagian.includes("kategori")) {
    isi += bagianHtml(
      "Rekap per Kategori",
      tabelHtml({
        kolom: [{ label: "Kategori" }, { label: "Total", kanan: true }, { label: "Porsi", kanan: true }],
        baris: ringkas.perKategori.map((k) => [k.kategori, rp(k.total), `${k.persen}%`]),
        kaki: ["Total", rp(ringkas.total)],
      })
    );
  }

  if (bagian.includes("rincian")) {
    isi += bagianHtml(
      "Rincian Pengeluaran",
      tabelHtml({
        kolom: [
          { label: "No" },
          { label: "Tanggal" },
          { label: "Kategori" },
          { label: "Keterangan" },
          { label: "Metode" },
          { label: "Jumlah", kanan: true },
        ],
        baris: rows.map((e, i) => [
          String(i + 1),
          formatTanggalPendek(e.tanggal),
          e.kategori,
          e.catatan ? `${e.keterangan} (${e.catatan})` : e.keterangan,
          labelMetodeKeluar(e.metode),
          rp(e.jumlah),
        ]),
        kaki: ["Total", rp(ringkas.total)],
      })
    );
  }

  return isi;
}