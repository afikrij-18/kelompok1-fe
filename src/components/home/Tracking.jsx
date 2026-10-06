import { useState } from "react";
import { Search, Phone, TextSearch, TicketCheck, Info } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import StatusItem from "../ui/StatusItem";

export default function Tracking() {
  const [registration, setRegistration] = useState("AC-2026-00128");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [tracking, setTracking] = useState(false);

  const handleCheckStatus = (event) => {
    event.preventDefault();

    if (!registration.trim()) {
      setMessage("Silakan masukkan nomor registrasi.");
      setTracking(false);
      return;
    }

    if (!phone.trim()) {
      setMessage("Silakan masukkan nomor HP / WhatsApp.");
      setTracking(false);
      return;
    }

    setTracking(true);
    setMessage(
      `Status booking ${registration.toUpperCase()} berhasil ditemukan.`,
    );
  };

  return (
    <section
      id="cek-status"
      className="border-t border-[#c4e2f5] bg-[#f5faff] py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="SUDAH MELAKUKAN BOOKING?"
          description="Pantau status service AC Anda menggunakan nomor registrasi."
        />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* FORM CEK STATUS */}
          <div className="rounded-2xl border border-[#c4e2f5] bg-white p-6 shadow-sm sm:p-8 lg:col-span-5">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ff] text-[#2c5ead]">
                <TextSearch size={24} />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#0a2540]">
                  Cek Status Service
                </h3>

                <p className="text-xs text-[#434751]">
                  Masukkan nomor registrasi pesanan
                </p>
              </div>
            </div>

            <form onSubmit={handleCheckStatus} className="space-y-4">
              <div>
                <label
                  htmlFor="trackReg"
                  className="mb-1.5 block text-xs font-bold text-[#0a2540]"
                >
                  Nomor Registrasi
                </label>

                <div className="relative">
                  <TicketCheck
                    size={18}
                    className="absolute left-3.5 top-3 text-[#434751]"
                  />

                  <input
                    id="trackReg"
                    value={registration}
                    onChange={(event) =>
                      setRegistration(event.target.value.toUpperCase())
                    }
                    placeholder="Contoh: AC-2026-00128"
                    type="text"
                    className="w-full rounded-xl border border-[#c4e2f5] py-3 pl-10 pr-4 font-mono text-xs text-[#0a2540] outline-none transition-all placeholder:text-slate-400 focus:border-[#2c5ead] focus:ring-2 focus:ring-[#2c5ead]/20 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="trackPhone"
                  className="mb-1.5 block text-xs font-bold text-[#0a2540]"
                >
                  No. HP / WhatsApp
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3.5 top-3 text-[#434751]"
                  />

                  <input
                    id="trackPhone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Masukkan nomor HP"
                    type="tel"
                    className="w-full rounded-xl border border-[#c4e2f5] py-3 pl-10 pr-4 text-xs text-[#0a2540] outline-none transition-all placeholder:text-slate-400 focus:border-[#2c5ead] focus:ring-2 focus:ring-[#2c5ead]/20 sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2c5ead] py-3.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-[#1f4684] sm:text-sm"
              >
                <Search size={18} />
                CEK STATUS SERVICE
              </button>
            </form>

            {message && (
              <div className="mt-4 rounded-xl border border-[#c4e2f5] bg-[#e8f5ff] p-3 text-xs font-semibold text-[#2c5ead]">
                {message}
              </div>
            )}

            <p className="mt-4 flex items-center gap-1.5 text-[11px] text-[#434751]">
              <Info size={15} className="shrink-0 text-[#1591dc]" />
              Nomor registrasi dapat ditemukan setelah booking berhasil.
            </p>
          </div>

          {/* STATUS SERVICE */}
          <div className="flex flex-col gap-6 rounded-2xl border border-[#c4e2f5] bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-[#c4e2f5] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1591dc]">
                  Contoh status service
                </span>

                <h3 className="mt-0.5 text-base font-bold text-[#0a2540] sm:text-lg">
                  BOOKING #{registration || "AC-2026-00128"}
                </h3>
              </div>

              <span className="rounded-full border border-[#c4e2f5] bg-[#e8f5ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2c5ead]">
                Demo
              </span>
            </div>

            <div className="py-2">
              <div className="relative flex flex-col space-y-6">
                <StatusItem
                  completed
                  title="Booking Dikonfirmasi"
                  description="Pesanan Anda telah diterima dalam sistem jadwal."
                />

                <StatusItem
                  completed
                  title="Teknisi Ditugaskan"
                  description="Teknisi Bpk. Rahmat Santoso siap bertugas."
                />

                <StatusItem
                  current
                  title="Teknisi Dalam Perjalanan"
                  description="Teknisi sedang meluncur ke alamat service Anda."
                  extra="Estimasi tiba: 14:15 WIB"
                />

                <StatusItem
                  title="Sedang Dikerjakan"
                  description="Proses pencucian dan pemeriksaan teknis unit AC."
                />

                <StatusItem
                  last
                  title="Service Selesai"
                  description="Pekerjaan rampung dan kartu garansi aktif."
                />
              </div>
            </div>

            {tracking && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-xs font-semibold text-green-700">
                Status berhasil diperbarui untuk nomor {registration}.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
