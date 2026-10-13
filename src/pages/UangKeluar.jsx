// src/pages/UangKeluar.jsx
import { useEffect, useState } from "react";
import { Plus, Printer } from "lucide-react";
import ExpenseSummary from "../components/uangkeluar/ExpenseSummary";
import ExpenseTable from "../components/uangkeluar/ExpenseTable";
import ExpenseForm from "../components/uangkeluar/ExpenseForm.jsx";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseService";
import { rentangBulan, ringkasPengeluaran } from "../utils/pengeluaran";

export default function UangKeluar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const list = await getExpenses();
      setData(list);
      setError(null);
    } catch (err) {
      setError(err instanceof TypeError ? "Tidak dapat terhubung ke server." : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ringkasan = ringkasPengeluaran(data);

  const handleSave = async (form) => {
    if (editingData) {
      await updateExpense(editingData.id, form);
    } else {
      await createExpense(form);
    }
    await fetchData();
    setIsDialogOpen(false);
    setEditingData(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus pengeluaran ini?")) {
      await deleteExpense(id);
      await fetchData();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Uang Keluar</h1>
        <button
          onClick={() => {
            setEditingData(null);
            setIsDialogOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-secondary"
        >
          <Plus size={20} /> Tambah Uang Keluar
        </button>
      </div>

      {error && <p className="rounded bg-red-100 p-3 text-red-700">{error}</p>}
      
      {!loading && !error && (
        <>
          <ExpenseSummary ringkasan={ringkasan} periode="Semua Periode" />
          <ExpenseTable 
            data={data} 
            onEdit={(d) => { setEditingData(d); setIsDialogOpen(true); }}
            onDelete={(d) => handleDelete(d.id)}
          />
        </>
      )}

      {isDialogOpen && (
        <ExpenseForm
          initialData={editingData}
          onSubmit={handleSave}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
}
