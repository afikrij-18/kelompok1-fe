import { useState } from "react";
import { X } from "lucide-react";

export default function BankForm({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(initialData || { nama: "", noRekening: "", atasNama: "", status: "active" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{initialData ? "Edit Bank" : "Tambah Bank"}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Bank</label>
            <input 
              required
              className="w-full mt-1 p-2 border rounded-lg text-sm"
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">No. Rekening</label>
            <input 
              className="w-full mt-1 p-2 border rounded-lg text-sm"
              value={formData.noRekening}
              onChange={(e) => setFormData({...formData, noRekening: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Atas Nama</label>
            <input 
              className="w-full mt-1 p-2 border rounded-lg text-sm"
              value={formData.atasNama}
              onChange={(e) => setFormData({...formData, atasNama: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="w-full mt-1 p-2 border rounded-lg text-sm"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button 
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
}
