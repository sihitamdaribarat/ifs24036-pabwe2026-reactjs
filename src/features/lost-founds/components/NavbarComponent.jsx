import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncAuthLogout } from "../../auth/states/authSlice";
import { showConfirmDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import {
  IconSearch,
  IconMenu2,
  IconUser,
  IconLogout,
  IconChevronDown,
} from "@tabler/icons-react";

export default function NavbarComponent({ onToggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentUser = profile || user;

  const avatarUrl = currentUser?.photo
    ? currentUser.photo.startsWith("http")
      ? currentUser.photo
      : `https://open-api.delcom.org/${currentUser.photo}`
    : null;

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    const confirmed = await showConfirmDialog(
      "Apakah Anda yakin ingin keluar dari akun ini?",
      "Konfirmasi Keluar",
      "Ya, Keluar"
    );

    if (confirmed) {
      await dispatch(asyncAuthLogout());
      showSuccessDialog("Anda telah berhasil keluar.", "Sampai Jumpa");
      navigate("/auth/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Section: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition cursor-pointer"
            aria-label="Buka Menu"
          >
            <IconMenu2 className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <IconSearch className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Delcom
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block -mt-1 tracking-wider uppercase">
                Lost &amp; Found
              </span>
            </div>
          </Link>
        </div>

        {/* Right Section: Session status, User badge & Dropdown */}
        <div className="flex items-center gap-3">
          {/* Active Session Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sesi Aktif</span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={currentUser?.name || "User Avatar"}
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm ${
                  avatarUrl ? "hidden" : "flex"
                }`}
              >
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
              </div>

              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {currentUser?.name || "Pengguna"}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {currentUser?.email || "user@delcom.org"}
                </p>
              </div>

              <IconChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/60 md:hidden">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser?.name || "Pengguna"}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {currentUser?.email || "user@delcom.org"}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <IconUser className="w-4 h-4 text-blue-500" />
                  <span>Profil &amp; Akun Saya</span>
                </Link>

                <div className="my-1 border-t border-slate-100 dark:border-slate-700/60" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left cursor-pointer"
                >
                  <IconLogout className="w-4 h-4" />
                  <span>Keluar Sistem</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
