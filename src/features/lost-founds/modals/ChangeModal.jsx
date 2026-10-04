import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncUpdateLostFound } from "../states/lostFoundSlice";
import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import { IconX, IconLoader2, IconEdit, IconCheck } from "@tabler/icons-react";

export default function ChangeModal({ isOpen, onClose, item, onSuccess }) {
  const dispatch = useDispatch();
  const { isLostFoundChange } = useSelector((state) => state.lostFounds);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("lost");
  const [isCompleted, setIsCompleted] = useState(0);

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setDescription(item.description || "");
      setStatus(item.status || "lost");
      setIsCompleted(Number(item.is_completed) || 0);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showErrorDialog("Judul dan deskripsi tidak boleh kosong");
      return;
    }

    const result = await dispatch(
      asyncUpdateLostFound({
        id: item.id,
        payload: {
          title: title.trim(),
          description: description.trim(),
          status,
          is_completed: isCompleted ? 1 : 0,
        },
      })
    );

    if (asyncUpdateLostFound.fulfilled.match(result)) {
      await showSuccessDialog("Laporan berhasil diperbarui!");
      if (onSuccess) onSuccess();
      onClose();
    } else {
      showErrorDialog(result.payload || "Gagal memperbarui laporan");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <IconEdit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Ubah Informasi Laporan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ID Laporan #{item.id}
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
                className={`py-2.5 px-4 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                  status === "lost"
                    ? "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/20"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Barang Hilang
              </button>
              <button
                type="button"
                onClick={() => setStatus("found")}
                className={`py-2.5 px-4 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                  status === "found"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Barang Temuan
              </button>
            </div>
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Judul Laporan
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Deskripsi Laporan
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          {/* Completed Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Status Penyelesaian
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tandai jika barang sudah berhasil dikembalikan / ditemukan
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCompleted(isCompleted ? 0 : 1)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                isCompleted ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                  isCompleted ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
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
              disabled={isLostFoundChange}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold shadow-lg shadow-amber-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLostFoundChange ? (
                <>
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <IconCheck className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
