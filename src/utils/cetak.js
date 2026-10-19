// src/utils/cetak.js
// Langkah 1: mesin cetak bersama. Dokumen dibuat sebagai HTML sendiri lalu dicetak lewat iframe
// tersembunyi, jadi tidak terpengaruh tata letak aplikasi dan tidak terhalang pemblokir popup.
import { getUser } from "../services/authService";

// Langkah 1.1: amankan teks sebelum disisipkan ke HTML
export const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const rp = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

const waktuCetak = () =>
  new Date().toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Langkah 1.2: gaya khusus kertas
const CSS = `
*{box-sizing:border-box}
body{font-family:Verdana,Geneva,sans-serif;font-size:11px;color:#1e293b;margin:0}
.kop{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #2C5EAD;padding-bottom:8px;margin-bottom:12px}
.logo{font-size:20px;font-weight:800;color:#2C5EAD}
.tag{display:block;font-size:8px;font-weight:700;letter-spacing:.06em;color:#1591DC}
.info-cetak{text-align:right;font-size:9px;color:#475569;line-height:1.5}
h1{font-size:16px;margin:0 0 4px;color:#2C5EAD}
.meta{margin:0 0 14px;font-size:10px;color:#475569;line-height:1.6}
h2{font-size:12px;margin:16px 0 6px;color:#2C5EAD;border-left:4px solid #1591DC;padding-left:6px}
.ringkas{display:flex;gap:8px;flex-wrap:wrap}
.kotak{flex:1;min-width:120px;border:1px solid #C4E2F5;border-radius:6px;padding:8px 10px}
.kotak .label{font-size:9px;color:#64748b}
.kotak .nilai{font-size:14px;font-weight:700;color:#2C5EAD;margin-top:2px}
table{width:100%;border-collapse:collapse}
thead{display:table-header-group}
th{background:#C4E2F5;color:#2C5EAD;text-align:left;padding:5px 6px;font-size:10px;border:1px solid #9fc9e6}
td{padding:4px 6px;border:1px solid #d5e3ee;vertical-align:top}
tr{page-break-inside:avoid}
.kanan{text-align:right;white-space:nowrap}
tfoot td{font-weight:700;background:#f1f7fc}
.kosong{color:#64748b;font-style:italic;padding:6px 0}
.catatan{font-size:9px;color:#64748b;margin-top:14px}
@media print{.kotak,th,tfoot td{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`;

// Langkah 1.3: kop dokumen. keterangan = daftar baris kecil di bawah judul (periode, filter, dan sebagainya)
export const kopDokumen = ({ judul, keterangan = [] }) => `
<div class="kop">
  <div>
    <span class="logo">Service AC Sumbar</span>
    <span class="tag">AC SERVICE &amp; BOOKING</span>
  </div>
  <div class="info-cetak">
    Dicetak: ${esc(waktuCetak())}<br>
    Oleh: ${esc(getUser()?.name || "-")}
  </div>
</div>
<h1>${esc(judul)}</h1>
<p class="meta">${keterangan.map(esc).join("<br>")}</p>
`;

// Langkah 1.4: satu bagian dengan judul kecil
export const bagianHtml = (judul, isi) => `<h2>${esc(judul)}</h2>${isi}`;

// Langkah 1.5: kotak ringkasan, items = [{ label, nilai }]
export const ringkasanHtml = (items) =>
  `<div class="ringkas">${items
    .map(
      (i) =>
        `<div class="kotak"><div class="label">${esc(i.label)}</div><div class="nilai">${esc(i.nilai)}</div></div>`
    )
    .join("")}</div>`;

// Langkah 1.6: tabel. kolom = [{ label, kanan? }], baris = [[teks, ...]], kaki = [label, nilai] (opsional)
export const tabelHtml = ({ kolom, baris, kaki, rawHtmlCols = [] }) => {
  if (baris.length === 0) return `<p class="kosong">Tidak ada data pada periode ini.</p>`;

  const kepala = kolom
    .map((k) => `<th class="${k.kanan ? "kanan" : ""}">${esc(k.label)}</th>`)
    .join("");

  const isi = baris
    .map(
      (r) =>
        `<tr>${r
          .map((c, i) => {
            const isRaw = rawHtmlCols.includes(i);
            const content = isRaw ? c : esc(c);
            return `<td class="${kolom[i].kanan ? "kanan" : ""}">${content}</td>`;
          })
          .join("")}</tr>`
    )
    .join("");

  const penutup = kaki
    ? `<tfoot><tr><td colspan="${kolom.length - 1}" class="kanan">${esc(kaki[0])}</td><td class="kanan">${esc(
        kaki[1]
      )}</td></tr></tfoot>`
    : "";

  return `<table><thead><tr>${kepala}</tr></thead><tbody>${isi}</tbody>${penutup}</table>`;
};

// Langkah 1.7: cetak. orientasi = "portrait" atau "landscape". judul dipakai sebagai nama file PDF
export function cetakDokumen({ judul, isi, orientasi = "portrait" }) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(
    `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${esc(judul)}</title>` +
      `<style>@page{size:A4 ${orientasi};margin:14mm}${CSS}</style></head><body>${isi}</body></html>`
  );
  doc.close();

  iframe.contentWindow.onafterprint = () => setTimeout(() => iframe.remove(), 500);

  // beri waktu browser menggambar isi sebelum dialog cetak dibuka
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    // cadangan jika onafterprint tidak terpanggil
    setTimeout(() => iframe.remove(), 60000);
  }, 250);
}