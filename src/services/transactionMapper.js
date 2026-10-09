// src/services/transactionMapper.js
// Langkah 1: terjemahan field transaksi backend -> tampilan (sesuai TransactionController.js)

// Langkah 1.1: metode pembayaran di database -> teks tampilan
export const METODE = {
  cash: "Tunai",
  transfer_bank: "Transfer Bank",
  qris: "QRIS",
};

// Langkah 1.2: daftar pilihan untuk dropdown metode pembayaran
export const METODE_OPSI = Object.entries(METODE).map(([value, label]) => ({ value, label }));

// Langkah 1.3: "2026-10-08T07:31:00.000Z" -> "08 Okt 2026, 14.31"
export const formatWaktu = (iso) =>
  iso
    ? new Date(iso).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

// Langkah 1.4: backend -> tampilan
export const fromApi = (t) => ({
  id: t.id,
  bookingId: t.booking_id,
  invoice: t.invoice_no,
  kodeBooking: t.booking?.reg_no || "-",
  totalBooking: t.booking?.total_price ?? 0,
  metode: METODE[t.payment_method] || t.payment_method,
  dibayar: t.amount_paid,
  status: t.payment_status,
  waktuBayar: formatWaktu(t.payment_date),
  catatan: t.notes || "",
});