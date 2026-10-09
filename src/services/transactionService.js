// src/services/transactionService.js
// Langkah 2: pemanggilan API transaksi
import { apiFetch } from "./api";
import { fromApi } from "./transactionMapper";

// Langkah 2.1: laporan keuangan. Filter hanya aktif jika from dan to diisi keduanya
export async function getSalesReport({ from, to } = {}) {
  const query = new URLSearchParams();
  if (from && to) {
    query.set("from", from);
    query.set("to", to);
  }
  const qs = query.toString();

  const body = await apiFetch(`/transactions/report${qs ? `?${qs}` : ""}`);

  return {
    totalOmzet: body.total_revenue || 0,
    totalTransaksi: body.total_transactions || 0,
    perMetode: body.summary_by_method || {},
    transaksi: (body.data || []).map(fromApi),
  };
}

// Langkah 2.2: catat pembayaran lunas untuk satu booking
// metode = cash | transfer_bank | qris
export async function createTransaction({ bookingId, metode, jumlah, catatan }) {
  const body = await apiFetch("/transactions", {
    method: "POST",
    body: JSON.stringify({
      booking_id: bookingId,
      payment_method: metode,
      amount_paid: jumlah,
      payment_status: "paid",
      notes: catatan || undefined,
    }),
  });
  return fromApi(body.data);
}