export const stats = [
  { id: 1, title: "Booking Hari Ini", value: "18", unit: "Pesanan" },
  { id: 2, title: "Booking Menunggu", value: "7", unit: "Pesanan" },
  { id: 3, title: "Sedang Dikerjakan", value: "12", unit: "Unit AC" },
  { id: 4, title: "Selesai Hari Ini", value: "9", unit: "Servis" },
  { id: 5, title: "Total Pendapatan", value: "Rp 4.250.000", unit: "" },
];

export const bookings = [
  { id: "REG-001", pelanggan: "Budi Santoso", layanan: "Cuci AC", jadwal: "05 Okt 2026, 09:00", teknisi: "Rudi", status: "Selesai" },
  { id: "REG-002", pelanggan: "Siti Rahma", layanan: "Isi Freon", jadwal: "05 Okt 2026, 10:30", teknisi: "Andre", status: "Sedang dikerjakan" },
  { id: "REG-003", pelanggan: "Andi Wijaya", layanan: "Perbaikan AC Bocor", jadwal: "05 Okt 2026, 13:00", teknisi: "-", status: "Menunggu" },
  { id: "REG-004", pelanggan: "Dewi Lestari", layanan: "Pasang AC Baru", jadwal: "05 Okt 2026, 14:00", teknisi: "Fajar", status: "Sedang dikerjakan" },
  { id: "REG-005", pelanggan: "Rizky Pratama", layanan: "Cuci AC", jadwal: "06 Okt 2026, 08:00", teknisi: "-", status: "Menunggu" },
];

export const fleet = [
  { id: 1, value: "4", label: "Siap / Siaga" },
  { id: 2, value: "6", label: "Bertugas Aktif" },
  { id: 3, value: "2", label: "Izin / Libur" },
];

export const workload = [
  { id: 1, label: "Rata-rata Harian", value: "15", unit: "Tiket" },
  { id: 2, label: "SLA On-time Dispatch", value: "92", unit: "%" },
  { id: 3, label: "Jam Beban Tertinggi", value: "10:00 - 12:00", unit: "" },
  { id: 4, label: "Rata-rata Durasi Service", value: "1,5", unit: "jam" },
];

export const dispatches = [
  { id: 1, jam: "09:00", teknisi: "Rudi", aktivitas: "Cuci AC di rumah Budi Santoso" },
  { id: 2, jam: "10:30", teknisi: "Andre", aktivitas: "Isi freon di rumah Siti Rahma" },
  { id: 3, jam: "13:00", teknisi: "Belum ditugaskan", aktivitas: "Perbaikan AC bocor, Andi Wijaya" },
  { id: 4, jam: "14:00", teknisi: "Fajar", aktivitas: "Pasang AC baru, Dewi Lestari" },
];

export const chartData = [
  { hari: "Sen", booking: 14 },
  { hari: "Sel", booking: 18 },
  { hari: "Rab", booking: 12 },
  { hari: "Kam", booking: 20 },
  { hari: "Jum", booking: 16 },
  { hari: "Sab", booking: 22 },
  { hari: "Min", booking: 8 },
];