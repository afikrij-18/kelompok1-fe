// src/services/profileService.js
// Langkah 2: profil akun yang sedang login dan ganti password (sesuai request.rest)
import { apiFetch } from "./api";
import { getUser } from "./authService";

// Langkah 2.1: respons bisa berisi data user langsung atau di dalam data.user
const ambilUser = (body) => body.data?.user ?? body.data;

const dariApi = (u) => ({
  nama: u.name,
  email: u.email,
  telepon: u.phone || "",
  role: u.role,
});

// ambil profil terbaru dari server
export async function getProfile() {
  const body = await apiFetch("/auth/me");
  return dariApi(ambilUser(body));
}

// ubah profil, mengembalikan profil baru (atau null jika server tidak mengirim datanya)
export async function updateProfile(form) {
  const body = await apiFetch("/auth/profile", {
    method: "PUT",
    body: JSON.stringify({
      name: form.nama.trim(),
      email: form.email.trim(),
      phone: form.telepon ? form.telepon : null,
    }),
  });
  const u = ambilUser(body);
  return u && u.name ? dariApi(u) : null;
}

// Langkah 2.2: ganti password, 401 di sini berarti password lama salah, bukan sesi berakhir
export function changePassword({ lama, baru }) {
  return apiFetch("/auth/password", {
    method: "PUT",
    body: JSON.stringify({ oldPassword: lama, newPassword: baru }),
    abaikan401: true,
  });
}

// Langkah 2.3: perbarui data login yang tersimpan di browser supaya nama di sidebar ikut berubah.
// Kunci penyimpanannya dicari dari data user yang sama, jadi tidak perlu menebak nama kuncinya.
export function simpanUserLokal(baru) {
  const lama = getUser();
  if (!lama) return;

  for (let i = 0; i < localStorage.length; i++) {
    const kunci = localStorage.key(i);
    try {
      const nilai = JSON.parse(localStorage.getItem(kunci));
      if (nilai && nilai.id === lama.id && nilai.email === lama.email) {
        localStorage.setItem(kunci, JSON.stringify({ ...nilai, ...baru }));
        return;
      }
    } catch {
      // bukan JSON, lewati
    }
  }
}