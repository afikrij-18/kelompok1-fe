import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Search } from "lucide-react";
import { getExpenseCategories, deleteExpenseCategory, createExpenseCategory, updateExpenseCategory } from "../../services/expenseService";
import ConfirmDelete from "../shared/ConfirmDelete";
import ExpenseCategoryForm from "./ExpenseCategoryForm";
import Pagination from "../Pagination";
import usePagination from "../hooks/usePagination";

export default function ExpenseCategoryTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [editing, setEditing] = useState(null); // null = tutup, {} = tambah, {id,...} = edit
  const [searchTerm, setSearchTerm] = useState("");

  const hal = usePagination(data, 10, searchTerm);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getExpenseCategories("", searchTerm);
      setData(res);
      hal.setPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [searchTerm]);

  const handleDelete = async () => {
    try {
      await deleteExpenseCategory(deleting.id);
      setDeleting(null);
      loadData();
    } catch (err) {
      alert(err.message || "Gagal menghapus kategori");
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editing.id) {
        await updateExpenseCategory(editing.id, formData);
      } else {
        await createExpenseCategory(formData);
      }
      setEditing(null);
      loadData();
    } catch (err) {
      alert(err.message || "Gagal menyimpan kategori");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari kategori..."
            className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setEditing({})}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 font-medium"
        >
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-soft text-primary uppercase text-xs">
            <tr>
              {["No", "Nama Kategori", "Deskripsi", "Status", "Aksi"].map((h) => (
                <th key={h} className="px-6 py-3 font-bold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">Memuat data...</td></tr>
            ) : hal.pageItems.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500 italic">Belum ada kategori pengeluaran.</td></tr>
            ) : hal.pageItems.map((item, i) => (
              <tr key={item.id} className="hover:bg-soft/20 transition">
                <td className="px-6 py-3 text-xs text-gray-500">{hal.mulai + i + 1}</td>
                <td className="px-6 py-3 font-medium text-gray-900">{item.nama}</td>
                <td className="px-6 py-3 text-gray-500">{item.deskripsi || "-"}</td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-right space-x-2">
                  <button 
                    onClick={() => setEditing(item)}
                    className="p-1.5 text-secondary hover:bg-soft rounded"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => setDeleting(item)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination {...hal} onChange={hal.setPage} />

      {editing && (
        <ExpenseCategoryForm
          initialData={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {deleting && (
        <ConfirmDelete
          title="Hapus Kategori?"
          message={`Kategori "${deleting.nama}" akan dihapus permanen.`}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
