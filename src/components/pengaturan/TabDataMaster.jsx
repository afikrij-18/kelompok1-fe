import { useState } from "react";
import BankTable from "./BankTable";
import ExpenseCategoryTable from "./ExpenseCategoryTable";

export function TabDataMaster() {
  const [subTab, setSubTab] = useState("bank"); // bank | kategori

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setSubTab("bank")}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            subTab === "bank" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Master Bank
        </button>
        <button
          onClick={() => setSubTab("kategori")}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            subTab === "kategori" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Kategori Pengeluaran
        </button>
      </div>

      <div className="pt-2">
        {subTab === "bank" ? <BankTable /> : <ExpenseCategoryTable />}
      </div>
    </div>
  );
}
