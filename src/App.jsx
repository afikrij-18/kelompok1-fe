// src/App.jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import PesanService from "./pages/PesanService";
import Dashboard from "./pages/Dashboard";
import BookingList from "./pages/BookingList";
import Booking from "./pages/Booking";
import JadwalDispatch from "./pages/JadwalDispatch";
import BookingDetail from "./pages/BookingDetail";
import BookingEdit from "./pages/BookingEdit";
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
          {/* Langkah 2.1: halaman publik, tanpa login dan tanpa sidebar */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          {/* form booking untuk pelanggan, berbeda dari form admin di /booking/baru */}
          <Route path="/pesan" element={<PesanService />} />

          {/* Route untuk Admin & Owner */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/booking" element={<BookingList />} />
              <Route path="/booking/baru" element={<Booking />} />
              <Route path="/jadwal" element={<JadwalDispatch />} />
              <Route path="/booking/:id" element={<BookingDetail />} />
              <Route path="/booking/edit/:id" element={<BookingEdit />} />
              <Route path="/layanan" element={<LayananManagement />} />
              <Route path="/uang-keluar" element={<UangKeluar />} />
              <Route path="/technician" element={<Teknisi />} />
            </Route>
          </Route>

          {/* Route Owner saja */}
          <Route element={<ProtectedRoute roles={["owner"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/users" element={<UserManagement />} />
              <Route path="/laporan-penjualan" element={<LaporanPenjualan />} />
              {/* pengaturan akun (profil dan password) */}
              <Route path="/pengaturan" element={<Pengaturan />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
