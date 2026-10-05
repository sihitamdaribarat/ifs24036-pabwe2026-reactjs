import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncAuthRegister } from "../states/authSlice";
import { useInput } from "../../../hooks/useInput";
import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import { IconUser, IconMail, IconLock, IconLoader2, IconUserPlus } from "@tabler/icons-react";

export default function RegisterPage() {
  const [name, onNameChange] = useInput("");
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [passwordConfirm, onPasswordConfirmChange] = useInput("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthRegister } = useSelector((state) => state.auth);

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = "Nama lengkap wajib diisi";
    }

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

    if (password !== passwordConfirm) {
      errs.passwordConfirm = "Konfirmasi kata sandi tidak cocok";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(
      asyncAuthRegister({ name, email, password })
    );

    if (asyncAuthRegister.fulfilled.match(result)) {
      await showSuccessDialog(
        "Pendaftaran akun berhasil! Silakan masuk dengan akun baru Anda.",
        "Registrasi Sukses"
      );
      navigate("/auth/login");
    } else {
      showErrorDialog(
        result.payload || "Registrasi gagal. Silakan coba kembali."
      );
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Daftar Akun Baru</h1>
        <p className="mt-1 text-sm text-slate-400">
          Bergabung untuk melaporkan barang hilang &amp; temuan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Nama Lengkap
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconUser className="w-5 h-5" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={onNameChange}
              placeholder="Contoh: John Doe"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.name
                  ? "border-rose-500 focus:ring-rose-500/30"
                  : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-rose-400">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconMail className="w-5 h-5" />
            </div>
            <input
              id="email"
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
          <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconLock className="w-5 h-5" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={onPasswordChange}
              placeholder="Minimal 6 karakter"
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

        {/* Password Confirm Field */}
        <div>
          <label htmlFor="passwordConfirm" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconLock className="w-5 h-5" />
            </div>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={onPasswordConfirmChange}
              placeholder="Ulangi kata sandi"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.passwordConfirm
                  ? "border-rose-500 focus:ring-rose-500/30"
                  : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
          </div>
          {errors.passwordConfirm && (
            <p className="mt-1 text-xs text-rose-400">{errors.passwordConfirm}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAuthRegister}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-600/30 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isAuthRegister ? (
            <>
              <IconLoader2 className="w-5 h-5 animate-spin" />
              <span>Mendaftarkan...</span>
            </>
          ) : (
            <>
              <IconUserPlus className="w-5 h-5" />
              <span>Daftar Akun</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-400">
        Sudah memiliki akun?{" "}
        <Link
          to="/auth/login"
          className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
