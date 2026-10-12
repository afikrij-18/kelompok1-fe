// src/components/uangkeluar/ExpenseForm.jsx  (FE, BARU)
// Langkah 2: dialog tambah dan edit pengeluaran (satu komponen, dua mode)
// Hanya tertutup lewat tombol X atau Batal, dan terkunci saat menyimpan
import { useState } from "react";
import { X } from "lucide-react";
import { KATEGORI_KELUAR, METODE_KELUAR } from "../../data/expenseOptions";
import { formatRupiah, hariIni, inputClass } from "../../utils/booking";

// Langkah 2.1: pesan error dari server, ditampilkan di bagian atas form
// nama field backend belum diketahui, jadi semua pesan digabung dan tidak dipetakan ke kolom
const pesanDariServer = (err) => {
  if (err instanceof TypeError) {
    return "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.";
  }
  if (Array.isArray(err.errors) && err.errors.length > 0) {
    return err.errors.map((x) => x.message).join(" ");
  }
  return err.message;
};

// Langkah 2.2: initialData = pengeluaran yang diedit (null saat tambah)
// onSubmit(form) dikerjakan halaman; kalau melempar error, pesannya tampil di sini
export default function ExpenseForm({ initialData, onSubmit, onClose }) {
  const isEdit = Boolean(initialData);

  // Langkah 2.3: nilai awal, tambah = hari ini dan kategori pertama, edit = data yang dipilih
  // jumlah disimpan sebagai teks agar bisa dipakai di <input>
  const [form, setForm] = useState(() =>
    initialData
      ? {
          tanggal: initialData.tanggal,
          kategori: initialData.kategori,
          keterangan: initialData.keterangan,
          jumlah: String(initialData.jumlah),
          metode: initialData.metode,
          catatan: initialData.catatan,
        }
      : {
          tanggal: hariIni(),
          kategori: KATEGORI_KELUAR[0],
          keterangan: "",
          jumlah: "",
          metode: METODE_KELUAR[0].value,
          catatan: "",
        }
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Langkah 2.4: satu fungsi untuk semua input, error kolom itu dihapus saat mulai mengetik lagi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "", form: "" });
  };

  // Langkah 2.5: validasi, mengembalikan objek error (kosong = valid)
  const validate = () => {
    const e = {};

    // pengeluaran adalah uang yang sudah keluar, jadi tanggal tidak boleh di masa depan
    if (!form.tanggal) e.tanggal = "Tanggal wajib diisi";
    else if (form.tanggal > hariIni()) e.tanggal = "Tanggal tidak boleh lebih dari hari ini";

    if (!form.kategori) e.kategori = "Pilih kategori";

    // batas 3 sampai 150 karakter adalah usulan, ubah jika backend punya aturan lain
    const ket = form.keterangan.trim();
    if (ket.length < 3 || ket.length > 150) e.keterangan = "Keterangan harus 3-150 karakter";

    const nilai = Number(form.jumlah);
    if (form.jumlah === "" || !Number.isInteger(nilai) || nilai <= 0) {
      e.jumlah = "Jumlah harus berupa angka bulat lebih dari 0";
    }

    if (!form.metode) e.metode = "Pilih metode";

    return e;
  };

  // Langkah 2.6: saat tombol simpan ditekan
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const hasil = validate();
    setErrors(hasil);
    if (Object.keys(hasil).length > 0) return;

    setSaving(true);
    try {
      // berhasil: halaman menutup dialog ini
      await onSubmit(form);
    } catch (err) {
      // gagal: dialog tetap terbuka, pesan tampil di dalam form
      setErrors({ form: pesanDariServer(err) });
    } finally {
      setSaving(false);
    }
  };

  const nilaiJumlah = Number(form.jumlah);
  const jumlahValid = form.jumlah !== "" && Number.isInteger(nilaiJumlah) && nilaiJumlah > 0;

  return (
    // Langkah 2.7: lapisan gelap TANPA onClick, klik di luar kotak tidak menutup dialog
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">
            {isEdit ? "Edit Pengeluaran" : "Tambah Pengeluaran"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            title="Tutup"
            className="rounded p-1 hover:bg-gray-100 disabled:opacity-60"
          >
            <X size={18} />
          </button>
        </div>

        {/* Langkah 2.8: noValidate agar validasi memakai aturan di atas, bukan bawaan browser */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {errors.form && (
            <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{errors.form}</p>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="tanggal" className="mb-1 block text-sm font-medium">
                Tanggal <span className="text-red-600">*</span>
              </label>
              <input
                id="tanggal"
                name="tanggal"
                type="date"
                max={hariIni()}
                value={form.tanggal}
                onChange={handleChange}
                disabled={saving}
                className={inputClass(errors.tanggal)}
              />
              {errors.tanggal && <p className="mt-1 text-xs text-red-600">{errors.tanggal}</p>}
            </div>

            <div>
              <label htmlFor="kategori" className="mb-1 block text-sm font-medium">
                Kategori <span className="text-red-600">*</span>
              </label>
              <select
                id="kategori"
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                disabled={saving}
                className={inputClass(errors.kategori)}
              >
                {KATEGORI_KELUAR.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              {errors.kategori && <p className="mt-1 text-xs text-red-600">{errors.kategori}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="keterangan" className="mb-1 block text-sm font-medium">
              Keterangan <span className="text-red-600">*</span>
            </label>
            <input
              id="keterangan"
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              disabled={saving}
              placeholder="Contoh: Freon R32 2 tabung"
              className={inputClass(errors.keterangan)}
            />
            {errors.keterangan && <p className="mt-1 text-xs text-red-600">{errors.keterangan}</p>}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="jumlah" className="mb-1 block text-sm font-medium">
                Jumlah (Rp) <span className="text-red-600">*</span>
              </label>
              <input
                id="jumlah"
                name="jumlah"
                type="number"
                min="1"
                step="1"
                value={form.jumlah}
                onChange={handleChange}
                disabled={saving}
                placeholder="Contoh: 150000"
                className={inputClass(errors.jumlah)}
              />
              {/* Langkah 2.9: pratinjau format rupiah saat jumlah valid */}
              {errors.jumlah ? (
                <p className="mt-1 text-xs text-red-600">{errors.jumlah}</p>
              ) : (
                jumlahValid && <p className="mt-1 text-xs text-gray-500">{formatRupiah(nilaiJumlah)}</p>
              )}
            </div>

            <div>
              <label htmlFor="metode" className="mb-1 block text-sm font-medium">
                Metode <span className="text-red-600">*</span>
              </label>
              <select
                id="metode"
                name="metode"
                value={form.metode}
                onChange={handleChange}
                disabled={saving}
                className={inputClass(errors.metode)}
              >
                {METODE_KELUAR.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              {errors.metode && <p className="mt-1 text-xs text-red-600">{errors.metode}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="catatan" className="mb-1 block text-sm font-medium">
              Catatan <span className="font-normal text-gray-400">(opsional)</span>
            </label>
            <textarea
              id="catatan"
              name="catatan"
              rows={2}
              value={form.catatan}
              onChange={handleChange}
              disabled={saving}
              placeholder="Contoh: dibeli di toko langganan, nota disimpan"
              className={inputClass(errors.catatan)}
            />
          </div>

          {/* Langkah 2.10: tombol terkunci saat menyimpan */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-60"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}