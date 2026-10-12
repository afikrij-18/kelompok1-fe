// src/pages/LayananManagement.jsx
import { useEffect, useState } from "react";
import LayananTable from "../components/layanan/LayananTable";
import LayananForm from "../components/layanan/LayananForm";
import KategoriTable from "../components/layanan/KategoriTable";
import KategoriForm from "../components/layanan/KategoriForm";
import ConfirmDeleteLayanan from "../components/layanan/ConfirmDeleteLayanan";
import ConfirmDeleteKategori from "../components/layanan/ConfirmDeleteKategori";
import { getServices, createService, updateService, deleteService } from "../services/serviceService";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../services/categoryService";

// TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

export default function LayananManagement() {
  const [layanan, setLayanan] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gagalMuat, setGagalMuat] = useState(false);
  const [percobaan, setPercobaan] = useState(0); // dinaikkan saat tombol "Coba lagi" ditekan

  // Langkah 7.1: tab aktif, "layanan" atau "kategori"
  const [tab, setTab] = useState("layanan");

  // state layanan
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Langkah 7.2: state kategori, terpisah dari layanan
  const [showKategoriForm, setShowKategoriForm] = useState(false);
  const [editingKategori, setEditingKategori] = useState(null);
  const [deletingKategori, setDeletingKategori] = useState(null);
  const [deletingKat, setDeletingKat] = useState(false);

  const [pesan, setPesan] = useState(null); // { tipe: "sukses" | "error", teks }

  // muat layanan dan kategori bersamaan saat halaman dibuka (dan saat "Coba lagi")
  useEffect(() => {
    let batal = false; // cegah set state jika halaman sudah ditinggalkan

    Promise.all([getServices(), getCategories()])
      .then(([dataLayanan, dataKategori]) => {
        if (batal) return;
        setLayanan(dataLayanan);
        setKategoriList(dataKategori);
      })
      .catch((err) => {
        if (!batal) {
          setGagalMuat(true);
          setPesan({ tipe: "error", teks: pesanError(err) });
        }
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    return () => {
      batal = true;
    };
  }, [percobaan]);

  const cobaLagi = () => {
    setPesan(null);
    setGagalMuat(false);
    setLoading(true);
    setPercobaan((p) => p + 1);
  };

  // Langkah 7.3: muat ulang layanan dan kategori sekaligus
  // (nama kategori tampil di tabel layanan, jadi keduanya perlu diperbarui)
  const muatSemua = async () => {
    const [dataLayanan, dataKategori] = await Promise.all([getServices(), getCategories()]);
    setLayanan(dataLayanan);
    setKategoriList(dataKategori);
  };

  const ganti = (namaTab) => {
    setPesan(null);
    setTab(namaTab);
  };

  // ---------- Layanan ----------
  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  // simpan ke API, error dilempar kembali agar tampil di dalam form
  const handleSubmit = async (data) => {
    if (editingItem) {
      await updateService(editingItem.id, data);
    } else {
      await createService(data);
    }

    await muatSemua().catch(() => {});
    setPesan({
      tipe: "sukses",
      teks: editingItem
        ? `Layanan "${data.nama.trim()}" berhasil diperbarui.`
        : `Layanan "${data.nama.trim()}" berhasil ditambahkan.`,
    });
    handleClose();
  };

  const handleDelete = (item) => {
    setPesan(null);
    setDeletingItem(item);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteService(deletingItem.id);
      await muatSemua().catch(() => {});
      setPesan({ tipe: "sukses", teks: `Layanan "${deletingItem.nama}" berhasil dihapus.` });
    } catch (err) {
      setPesan({ tipe: "error", teks: pesanError(err) });
    } finally {
      setDeleting(false);
      setDeletingItem(null);
    }
  };

  // ---------- Kategori ----------
  const handleAddKategori = () => {
    setPesan(null);
    setEditingKategori(null);
    setShowKategoriForm(true);
  };

  const handleEditKategori = (kategori) => {
    setPesan(null);
    setEditingKategori(kategori);
    setShowKategoriForm(true);
  };

  const handleCloseKategori = () => {
    setShowKategoriForm(false);
    setEditingKategori(null);
  };

  // Langkah 7.4: simpan kategori (tambah atau ubah)
  // error dilempar kembali agar tampil di dalam dialog kategori
  const handleSubmitKategori = async (nama) => {
    if (editingKategori) {
      await updateCategory(editingKategori.id, nama);
    } else {
      await createCategory(nama);
    }

    await muatSemua().catch(() => {});
    setPesan({
      tipe: "sukses",
      teks: editingKategori
        ? `Kategori "${nama}" berhasil diperbarui.`
        : `Kategori "${nama}" berhasil ditambahkan.`,
    });
    handleCloseKategori();
  };

  // Langkah 7.5: kategori yang masih punya layanan tidak bisa dihapus (backend juga menolak)
  const handleDeleteKategori = (kategori) => {
    const jumlah = layanan.filter((l) => l.categoryId === kategori.id).length;
    if (jumlah > 0) {
      setPesan({
        tipe: "error",
        teks: `Kategori "${kategori.nama}" masih memiliki ${jumlah} layanan. Pindahkan layanannya ke kategori lain atau hapus dulu.`,
      });
      return;
    }
    setPesan(null);
    setDeletingKategori(kategori);
  };

  const handleConfirmDeleteKategori = async () => {
    setDeletingKat(true);
    try {
      await deleteCategory(deletingKategori.id);
      await muatSemua().catch(() => {});
      setPesan({ tipe: "sukses", teks: `Kategori "${deletingKategori.nama}" berhasil dihapus.` });
    } catch (err) {
      // pesan dari backend, mis. masih punya subkategori
      setPesan({ tipe: "error", teks: pesanError(err) });
    } finally {
      setDeletingKat(false);
      setDeletingKategori(null);
    }
  };

  const tabClass = (aktif) =>
    `rounded-lg border px-4 py-1.5 text-sm font-medium ${
      aktif ? "border-primary bg-primary text-white" : "border-gray-300 hover:bg-soft"
    }`;

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">Layanan AC</h1>
      </header>

      <main className="space-y-6 p-6">
        {/* Langkah 7.6: tab pemisah layanan dan kategori */}
        <div className="flex gap-2">
          <button onClick={() => ganti("layanan")} className={tabClass(tab === "layanan")}>
            Layanan ({layanan.length})
          </button>
          <button onClick={() => ganti("kategori")} className={tabClass(tab === "kategori")}>
            Kategori ({kategoriList.length})
          </button>
        </div>

        {pesan && (
          <div
            className={`flex items-start justify-between gap-3 rounded-lg px-4 py-2 text-sm ${
              pesan.tipe === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            <span>{pesan.teks}</span>
            <button onClick={() => setPesan(null)} className="font-bold">×</button>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Memuat data layanan...</p>
        ) : gagalMuat ? (
          <button
            onClick={cobaLagi}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
          >
            Coba lagi
          </button>
        ) : tab === "layanan" ? (
          <LayananTable
            data={layanan}
            kategoriList={kategoriList}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <KategoriTable
            data={kategoriList}
            layanan={layanan}
            onAdd={handleAddKategori}
            onEdit={handleEditKategori}
            onDelete={handleDeleteKategori}
          />
        )}
      </main>

      {showForm && (
        <LayananForm
          initialData={editingItem}
          existingLayanan={layanan}
          kategoriList={kategoriList}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}

      {deletingItem && (
        <ConfirmDeleteLayanan
          item={deletingItem}
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingItem(null)}
        />
      )}

      {showKategoriForm && (
        <KategoriForm
          initialData={editingKategori}
          existingKategori={kategoriList}
          onSubmit={handleSubmitKategori}
          onClose={handleCloseKategori}
        />
      )}

      {deletingKategori && (
        <ConfirmDeleteKategori
          item={deletingKategori}
          loading={deletingKat}
          onConfirm={handleConfirmDeleteKategori}
          onClose={() => setDeletingKategori(null)}
        />
      )}
    </>
  );
}