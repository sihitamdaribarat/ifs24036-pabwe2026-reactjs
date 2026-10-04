import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncAddLostFound } from "../states/lostFoundSlice";
import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import { IconX, IconLoader2, IconPlus, IconAlertCircle } from "@tabler/icons-react";

export default function AddModal({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { isLostFoundAdd } = useSelector((state) => state.lostFounds);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("lost");
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Judul laporan wajib diisi";
    if (!description.trim()) errs.description = "Deskripsi laporan wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(
      asyncAddLostFound({
        title: title.trim(),
        description: description.trim(),
        status,
      })
    );

    if (asyncAddLostFound.fulfilled.match(result)) {
      await showSuccessDialog("Laporan berhasil ditambahkan!");
      setTitle("");
      setDescription("");
      setStatus("lost");
      setErrors({});
      if (onSuccess) onSuccess();
      onClose();
    } else {
      showErrorDialog(result.payload || "Gagal menambahkan laporan");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <IconPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Tambah Laporan Baru
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Publikasikan barang yang hilang atau ditemukan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Status Segment */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Jenis Laporan
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus("lost")}
                className={`py-3 px-4 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                  status === "lost"
                    ? "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/20"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Barang Hilang (Lost)
              </button>
              <button
                type="button"
                onClick={() => setStatus("found")}
                className={`py-3 px-4 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                  status === "found"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Barang Temuan (Found)
              </button>
            </div>
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Nama / Judul Barang
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Dompet Kulit Hitam, Kunci Motor Honda"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition ${
                errors.title
                  ? "border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <IconAlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Deskripsi &amp; Lokasi Terakhir
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan ciri-ciri barang, lokasi hilang/ditemukan, dan kontak yang dapat dihubungi..."
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition resize-none ${
                errors.description
                  ? "border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <IconAlertCircle className="w-3.5 h-3.5" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLostFoundAdd}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLostFoundAdd ? (
                <>
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Kirim Laporan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
