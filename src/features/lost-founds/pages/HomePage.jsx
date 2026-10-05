import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncGetLostFounds,
  asyncDeleteLostFound,
  asyncGetDailyStats,
  asyncGetMonthlyStats,
} from "../states/lostFoundSlice";
import {
  showConfirmDialog,
  showSuccessDialog,
  showErrorDialog,
  formatDate,
} from "../../../helpers/toolsHelper";
import ChangeModal from "../modals/ChangeModal";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import {
  IconSearch,
  IconPlus,
  IconFilter,
  IconCheck,
  IconClock,
  IconPhoto,
  IconEdit,
  IconTrash,
  IconEye,
  IconLoader2,
  IconLayoutGrid,
  IconList,
  IconPackage,
  IconAlertCircle,
  IconChartBar,
  IconArrowRight,
} from "@tabler/icons-react";

export default function HomePage() {
  const dispatch = useDispatch();
  const outletContext = useOutletContext();
  const onOpenAddModal = outletContext?.onOpenAddModal;
  const dashboardTab = outletContext?.dashboardTab || "list";
  const setDashboardTab = outletContext?.setDashboardTab;

  const { lostFounds, isLostFound, lostFoundStats } = useSelector(
    (state) => state.lostFounds
  );
  const { profile } = useSelector((state) => state.users);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'lost' | 'found'
  const [completedFilter, setCompletedFilter] = useState("all"); // 'all' | '1' | '0'
  const [isMeFilter, setIsMeFilter] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Modals state
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [selectedItemForCover, setSelectedItemForCover] = useState(null);

  const fetchItems = useCallback(() => {
    const params = {};
    if (statusFilter !== "all") params.status = statusFilter;
    if (completedFilter !== "all") params.is_completed = completedFilter;
    if (isMeFilter) params.is_me = 1;

    dispatch(asyncGetLostFounds(params));
    dispatch(asyncGetDailyStats());
    dispatch(asyncGetMonthlyStats());
  }, [dispatch, statusFilter, completedFilter, isMeFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Listen to new additions from navbar/sidebar modal
  useEffect(() => {
    const handleAdded = () => {
      fetchItems();
    };
    window.addEventListener("lost-found-added", handleAdded);
    return () => window.removeEventListener("lost-found-added", handleAdded);
  }, [fetchItems]);

  // Client-side search filtering
  const filteredItems = useMemo(() => {
    return (lostFounds || []).filter((item) => {
      const term = searchTerm.toLowerCase();
      const matchesTitle = item?.title?.toLowerCase().includes(term);
      const matchesDesc = item?.description?.toLowerCase().includes(term);
      const matchesAuthor = item?.author?.name?.toLowerCase().includes(term);
      return matchesTitle || matchesDesc || matchesAuthor;
    });
  }, [lostFounds, searchTerm]);

  // Calculated Metric Statistics
  const stats = useMemo(() => {
    const all = lostFounds || [];
    const total = all.length;
    const lost = all.filter((i) => i.status === "lost").length;
    const found = all.filter((i) => i.status === "found").length;
    const completed = all.filter((i) => Number(i.is_completed) === 1).length;
    return { total, lost, found, completed };
  }, [lostFounds]);

  const handleDelete = async (id, title) => {
    const confirmed = await showConfirmDialog(
      `Apakah Anda yakin ingin menghapus laporan "${title}"? Tindakan ini tidak dapat dibatalkan.`,
      "Konfirmasi Hapus",
      "Ya, Hapus"
    );

    if (confirmed) {
      const result = await dispatch(asyncDeleteLostFound(id));
      if (asyncDeleteLostFound.fulfilled.match(result)) {
        showSuccessDialog("Laporan berhasil dihapus!");
        fetchItems();
      } else {
        showErrorDialog(result.payload || "Gagal menghapus laporan");
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-2">
              <IconPackage className="w-3.5 h-3.5" />
              Sistem Pelaporan Terpadu
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Laporan Barang Hilang &amp; Ditemukan
            </h1>
            <p className="mt-2 text-blue-100 text-sm leading-relaxed">
              Bantu sesama menemukan barang yang tertinggal atau laporkan barang temuan Anda secara aman, cepat, dan transparan di lingkungan Delcom.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAddModal && onOpenAddModal()}
              className="py-3 px-5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-lg shadow-black/10 transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <IconPlus className="w-4 h-4" />
              <span>Buat Laporan Baru</span>
            </button>
            {setDashboardTab && (
              <button
                onClick={() =>
                  setDashboardTab(dashboardTab === "list" ? "stats" : "list")
                }
                className="py-3 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs backdrop-blur-md transition flex items-center gap-2 cursor-pointer border border-white/20"
              >
                <IconChartBar className="w-4 h-4" />
                <span>
                  {dashboardTab === "list" ? "Lihat Statistik" : "Lihat Daftar"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
              Total Laporan
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1" aria-label={`Total laporan: ${stats.total}`}>
              {stats.total}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <IconPackage className="w-6 h-6" />
          </div>
        </div>

        {/* Lost Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Barang Hilang
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1" aria-label={`Barang hilang: ${stats.lost}`}>
              {stats.lost}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <IconAlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Found Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Barang Ditemukan
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1" aria-label={`Barang ditemukan: ${stats.found}`}>
              {stats.found}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <IconCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Kasus Selesai
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1" aria-label={`Kasus selesai: ${stats.completed}`}>
              {stats.completed}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <IconClock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Conditional: If tab is 'stats', display daily & monthly charts view */}
      {dashboardTab === "stats" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <IconChartBar className="w-5 h-5 text-blue-500" />
              <span>Metrik &amp; Grafik Statistik Laporan</span>
            </h2>
            <button
              onClick={() => setDashboardTab && setDashboardTab("list")}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Kembali ke Daftar Laporan &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Stats Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Statistik Harian
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Jumlah laporan barang hilang dan temuan harian
              </p>

              {lostFoundStats?.daily?.stats_losts ? (
                <div className="space-y-3">
                  {Object.entries(lostFoundStats.daily.stats_losts).map(
                    ([date, lostCount]) => {
                      const foundCount =
                        lostFoundStats.daily?.stats_founds?.[date] || 0;
                      return (
                        <div
                          key={date}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-xs"
                        >
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {date}
                          </span>
                          <div className="flex items-center gap-3 font-medium">
                            <span className="text-rose-500">
                              Hilang: {lostCount}
                            </span>
                            <span className="text-emerald-500">
                              Ditemukan: {foundCount}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Data statistik harian belum tersedia.
                </p>
              )}
            </div>

            {/* Monthly Stats Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Statistik Bulanan
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Perkembangan laporan berdasarkan bulan
              </p>

              {lostFoundStats?.monthly?.stats_losts ? (
                <div className="space-y-3">
                  {Object.entries(lostFoundStats.monthly.stats_losts).map(
                    ([month, lostCount]) => {
                      const foundCount =
                        lostFoundStats.monthly?.stats_founds?.[month] || 0;
                      return (
                        <div
                          key={month}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-xs"
                        >
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            Bulan {month}
                          </span>
                          <div className="flex items-center gap-3 font-medium">
                            <span className="text-rose-500">
                              Hilang: {lostCount}
                            </span>
                            <span className="text-emerald-500">
                              Ditemukan: {foundCount}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Data statistik bulanan belum tersedia.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Filter and Live Search Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Live Search */}
          <div className="relative flex-1">
            <IconSearch className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari judul barang, deskripsi, atau nama pelapor..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-lg"
              >
                Reset
              </button>
            )}
          </div>

          {/* View toggle (Grid / Table) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 self-end md:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Tampilan Kartu"
            >
              <IconLayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Tampilan Tabel"
            >
              <IconList className="w-4 h-4" />
              <span className="hidden sm:inline">Tabel</span>
            </button>
          </div>
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <IconFilter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {[
              { id: "all", label: "Semua Status" },
              { id: "lost", label: "Hilang" },
              { id: "found", label: "Temuan" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setStatusFilter(opt.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  statusFilter === opt.id
                    ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-sm font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Completion Status Filter */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {[
              { id: "all", label: "Semua Penyelesaian" },
              { id: "1", label: "Selesai" },
              { id: "0", label: "Dalam Proses" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setCompletedFilter(opt.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  completedFilter === opt.id
                    ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-sm font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Ownership Filter Toggle (is_me) */}
          <button
            onClick={() => setIsMeFilter(!isMeFilter)}
            className={`px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isMeFilter
                ? "bg-blue-50 dark:bg-blue-900/40 border-blue-500 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
            }`}
          >
            <span>Hanya Laporan Saya</span>
          </button>
        </div>
      </div>

      {/* Main List Section */}
      {isLostFound ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <IconLoader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
          <p className="text-sm font-medium">Memuat daftar laporan...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/60 p-8">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mb-4">
            <IconPackage className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Tidak ada laporan ditemukan
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Tidak ditemukan barang yang sesuai dengan kriteria pencarian atau filter yang dipilih.
          </p>
          <button
            onClick={() => onOpenAddModal && onOpenAddModal()}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            <span>Buat Laporan Baru</span>
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const coverUrl = item?.cover
              ? item.cover.startsWith("http")
                ? item.cover
                : `https://open-api.delcom.org/${item.cover}`
              : null;

            const isAuthor =
              profile && (profile.id === item.user_id || item.is_me === 1);

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Cover Photo */}
                <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 ${
                      coverUrl ? "hidden" : "flex"
                    }`}
                  >
                    <IconPhoto className="w-12 h-12 stroke-[1.2]" />
                    <span className="text-[11px] font-medium mt-1 text-slate-500 dark:text-slate-400">
                      Belum ada foto
                    </span>
                  </div>

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.status === "lost" ? (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-700 text-white backdrop-blur-md shadow-md">
                        Barang Hilang
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-700 text-white backdrop-blur-md shadow-md">
                        Barang Temuan
                      </span>
                    )}

                    {Number(item.is_completed) === 1 ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-700 text-white backdrop-blur-md flex items-center gap-1 shadow-md">
                        <IconCheck className="w-3 h-3" />
                        Selesai
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-700 text-white backdrop-blur-md flex items-center gap-1 shadow-md">
                        <IconClock className="w-3 h-3" />
                        Proses
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                      <span>Pelapor: {item?.author?.name || "Anonim"}</span>
                      <span>{formatDate(item.created_at, { day: "numeric", month: "short" })}</span>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/lost-founds/${item.id}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-blue-600 hover:text-white transition flex items-center justify-center gap-1.5"
                      >
                        <IconEye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setSelectedItemForCover(item)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-purple-600 hover:text-white transition cursor-pointer"
                        title="Ubah Foto Cover"
                      >
                        <IconPhoto className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedItemForEdit(item)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-amber-600 hover:text-white transition cursor-pointer"
                        title="Edit Informasi"
                      >
                        <IconEdit className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-rose-500 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                        title="Hapus Laporan"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">Barang</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Penyelesaian</th>
                  <th className="py-3.5 px-4">Pelapor</th>
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      <Link
                        to={`/lost-founds/${item.id}`}
                        className="hover:text-blue-600 flex items-center gap-2"
                      >
                        <span>{item.title}</span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.status === "lost" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-900/30 text-rose-600">
                          Hilang
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600">
                          Temuan
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {Number(item.is_completed) === 1 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">
                          Selesai
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-600">
                          Dalam Proses
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {item?.author?.name || "-"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {formatDate(item.created_at, { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/lost-founds/${item.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Lihat Detail"
                        >
                          <IconEye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setSelectedItemForCover(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition cursor-pointer"
                          title="Ubah Cover"
                        >
                          <IconPhoto className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedItemForEdit(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                          title="Ubah Data"
                        >
                          <IconEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                          title="Hapus"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      <ChangeModal
        isOpen={Boolean(selectedItemForEdit)}
        onClose={() => setSelectedItemForEdit(null)}
        item={selectedItemForEdit}
        onSuccess={() => fetchItems()}
      />

      {/* Change Cover Modal */}
      <ChangeCoverModal
        isOpen={Boolean(selectedItemForCover)}
        onClose={() => setSelectedItemForCover(null)}
        item={selectedItemForCover}
        onSuccess={() => fetchItems()}
      />
    </div>
  );
}
