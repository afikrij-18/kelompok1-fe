// src/components/uangkeluar/ExpenseForm.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { METODE_KELUAR } from "../../data/expenseOptions";
import { formatRupiah, hariIni, inputClass } from "../../utils/booking";
import { getExpenseCategories, getBanks } from "../../services/expenseService";

const pesanDariServer = (err) => {
  if (err instanceof TypeError) {
    return "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.";
  }
  if (err.errors && typeof err.errors === "object") {
    return Object.values(err.errors).join(" ");
  }
  return err.message;
};

export default function ExpenseForm({ initialData, onSubmit, onClose }) {
  const isEdit = Boolean(initialData);

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(true);

  const [form, setForm] = useState(() =>
    initialData
      ? {
          tanggal: initialData.tanggal,
          kategoriId: initialData.kategoriId ? String(initialData.kategoriId) : "",
          keterangan: initialData.keterangan,
          jumlah: String(initialData.jumlah),
          metode: initialData.metode,
          bank: initialData.bank || "",
          bankId: initialData.bankId ? String(initialData.bankId) : "",
        }
      : {
          tanggal: hariIni(),
          kategoriId: "",
          keterangan: "",
          jumlah: "",
          metode: METODE_KELUAR[0].value,
          bank: "",
          bankId: "",
        }
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getExpenseCategories("active")
      .then((list) => {
        setCategories(list);
        if (!initialData && list.length > 0 && !form.kategoriId) {
          setForm((f) => ({ ...f, kategoriId: String(list[0].id) }));
        }
      })
      .catch(() => setCategories([]))
      .finally(() => setLoadingCats(false));
  }, [initialData]);

  useEffect(() => {
    getBanks("active")
      .then((list) => {
        setBanks(list);
        // Saat edit, sinkronkan nama bank lama -> id jika belum ada
        if (initialData && !form.bankId && form.bank) {
          const hit = list.find((b) => b.nama === form.bank);
          if (hit) setForm((f) => ({ ...f, bank: hit.nama, bankId: String(hit.id) }));
        }
      })
      .catch(() => setBanks([]))
      .finally(() => setLoadingBanks(false));
  }, [initialData]);

  // Simpan bank sebagai id + nama dari master
  const handleBankChange = (e) => {
    const val = e.target.value;
    const hit = banks.find((b) => String(b.id) === val);
    setForm({ ...form, bankId: val, bank: hit ? hit.nama : "" });
    setErrors({ ...errors, bank: "", form: "" });
  };

  // Reset bank jika metode bukan transfer_bank
  useEffect(() => {
    if (form.metode !== "transfer_bank" && (form.bank || form.bankId)) {
      setForm((f) => ({ ...f, bank: "", bankId: "" }));
      setErrors((prev) => ({ ...prev, bank: "" }));
    }
  }, [form.metode, form.bank, form.bankId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "", form: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.tanggal) e.tanggal = "Tanggal wajib diisi";
    else if (form.tanggal > hariIni()) e.tanggal = "Tanggal tidak boleh lebih dari hari ini";

    if (!form.kategoriId) e.kategoriId = "Pilih kategori pengeluaran";

    const ket = form.keterangan.trim();
    if (ket.length < 3 || ket.length > 2000) e.keterangan = "Keterangan harus 3-2000 karakter";

    const nilai = Number(form.jumlah);
    if (form.jumlah === "" || !Number.isSafeInteger(nilai) || nilai <= 0) {
      e.jumlah = "Jumlah harus berupa angka bulat lebih dari 0";
    }

    if (!form.metode) e.metode = "Pilih metode pembayaran";
    if (form.metode === "transfer_bank" && !form.bankId) e.bank = "Pilih bank tujuan";

    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const hasil = validate();
    setErrors(hasil);
    if (Object.keys(hasil).length > 0) return;

    setSaving(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setErrors({ form: pesanDariServer(err) });
    } finally {
      setSaving(false);
    }
  };

  const nilaiJumlah = Number(form.jumlah);
  const jumlahValid = form.jumlah !== "" && Number.isSafeInteger(nilaiJumlah) && nilaiJumlah > 0;

  return (
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
              <label htmlFor="kategoriId" className="mb-1 block text-sm font-medium">
                Kategori <span className="text-red-600">*</span>
              </label>
              <select
                id="kategoriId"
                name="kategoriId"
                value={form.kategoriId}
                onChange={handleChange}
                disabled={saving || loadingCats}
                className={inputClass(errors.kategoriId)}
              >
                <option value="">{loadingCats ? "Memuat kategori..." : "-- Pilih Kategori --"}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama}
                  </option>
                ))}
              </select>
              {errors.kategoriId && <p className="mt-1 text-xs text-red-600">{errors.kategoriId}</p>}
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

          {form.metode === "transfer_bank" && (
            <div>
              <label htmlFor="bankId" className="mb-1 block text-sm font-medium">
                Bank <span className="text-red-600">*</span>
              </label>
              <select
                id="bankId"
                name="bankId"
                value={form.bankId}
                onChange={handleBankChange}
                disabled={saving || loadingBanks}
                className={inputClass(errors.bank)}
              >
                <option value="">{loadingBanks ? "Memuat bank..." : "-- Pilih Bank --"}</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nama}
                  </option>
                ))}
              </select>
              {errors.bank && <p className="mt-1 text-xs text-red-600">{errors.bank}</p>}
            </div>
          )}

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
              disabled={saving || loadingCats}
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
