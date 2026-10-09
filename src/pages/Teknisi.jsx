// src/pages/Teknisi.jsx
// Langkah 6: halaman kelola teknisi, tersambung ke /api/technicians
import { useEffect, useState } from "react";
import TeknisiTable from "../components/teknisi/TeknisiTable";
import TeknisiForm from "../components/teknisi/TeknisiForm";
import ConfirmDeleteTeknisi from "../components/teknisi/ConfirmDeleteTeknisi";
import {
  getTechnicians,
  createTechnician,
  updateTechnician,
  deleteTechnician,
} from "../services/technicianService";

// TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

export default function Teknisi() {
  const [teknisi, setTeknisi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gagalMuat, setGagalMuat] = useState(false);
  const [percobaan, setPercobaan] = useState(0); // dinaikkan saat tombol "Coba lagi" ditekan
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pesan, setPesan] = useState(null); // { tipe: "sukses" | "error", teks }

  // Langkah 6.1: muat teknisi saat halaman dibuka (dan saat "Coba lagi")
  useEffect(() => {
    let batal = false; // cegah set state jika halaman sudah ditinggalkan

    getTechnicians()
      .then((data) => {
        if (!batal) setTeknisi(data);
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

  const muatUlang = async () => {
    setTeknisi(await getTechnicians());
  };

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

  // Langkah 6.2: simpan ke API, error dilempar kembali agar tampil di dalam form
  const handleSubmit = async (data) => {
    if (editingItem) {
      await updateTechnician(editingItem.id, data);
    } else {
      await createTechnician(data);
    }

    await muatUlang().catch(() => {});
    setPesan({
      tipe: "sukses",
      teks: editingItem
        ? `Teknisi "${data.nama.trim()}" berhasil diperbarui.`
        : `Teknisi "${data.nama.trim()}" berhasil ditambahkan.`,
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
      await deleteTechnician(deletingItem.id);
      await muatUlang().catch(() => {});
      setPesan({
        tipe: "sukses",
        teks: `Teknisi "${deletingItem.nama}" berhasil dihapus.`,
      });
    } catch (err) {
      setPesan({ tipe: "error", teks: pesanError(err) });
    } finally {
      setDeleting(false);
      setDeletingItem(null);
    }
  };

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">Teknisi</h1>
      </header>

      <main className="space-y-6 p-6">
        {pesan && (
          <div
            className={`flex items-start justify-between gap-3 rounded-lg px-4 py-2 text-sm ${
              pesan.tipe === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <span>{pesan.teks}</span>
            <button onClick={() => setPesan(null)} className="font-bold">
              ×
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Memuat data teknisi...</p>
        ) : gagalMuat ? (
          <button
            onClick={cobaLagi}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
          >
            Coba lagi
          </button>
        ) : (
          <TeknisiTable
            data={teknisi}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      {showForm && (
        <TeknisiForm
          initialData={editingItem}
          existingTeknisi={teknisi}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}

      {deletingItem && (
        <ConfirmDeleteTeknisi
          item={deletingItem}
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingItem(null)}
        />
      )}
    </>
  );
}