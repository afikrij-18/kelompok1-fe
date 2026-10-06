import { useState } from "react";
import LayananTable from "../components/layanan/LayananTable";
import LayananForm from "../components/layanan/LayananForm";
import ConfirmDeleteLayanan from "../components/layanan/ConfirmDeleteLayanan";
import { layanan as dataAwal } from "../data/layananDummy";
import { bookings } from "../data/dummy"; // Langkah 2.1: sumber data pemakaian

const pemakaian = {};
bookings.forEach((b) => {
  b.items.forEach((it) => {
    if (!pemakaian[it.layananId]) pemakaian[it.layananId] = [];
    // satu booking yang memakai layanan sama di 2 unit hanya dihitung sekali
    if (!pemakaian[it.layananId].includes(b.id)) pemakaian[it.layananId].push(b.id);
  });
});

export default function LayananManagement() {
  const [layanan, setLayanan] = useState(dataAwal);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const [pesan, setPesan] = useState(null); // { tipe: "sukses" | "error", teks: "..." }

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

  const handleSubmit = (data) => {
    if (editingItem) {
      setLayanan(layanan.map((l) => (l.id === editingItem.id ? { ...l, ...data } : l)));
      setPesan({ tipe: "sukses", teks: `Layanan "${data.nama}" berhasil diperbarui.` });
    } else {
      const idBaru = layanan.length ? Math.max(...layanan.map((l) => l.id)) + 1 : 1;
      setLayanan([{ ...data, id: idBaru }, ...layanan]);
      setPesan({ tipe: "sukses", teks: `Layanan "${data.nama}" berhasil ditambahkan.` });
    }
    handleClose();
  };

  const handleDelete = (item) => {
    const kode = pemakaian[item.id] || [];
    if (kode.length > 0) {
      setPesan({
        tipe: "error",
        teks: `Layanan "${item.nama}" dipakai di ${kode.length} booking (${kode.join(", ")}). Ubah statusnya menjadi Nonaktif jika tidak ingin ditawarkan lagi.`,
      });
      return;
    }
    setPesan(null);
    setDeletingItem(item);
  };

  const handleConfirmDelete = () => {
    setLayanan(layanan.filter((l) => l.id !== deletingItem.id));
    setPesan({ tipe: "sukses", teks: `Layanan "${deletingItem.nama}" berhasil dihapus.` });
    setDeletingItem(null);
  };

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">Layanan AC</h1>
      </header>

      <main className="space-y-6 p-6">
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

        <LayananTable
          data={layanan}
          pemakaian={pemakaian}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {showForm && (
        <LayananForm
          initialData={editingItem}
          existingLayanan={layanan}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}

      {deletingItem && (
        <ConfirmDeleteLayanan
          item={deletingItem}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingItem(null)}
        />
      )}
    </>
  );
}