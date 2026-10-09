// src/pages/UserManagement.jsx
// Langkah 4: halaman user, aturan "tidak bisa jadi Teknisi" dihapus
import { useEffect, useState } from "react";
import UserTable from "../components/user/UserTable";
import UserForm from "../components/user/UserForm";
import ConfirmDelete from "../components/user/ConfirmDelete";
import ChangePasswordDialog from "../components/user/ChangePasswordDialog";
import {
  getUsers,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
} from "../services/userService";
import { getUser } from "../services/authService";

// TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gagalMuat, setGagalMuat] = useState(false);
  const [percobaan, setPercobaan] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  // user yang password-nya sedang diganti (null = dialog tertutup)
  const [passwordUser, setPasswordUser] = useState(null);
  const [pesan, setPesan] = useState(null); // { tipe: "sukses" | "error", teks }

  const me = getUser();

  useEffect(() => {
    let batal = false;

    getUsers()
      .then((data) => {
        if (!batal) setUsers(data);
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
    const data = await getUsers();
    setUsers(data);
  };

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

  // simpan ke API, error dilempar kembali agar tampil di dalam form
  const handleSubmit = async (data) => {
    // Langkah 4.1: backend tidak mencegah menonaktifkan akun sendiri, jadi dijaga di frontend
    const akunSendiri = editingUser && me && editingUser.id === me.id;
    if (akunSendiri && data.status === "Nonaktif") {
      throw new Error("Akun yang sedang dipakai login tidak bisa dinonaktifkan.");
    }

    if (editingUser) {
      await updateUser(editingUser.id, data);
    } else {
      await createUser(data);
    }

    const teks = editingUser ? "User berhasil diperbarui." : "User berhasil ditambahkan.";
    await muatUlang().catch(() => {});
    setPesan({ tipe: "sukses", teks });
    handleClose();
  };

  // simpan password baru lewat PUT /users/:id/password
  // error dilempar kembali agar tampil di dalam dialog
  const handleSubmitPassword = async (passwordBaru) => {
    await updateUserPassword(passwordUser.id, passwordBaru);
    setPesan({ tipe: "sukses", teks: `Password ${passwordUser.nama} berhasil diganti.` });
    setPasswordUser(null);
  };

  const handleDelete = (user) => {
    if (me && user.id === me.id) {
      setPesan({ tipe: "error", teks: "Akun yang sedang dipakai login tidak bisa dihapus." });
      return;
    }

    const jumlahAdmin = users.filter((u) => u.role === "Admin").length;
    if (user.role === "Admin" && jumlahAdmin === 1) {
      setPesan({ tipe: "error", teks: "Admin terakhir tidak bisa dihapus." });
      return;
    }

    setPesan(null);
    setDeletingUser(user);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(deletingUser.id);
      await muatUlang().catch(() => {});
      setPesan({ tipe: "sukses", teks: `User ${deletingUser.nama} berhasil dihapus.` });
    } catch (err) {
      setPesan({ tipe: "error", teks: pesanError(err) });
    } finally {
      setDeleting(false);
      setDeletingUser(null);
    }
  };

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">Manajemen User</h1>
      </header>

      <main className="space-y-6 p-6">
        {pesan && (
          <p
            className={`rounded-lg px-4 py-2 text-sm ${
              pesan.tipe === "sukses" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {pesan.teks}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Memuat data user...</p>
        ) : gagalMuat ? (
          <button
            onClick={cobaLagi}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
          >
            Coba lagi
          </button>
        ) : (
          <UserTable
            data={users}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onChangePassword={(user) => {
              setPesan(null);
              setPasswordUser(user);
            }}
          />
        )}
      </main>

      {showForm && (
        <UserForm
          initialData={editingUser}
          existingUsers={users}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}

      {passwordUser && (
        <ChangePasswordDialog
          user={passwordUser}
          onSubmit={handleSubmitPassword}
          onClose={() => setPasswordUser(null)}
        />
      )}

      {deletingUser && (
        <ConfirmDelete
          user={deletingUser}
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingUser(null)}
        />
      )}
    </>
  );
}