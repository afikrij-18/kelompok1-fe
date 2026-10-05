import { Wrench, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Langsung pindah ke halaman /dashboard tanpa validasi apapun
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen bg-[#2C5EAD] flex items-center justify-center p-4"
      style={{ fontFamily: "Verdana, Geneva, sans-serif" }}
    >
      <div className="w-full max-w-[420px]">

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="
              mx-auto mb-5
              flex h-16 w-16
              items-center justify-center
              rounded-2xl
              bg-[#1591DC]
              text-white
              shadow-lg shadow-[#1591DC]/30
            "
          >
            <Wrench className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Admin ServisAC
          </h1>

          <p className="mt-2 text-sm text-white">
            Masuk untuk mengelola sistem booking
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-white p-7 shadow-2xl">

          {/* Card Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#2C5EAD]">
              Login Administrator
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Silakan masuk menggunakan akun administrator.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    text-[#1591DC]
                  "
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue="admin@servisac.com"
                  required
                  className="
                    h-12
                    w-full
                    rounded-lg
                    border
                    border-[#C4E2F5]
                    bg-white
                    pl-10
                    pr-4
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-[#1591DC]
                    focus:ring-2
                    focus:ring-[#4BB8FA]/30
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    text-[#1591DC]
                  "
                />

                <input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue="admin123"
                  required
                  className="
                    h-12
                    w-full
                    rounded-lg
                    border
                    border-[#C4E2F5]
                    bg-white
                    pl-10
                    pr-4
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-[#1591DC]
                    focus:ring-2
                    focus:ring-[#4BB8FA]/30
                  "
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="
                h-12
                w-full
                rounded-lg
                bg-[#2C5EAD]
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-[#2C5EAD]/20
                transition
                hover:bg-[#1591DC]
                active:scale-[0.99]
                focus:outline-none
                focus:ring-2
                focus:ring-[#4BB8FA]
                focus:ring-offset-2
              "
            >
              Masuk
            </button>
          </form>

          {/* Footer */}
          <div
            className="
              mt-6
              border-t
              border-[#C4E2F5]
              pt-5
              text-center
            "
          >
            <p className="text-xs text-slate-500">
              Default:{" "}
              <span className="font-medium text-[#2C5EAD]">
                admin@servisac.com
              </span>{" "}
              /{" "}
              <span className="font-medium text-[#2C5EAD]">
                admin123
              </span>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-center text-xs text-[#2C5EAD]/60">
          © 2026 ServisAC. All rights reserved.
        </p>
      </div>
    </div>
  );
}