// src/pages/Pengaturan.jsx
// Langkah 2: pengaturan dengan tab. Profil dan Keamanan tersambung ke API,
// Usaha, Booking, dan Notifikasi masih desain (menunggu backend).
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UserCircle, KeyRound, Store, CalendarCheck, Bell } from "lucide-react";
import { getUser } from "../services/authService";
import {
  getProfile,
  updateProfile,
  changePassword,
  simpanUserLokal,
} from "../services/profileService";
import {
  TabUsaha,
  TabBooking,
  TabNotifikasi,
} from "../components/pengaturan/PengaturanUsaha";

const ROLE = { admin: "Admin", owner: "Owner" };

// Langkah 2.1: daftar tab, segera = belum tersambung ke backend
const TABS = [
  { id: "profil", label: "Profil Saya", icon: UserCircle },
  { id: "keamanan", label: "Keamanan", icon: KeyRound },
  { id: "usaha", label: "Usaha", icon: Store, segera: true },
  { id: "booking", label: "Booking", icon: CalendarCheck, segera: true },
  { id: "notifikasi", label: "Notifikasi", icon: Bell, segera: true },
];

// TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

const inputClass = (error) =>
  `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent ${
    error ? "border-red-500" : "border-gray-300"
  }`;

const passwordKosong = { lama: "", baru: "", ulang: "" };

// kotak pesan sukses atau error di dalam kartu
function Pesan({ pesan, children }) {
  if (!pesan) return null;
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm ${
        pesan.tipe === "error"
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      <span>{pesan.teks}</span>
      {children}
    </div>
  );
}

export default function Pengaturan() {
  // Langkah 2.2: tab aktif disimpan di alamat (?tab=keamanan), jadi menu pengguna bisa menautkannya
  const [params, setParams] = useSearchParams();
  const tabParam = params.get("tab");
  const tab = TABS.some((t) => t.id === tabParam) ? tabParam : "profil";

  // isi awal dari data login di browser, lalu diperbarui dari server
  const lokal = getUser();
  const [profil, setProfil] = useState({
    nama: lokal?.name || "",
    email: lokal?.email || "",
    telepon: lokal?.phone || "",
  });
  const [role, setRole] = useState(lokal?.role || "");
  const [errProfil, setErrProfil] = useState({});
  const [pesanProfil, setPesanProfil] = useState(null);
  const [savingProfil, setSavingProfil] = useState(false);

  const [password, setPassword] = useState(passwordKosong);
  const [errPassword, setErrPassword] = useState({});
  const [pesanPassword, setPesanPassword] = useState(null);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    let batal = false; // cegah set state jika halaman sudah ditinggalkan

    getProfile()
      .then((p) => {
        if (batal) return;
        setProfil({ nama: p.nama, email: p.email, telepon: p.telepon });
        setRole(p.role);
      })
      .catch((err) => {
        if (!batal) setPesanProfil({ tipe: "error", teks: pesanError(err) });
      });

    return () => {
      batal = true;
    };
  }, []);

  // ---------- profil ----------
  const ubahProfil = (e) => {
    const { name, value } = e.target;
    setProfil({ ...profil, [name]: value });
    setErrProfil({ ...errProfil, [name]: "" });
    setPesanProfil(null);
  };

  // aturan sama dengan data user di backend
  const simpanProfil = async (ev) => {
    ev.preventDefault();

    const e = {};
    if (profil.nama.trim().length < 2 || profil.nama.trim().length > 100)
      e.nama = "Nama harus 2-100 karakter";
    if (!/^\S+@\S+\.\S+$/.test(profil.email.trim()))
      e.email = "Format email tidak valid";
    if (profil.telepon && !/^\d{10,15}$/.test(profil.telepon))
      e.telepon = "Telepon harus 10-15 digit angka";
    setErrProfil(e);
    if (Object.keys(e).length > 0) return;

    setSavingProfil(true);
    setPesanProfil(null);
    try {
      const baru = await updateProfile(profil);
      const nilai = baru || {
        nama: profil.nama.trim(),
        email: profil.email.trim(),
        telepon: profil.telepon,
      };

      setProfil({
        nama: nilai.nama,
        email: nilai.email,
        telepon: nilai.telepon,
      });
      simpanUserLokal({
        name: nilai.nama,
        email: nilai.email,
        phone: nilai.telepon || null,
      });
      setPesanProfil({
        tipe: "sukses",
        teks: "Profil berhasil diperbarui.",
        muatUlang: true,
      });
    } catch (err) {
      setPesanProfil({ tipe: "error", teks: pesanError(err) });
    } finally {
      setSavingProfil(false);
    }
  };

  // ---------- password ----------
  const ubahPassword = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
    setErrPassword({ ...errPassword, [name]: "" });
    setPesanPassword(null);
  };

  // password baru minimal 6 karakter dan harus berbeda dari yang lama
  const simpanPassword = async (ev) => {
    ev.preventDefault();

    const e = {};
    if (!password.lama) e.lama = "Password lama wajib diisi";
    if (password.baru.length < 6) e.baru = "Password baru minimal 6 karakter";
    else if (password.baru === password.lama)
      e.baru = "Password baru harus berbeda dari password lama";
    if (password.ulang !== password.baru)
      e.ulang = "Konfirmasi tidak sama dengan password baru";
    setErrPassword(e);
    if (Object.keys(e).length > 0) return;

    setSavingPassword(true);
    setPesanPassword(null);
    try {
      await changePassword({ lama: password.lama, baru: password.baru });
      setPassword(passwordKosong);
      setPesanPassword({ tipe: "sukses", teks: "Password berhasil diubah." });
    } catch (err) {
      setPesanPassword({ tipe: "error", teks: pesanError(err) });
    } finally {
      setSavingPassword(false);
    }
  };

  const tombolSimpan =
    "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary disabled:opacity-60";

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">Pengaturan</h1>
      </header>

      <main className="space-y-6 p-6">
        {/* Langkah 2.3: tab pengaturan */}
        <nav className="flex gap-1 overflow-x-auto border-b border-gray-200">
          {TABS.map((t) => {
            const Icon = t.icon;
            const aktif = t.id === tab;
            return (
              <button
                key={t.id}
                onClick={() => setParams({ tab: t.id })}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-2 text-sm ${
                  aktif
                    ? "border-primary font-semibold text-primary"
                    : "border-transparent text-gray-500 hover:text-primary"
                }`}
              >
                <Icon size={16} />
                {t.label}
                {t.segera && (
                  <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                    Segera
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Langkah 2.4: tab profil, ringkasan akun dan form edit */}
        {tab === "profil" && (
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold uppercase text-white">
                {profil.nama?.[0] || "?"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">
                  {profil.nama || "-"}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {profil.email || "-"}
                </p>
                <span className="mt-1 inline-block rounded-full bg-soft px-2 py-0.5 text-xs font-medium capitalize text-primary">
                  {ROLE[role] || role || "-"}
                </span>
              </div>
            </div>

            <form
              onSubmit={simpanProfil}
              noValidate
              className="space-y-4 rounded-xl bg-white p-6 shadow"
            >
              <div>
                <h2 className="text-base font-semibold text-primary">
                  Ubah Data Profil
                </h2>
                <p className="text-xs text-gray-500">
                  Data akun yang sedang digunakan untuk login.
                </p>
              </div>

              <Pesan pesan={pesanProfil}>
                {pesanProfil?.muatUlang && (
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="text-xs font-bold underline"
                  >
                    Muat ulang agar nama di sidebar ikut berubah
                  </button>
                )}
              </Pesan>

              <div>
                <label className="mb-1 block text-sm font-medium">Nama</label>
                <input
                  name="nama"
                  value={profil.nama}
                  onChange={ubahProfil}
                  className={inputClass(errProfil.nama)}
                />
                {errProfil.nama && (
                  <p className="mt-1 text-xs text-red-600">{errProfil.nama}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  value={profil.email}
                  onChange={ubahProfil}
                  className={inputClass(errProfil.email)}
                />
                {errProfil.email && (
                  <p className="mt-1 text-xs text-red-600">{errProfil.email}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Telepon (opsional)
                </label>
                <input
                  name="telepon"
                  value={profil.telepon}
                  onChange={ubahProfil}
                  className={inputClass(errProfil.telepon)}
                />
                {errProfil.telepon && (
                  <p className="mt-1 text-xs text-red-600">
                    {errProfil.telepon}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Role</label>
                <input
                  value={ROLE[role] || role || "-"}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Role hanya bisa diubah oleh admin lewat menu User.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfil}
                  className={tombolSimpan}
                >
                  {savingProfil ? "Menyimpan..." : "Simpan Profil"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Langkah 2.5: tab keamanan, ubah password */}
        {tab === "keamanan" && (
          <form
            onSubmit={simpanPassword}
            noValidate
            className="max-w-2xl space-y-4 rounded-xl bg-white p-6 shadow"
          >
            <div>
              <h2 className="text-base font-semibold text-primary">
                Ubah Password
              </h2>
              <p className="text-xs text-gray-500">
                Gunakan password yang sulit ditebak dan tidak dipakai di tempat
                lain.
              </p>
            </div>

            <Pesan pesan={pesanPassword} />

            <div>
              <label className="mb-1 block text-sm font-medium">
                Password Lama
              </label>
              <input
                name="lama"
                type="password"
                value={password.lama}
                onChange={ubahPassword}
                autoComplete="current-password"
                className={inputClass(errPassword.lama)}
              />
              {errPassword.lama && (
                <p className="mt-1 text-xs text-red-600">{errPassword.lama}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Password Baru
              </label>
              <input
                name="baru"
                type="password"
                value={password.baru}
                onChange={ubahPassword}
                autoComplete="new-password"
                className={inputClass(errPassword.baru)}
              />
              {errPassword.baru ? (
                <p className="mt-1 text-xs text-red-600">{errPassword.baru}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-400">
                  Minimal 6 karakter.
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Ulangi Password Baru
              </label>
              <input
                name="ulang"
                type="password"
                value={password.ulang}
                onChange={ubahPassword}
                autoComplete="new-password"
                className={inputClass(errPassword.ulang)}
              />
              {errPassword.ulang && (
                <p className="mt-1 text-xs text-red-600">{errPassword.ulang}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingPassword}
                className={tombolSimpan}
              >
                {savingPassword ? "Menyimpan..." : "Ubah Password"}
              </button>
            </div>
          </form>
        )}

        {/* Langkah 2.6: tab yang masih desain saja */}
        {tab === "usaha" && <TabUsaha />}
        {tab === "booking" && <TabBooking />}
        {tab === "notifikasi" && <TabNotifikasi />}
      </main>
    </>
  );
}