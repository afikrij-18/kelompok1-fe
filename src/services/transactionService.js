// src/services/transactionService.js
import { apiFetch } from "./api";
import { fromApi } from "./transactionMapper";

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

export async function getTransactions() {
  const body = await apiFetch("/transactions");
  return body.data.map(fromApi);
}

// Catat pembayaran (transfer_bank wajib bankId)
export async function createTransaction({ bookingId, metode, bankId, jumlah, catatan }) {
  const body = await apiFetch("/transactions", {
    method: "POST",
    body: JSON.stringify({
      booking_id: bookingId,
      payment_method: metode,
      bank_id: bankId,
      amount_paid: jumlah,
      payment_status: "paid",
      notes: catatan || undefined,
    }),
  });
  return fromApi(body.data);
}
