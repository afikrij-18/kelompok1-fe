import { useState } from "react";
import { Wrench, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const DEFAULT_EMAIL = "admin@gmail.com";
const DEFAULT_PASSWORD = "admin123";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
          : err.message
      );
    } finally {
      setLoading(false);
    }
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

            {error && (
              <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              disabled={loading}
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
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? "Memproses..." : "Masuk"}
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
                {DEFAULT_EMAIL}
              </span>{" "}
              /{" "}
              <span className="font-medium text-[#2C5EAD]">
                {DEFAULT_PASSWORD}
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