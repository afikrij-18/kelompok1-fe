export const stats = [
  { id: 1, title: "Booking Hari Ini", value: "18", unit: "Pesanan" },
  { id: 2, title: "Booking Menunggu", value: "7", unit: "Pesanan" },
  { id: 3, title: "Sedang Dikerjakan", value: "12", unit: "Unit AC" },
  { id: 4, title: "Selesai Hari Ini", value: "9", unit: "Servis" },
  { id: 5, title: "Total Pendapatan", value: "Rp 4.250.000", unit: "" },
];

export const bookings = [
  {
    id: "REG-001", pelanggan: "Budi Santoso", jadwal: "05 Okt 2026, 09:00", teknisi: "Rudi", status: "Selesai",
    items: [
      { unit: "AC Ruang Tamu", layananId: 2, layanan: "Cuci AC Split 1,5 - 2 PK", harga: 100000 },
      { unit: "AC Kamar Utama", layananId: 3, layanan: "Isi Freon R32", harga: 200000 },
    ],
  },
  {
    id: "REG-002", pelanggan: "Siti Rahma", jadwal: "05 Okt 2026, 10:30", teknisi: "Andre", status: "Sedang dikerjakan",
    items: [
      { unit: "AC Kamar", layananId: 3, layanan: "Isi Freon R32", harga: 200000 },
    ],
  },
  {
    id: "REG-003", pelanggan: "Andi Wijaya", jadwal: "05 Okt 2026, 13:00", teknisi: "-", status: "Menunggu",
    items: [
      { unit: "AC Dapur", layananId: 4, layanan: "Perbaikan AC Bocor", harga: 250000 },
      { unit: "AC Ruang Makan", layananId: 1, layanan: "Cuci AC Split 0,5 - 1 PK", harga: 75000 },
      { unit: "AC Kamar Anak", layananId: 1, layanan: "Cuci AC Split 0,5 - 1 PK", harga: 75000 },
    ],
  },
  {
    id: "REG-004", pelanggan: "Dewi Lestari", jadwal: "05 Okt 2026, 14:00", teknisi: "Fajar", status: "Sedang dikerjakan",
    items: [
      { unit: "AC Baru Ruang Tamu", layananId: 6, layanan: "Pasang AC Baru", harga: 350000 },
    ],
  },
  {
    id: "REG-005", pelanggan: "Rizky Pratama", jadwal: "06 Okt 2026, 08:00", teknisi: "-", status: "Menunggu",
    items: [
      { unit: "AC Kantor", layananId: 2, layanan: "Cuci AC Split 1,5 - 2 PK", harga: 100000 },
    ],
  },
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