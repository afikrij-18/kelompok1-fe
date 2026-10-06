import { useState } from "react";
import UserTable from "../components/user/UserTable";
import UserForm from "../components/user/UserForm";
import ConfirmDelete from "../components/user/ConfirmDelete";
import { users as dataAwal } from "../data/userDummy";

export default function UserManagement() {
  const [users, setUsers] = useState(dataAwal);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [pesan, setPesan] = useState("");

  const handleAdd = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleSubmit = (data) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u)));
    } else {
      const idBaru = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      setUsers([{ ...data, id: idBaru }, ...users]);
    }
    handleClose();
  };

  const handleDelete = (user) => {
    const jumlahAdmin = users.filter((u) => u.role === "Admin").length;
    if (user.role === "Admin" && jumlahAdmin === 1) {
      setPesan("Admin terakhir tidak bisa dihapus.");
      return;
    }
    setPesan("");
    setDeletingUser(user);
  };

  const handleConfirmDelete = () => {
    setUsers(users.filter((u) => u.id !== deletingUser.id));
    setDeletingUser(null);
  };

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">Manajemen User</h1>
      </header>

      <main className="space-y-6 p-6">
        {pesan && (
          <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">{pesan}</p>
        )}

        <UserTable
          data={users}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {showForm && (
        <UserForm
          initialData={editingUser}
          existingUsers={users}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}

      {deletingUser && (
        <ConfirmDelete
          user={deletingUser}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingUser(null)}
        />
      )}
    </>
  );
}