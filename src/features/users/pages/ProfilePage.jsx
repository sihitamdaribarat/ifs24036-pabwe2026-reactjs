import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncGetProfile,
  asyncUpdateProfile,
  asyncChangePhotoProfile,
  asyncChangePassword,
} from "../states/userSlice";
import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import {
  IconUser,
  IconMail,
  IconLock,
  IconCamera,
  IconCheck,
  IconLoader2,
  IconShield,
  IconCalendar,
} from "@tabler/icons-react";
import { formatDate } from "../../../helpers/toolsHelper";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const {
    profile,
    isProfile,
    isChangeProfile,
    isChangeProfilePhoto,
    isChangeProfilePassword,
  } = useSelector((state) => state.users);

  // Profile Edit State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password State
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  // Photo State
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(asyncGetProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showErrorDialog("Nama tidak boleh kosong!");
      return;
    }

    const result = await dispatch(asyncUpdateProfile({ name, email }));
    if (asyncUpdateProfile.fulfilled.match(result)) {
      showSuccessDialog("Profil berhasil diperbarui!", "Berhasil");
    } else {
      showErrorDialog(result.payload || "Gagal memperbarui profil");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("photo", selectedFile);

    const result = await dispatch(asyncChangePhotoProfile(formData));
    if (asyncChangePhotoProfile.fulfilled.match(result)) {
      showSuccessDialog("Foto profil berhasil diperbarui!");
      setSelectedFile(null);
      setPreviewPhoto(null);
    } else {
      showErrorDialog(result.payload || "Gagal mengunggah foto profil");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      showErrorDialog("Kata sandi lama wajib diisi");
      return;
    }
    if (newPassword.length < 6) {
      showErrorDialog("Kata sandi baru minimal 6 karakter");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      showErrorDialog("Konfirmasi kata sandi baru tidak sesuai");
      return;
    }

    const result = await dispatch(
      asyncChangePassword({
        password,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirm,
      })
    );

    if (asyncChangePassword.fulfilled.match(result)) {
      showSuccessDialog("Kata sandi berhasil diubah!", "Berhasil");
      setPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } else {
      showErrorDialog(result.payload || "Gagal mengubah kata sandi");
    }
  };

  const avatarUrl = previewPhoto || (profile?.photo
    ? profile.photo.startsWith("http")
      ? profile.photo
      : `https://open-api.delcom.org/${profile.photo}`
    : null);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-700/50 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="relative group">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile?.name || "User Avatar"}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-blue-500/30 shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-extrabold text-white ring-4 ring-blue-500/30 shadow-xl">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
              title="Ganti Foto"
            >
              <IconCamera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {profile?.name || "Profil Pengguna"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">{profile?.email || "-"}</p>

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                <IconCalendar className="w-3.5 h-3.5 text-blue-400" />
                Terdaftar: {formatDate(profile?.created_at, { month: "short", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                <IconShield className="w-3.5 h-3.5 text-emerald-400" />
                ID Akun: #{profile?.id || "-"}
              </span>
            </div>
          </div>

          {selectedFile && (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleUploadPhoto}
                disabled={isChangeProfilePhoto}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition cursor-pointer"
              >
                {isChangeProfilePhoto ? (
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <IconCheck className="w-4 h-4" />
                )}
                Simpan Foto Baru
              </button>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewPhoto(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
              >
                Batalkan
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Update Profile Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <IconUser className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Informasi Profil
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Perbarui nama dan kontak akun Anda
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label htmlFor="profile-name" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Nama Lengkap
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              />
            </div>

            <div>
              <label htmlFor="profile-email" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Alamat Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                disabled
                aria-describedby="profile-email-hint"
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 text-sm cursor-not-allowed"
              />
              <p id="profile-email-hint" className="text-[11px] text-slate-400 mt-1">
                Email terdaftar sebagai identitas unik akun.
              </p>
            </div>

            <button
              type="submit"
              disabled={isChangeProfile}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isChangeProfile ? (
                <>
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <IconLock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Ganti Kata Sandi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Amankan akun Anda dengan kata sandi kuat
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password-old" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Kata Sandi Lama
              </label>
              <input
                id="password-old"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
              />
            </div>

            <div>
              <label htmlFor="password-new" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Kata Sandi Baru
              </label>
              <input
                id="password-new"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
              />
            </div>

            <div>
              <label htmlFor="password-confirm" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                id="password-confirm"
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isChangeProfilePassword}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-medium text-sm shadow-md shadow-amber-700/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isChangeProfilePassword ? (
                <>
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                  <span>Memperbarui Sandi...</span>
                </>
              ) : (
                <span>Perbarui Kata Sandi</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
