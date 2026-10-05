import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncAuthLogin } from "../states/authSlice";
import { useInput } from "../../../hooks/useInput";
import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import { IconMail, IconLock, IconLoader2, IconLogin } from "@tabler/icons-react";

export default function LoginPage() {
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthLogin } = useSelector((state) => state.auth);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Format email tidak valid";
    }

    if (!password) {
      errs.password = "Kata sandi wajib diisi";
    } else if (password.length < 6) {
      errs.password = "Kata sandi minimal 6 karakter";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(asyncAuthLogin({ email, password }));
    if (asyncAuthLogin.fulfilled.match(result)) {
      await showSuccessDialog("Berhasil masuk ke sistem!", "Login Berhasil");
      navigate("/");
    } else {
      showErrorDialog(
        result.payload || "Login gagal. Periksa kembali email dan kata sandi Anda."
      );
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Masuk ke Akun</h1>
        <p className="mt-1 text-sm text-slate-400">
          Kelola laporan kehilangan &amp; penemuan barang
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Email Field */}
        <div>
          <label htmlFor="login-email-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconMail className="w-5 h-5" />
            </div>
            <input
              id="login-email-input"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={onEmailChange}
              placeholder="nama@delcom.org"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.email
                  ? "border-rose-500 focus:ring-rose-500/30"
                  : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-rose-400">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="login-password-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconLock className="w-5 h-5" />
            </div>
            <input
              id="login-password-input"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={onPasswordChange}
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.password
                  ? "border-rose-500 focus:ring-rose-500/30"
                  : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-400">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          id="login-submit-button"
          type="submit"
          disabled={isAuthLogin}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-600/30 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isAuthLogin ? (
            <>
              <IconLoader2 className="w-5 h-5 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <IconLogin className="w-5 h-5" />
              <span>Masuk Sekarang</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-400">
        Belum punya akun?{" "}
        <Link
          to="/auth/register"
          className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          Daftar di sini
        </Link>
      </div>
    </div>
  );
}
