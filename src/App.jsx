// src/App.jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import BookingList from "./pages/BookingList";
import Booking from "./pages/Booking";
import JadwalDispatch from "./pages/JadwalDispatch";
import LayananManagement from "./pages/LayananManagement";
import UserManagement from "./pages/UserManagement";
import UangKeluar from "./pages/UangKeluar";
import Teknisi from "./pages/Teknisi";
import LaporanPenjualan from "./pages/LaporanPenjualan";
import Pengaturan from "./pages/Pengaturan";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Langkah 4.1: halaman tanpa login dan tanpa sidebar */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />

          {/* Langkah 4.2: lapis pertama cek login, lapis kedua layout dengan sidebar */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/booking" element={<BookingList />} />
              <Route path="/booking/baru" element={<Booking />} />
              <Route path="/jadwal" element={<JadwalDispatch />} />
              <Route path="/layanan" element={<LayananManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/uang-keluar" element={<UangKeluar />} />
              <Route path="/technician" element={<Teknisi />} />
              <Route path="/laporan-penjualan" element={<LaporanPenjualan />} />
              {/* Langkah 4.3: pengaturan akun (profil dan password) */}
              <Route path="/pengaturan" element={<Pengaturan />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;