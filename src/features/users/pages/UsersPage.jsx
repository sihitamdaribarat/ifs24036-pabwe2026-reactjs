import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetUsers } from "../states/userSlice";
import { formatDate } from "../../../helpers/toolsHelper";
import {
  IconUsers,
  IconSearch,
  IconMail,
  IconCalendar,
  IconLoader2,
  IconUserCheck,
} from "@tabler/icons-react";

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await dispatch(asyncGetUsers());
      setLoading(false);
    };
    fetch();
  }, [dispatch]);

  const filteredUsers = (users || []).filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user?.name?.toLowerCase().includes(term) ||
      user?.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium mb-3">
              <IconUsers className="w-3.5 h-3.5" />
              <span>Komunitas Delcom</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Daftar Pengguna Sistem
            </h1>
            <p className="mt-1 text-blue-100 text-sm max-w-xl">
              Lihat seluruh anggota yang terdaftar di platform Delcom Lost &amp; Found untuk memudahkan koordinasi pengembalian barang.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
            <IconUserCheck className="w-7 h-7 text-emerald-300" />
            <div>
              <p className="text-xs text-blue-100">Total Pengguna</p>
              <p className="text-xl font-bold">{users?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
        <IconSearch className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari berdasarkan nama atau email pengguna..."
          className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700"
          >
            Reset
          </button>
        )}
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <IconLoader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
          <p className="text-sm font-medium">Memuat data pengguna...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mb-4">
            <IconUsers className="w-8 h-8" />
          </div>
          <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Pengguna tidak ditemukan
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Tidak ada pengguna yang cocok dengan kata kunci &quot;{searchTerm}&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            const avatarUrl = user?.photo
              ? user.photo.startsWith("http")
                ? user.photo
                : `https://open-api.delcom.org/${user.photo}`
              : null;

            return (
              <div
                key={user.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:border-blue-400/50 transition duration-200 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-sm flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-sm flex-shrink-0 ${
                      avatarUrl ? "hidden" : "flex"
                    }`}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                      <IconMail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <IconCalendar className="w-3.5 h-3.5" />
                    <span>Bergabung {formatDate(user.created_at, { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
                    ID #{user.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
