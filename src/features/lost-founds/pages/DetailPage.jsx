import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncGetLostFoundById,
  asyncDeleteLostFound,
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
  IconArrowLeft,
  IconClock,
  IconCheck,
  IconAlertCircle,
  IconPhoto,
  IconEdit,
  IconTrash,
  IconUser,
  IconCalendar,
  IconLoader2,
  IconFileDescription,
} from "@tabler/icons-react";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { lostFound, isLostFound } = useSelector((state) => state.lostFounds);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [coverModalOpen, setCoverModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(asyncGetLostFoundById(id));
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!lostFound) return;
    const confirmed = await showConfirmDialog(
      `Hapus permanen laporan "${lostFound.title}"?`,
      "Konfirmasi Penghapusan",
      "Ya, Hapus Sekarang"
    );

    if (confirmed) {
      const result = await dispatch(asyncDeleteLostFound(lostFound.id));
      if (asyncDeleteLostFound.fulfilled.match(result)) {
        await showSuccessDialog("Laporan berhasil dihapus!");
        navigate("/");
      } else {
        showErrorDialog(result.payload || "Gagal menghapus laporan");
      }
    }
  };

  if (isLostFound) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-slate-400">
        <IconLoader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
        <p className="text-sm font-semibold">Memuat rincian laporan...</p>
      </div>
    );
  }

  if (!lostFound) {
    return (
      <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/60 p-8">
        <IconAlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Laporan Tidak Ditemukan
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Laporan barang mungkin telah dihapus atau ID tidak valid.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
        >
          <IconArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    );
  }

  const coverUrl = lostFound?.cover
    ? lostFound.cover.startsWith("http")
      ? lostFound.cover
      : `https://open-api.delcom.org/${lostFound.cover}`
    : null;

  const authorAvatarUrl = lostFound?.author?.photo
    ? lostFound.author.photo.startsWith("http")
      ? lostFound.author.photo
      : `https://open-api.delcom.org/${lostFound.author.photo}`
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <IconArrowLeft className="w-4 h-4" />
          <span>Kembali ke Semua Laporan</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCoverModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 text-xs font-semibold hover:bg-purple-100 transition flex items-center gap-1.5 cursor-pointer"
          >
            <IconPhoto className="w-4 h-4" />
            <span className="hidden sm:inline">Ubah Cover</span>
          </button>

          <button
            type="button"
            onClick={() => setEditModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-semibold hover:bg-amber-100 transition flex items-center gap-1.5 cursor-pointer"
          >
            <IconEdit className="w-4 h-4" />
            <span className="hidden sm:inline">Edit Data</span>
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-semibold hover:bg-rose-100 transition flex items-center gap-1.5 cursor-pointer"
          >
            <IconTrash className="w-4 h-4" />
            <span className="hidden sm:inline">Hapus</span>
          </button>
        </div>
      </div>

      {/* Main Detail Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-xl overflow-hidden">
        {/* Adaptive Ratio Cover Photo */}
        <div className="relative w-full max-h-[460px] bg-slate-900 flex items-center justify-center overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={lostFound.title}
              className="w-full h-full object-contain max-h-[460px]"
            />
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500">
              <IconPhoto className="w-16 h-16 stroke-1 mb-2" />
              <p className="text-xs font-medium text-slate-400 dark:text-slate-300">Laporan ini belum memiliki foto cover</p>
              <button
                onClick={() => setCoverModalOpen(true)}
                className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition cursor-pointer"
              >
                + Tambah Foto Sekarang
              </button>
            </div>
          )}

          {/* Status Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {lostFound.status === "lost" ? (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-lg backdrop-blur-md">
                Barang Hilang
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-lg backdrop-blur-md">
                Barang Temuan
              </span>
            )}

            {Number(lostFound.is_completed) === 1 ? (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-lg backdrop-blur-md flex items-center gap-1.5">
                <IconCheck className="w-3.5 h-3.5" />
                Sudah Selesai
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-700 text-white shadow-lg backdrop-blur-md flex items-center gap-1.5">
                <IconClock className="w-3.5 h-3.5" />
                Dalam Proses
              </span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              ID Laporan #{lostFound.id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {lostFound.title}
            </h1>
          </div>

          {/* Reporter & Metadata Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {authorAvatarUrl ? (
                <img
                  src={authorAvatarUrl}
                  alt={lostFound.author?.name || "Pelapor"}
                  className="w-11 h-11 rounded-2xl object-cover ring-2 ring-blue-500/20"
                />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center">
                  <IconUser className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="text-xs text-slate-400">Dilaporkan Oleh</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {lostFound?.author?.name || "Anonim / Pengguna Sistem"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <IconCalendar className="w-4 h-4 text-slate-400" />
                <span>Tanggal: {formatDate(lostFound.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <IconFileDescription className="w-4 h-4 text-blue-500" />
              <span>Deskripsi Lengkap &amp; Ciri-ciri</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {lostFound.description}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <ChangeModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={lostFound}
        onSuccess={() => dispatch(asyncGetLostFoundById(id))}
      />

      {/* Change Cover Modal */}
      <ChangeCoverModal
        isOpen={coverModalOpen}
        onClose={() => setCoverModalOpen(false)}
        item={lostFound}
        onSuccess={() => dispatch(asyncGetLostFoundById(id))}
      />
    </div>
  );
}
