import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncChangeCoverLostFound } from "../states/lostFoundSlice";
import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import {
  IconX,
  IconLoader2,
  IconPhoto,
  IconUpload,
  IconCheck,
} from "@tabler/icons-react";

export default function ChangeCoverModal({ isOpen, onClose, item, onSuccess }) {
  const dispatch = useDispatch();
  const { isLostFoundChangeCover } = useSelector((state) => state.lostFounds);

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen || !item) return null;

  const currentCoverUrl = item?.cover
    ? item.cover.startsWith("http")
      ? item.cover
      : `https://open-api.delcom.org/${item.cover}`
    : null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showErrorDialog("Silakan pilih file gambar cover terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.append("cover", selectedFile);

    const result = await dispatch(
      asyncChangeCoverLostFound({
        id: item.id,
        formData,
      })
    );

    if (asyncChangeCoverLostFound.fulfilled.match(result)) {
      await showSuccessDialog("Foto cover berhasil diunggah!");
      setPreview(null);
      setSelectedFile(null);
      if (onSuccess) onSuccess();
      onClose();
    } else {
      showErrorDialog(result.payload || "Gagal mengunggah foto cover");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <IconPhoto className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Ubah Cover Laporan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Laporan #{item.id} - {item.title}
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Live Preview / Drop Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/20 dark:hover:bg-purple-950/20 transition min-h-56 relative overflow-hidden"
          >
            {preview ? (
              <div className="w-full h-full flex flex-col items-center">
                <img
                  src={preview}
                  alt="Pratinjau Cover Baru"
                  className="max-h-56 w-auto object-contain rounded-xl shadow-md"
                />
                <p className="mt-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                  Pratinjau Foto Baru (Klik untuk ganti)
                </p>
              </div>
            ) : currentCoverUrl ? (
              <div className="w-full h-full flex flex-col items-center">
                <img
                  src={currentCoverUrl}
                  alt="Cover Sekarang"
                  className="max-h-56 w-auto object-contain rounded-xl shadow-md"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Cover saat ini. Klik untuk memilih foto baru.
                </p>
              </div>
            ) : (
              <div className="text-center p-6">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                  <IconUpload className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Pilih berkas foto cover
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Format PNG, JPG, JPEG (Maks. 2MB)
                </p>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
              <span className="truncate max-w-[260px] font-medium">
                {selectedFile.name}
              </span>
              <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLostFoundChangeCover || !selectedFile}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLostFoundChangeCover ? (
                <>
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                  <span>Mengunggah...</span>
                </>
              ) : (
                <>
                  <IconCheck className="w-4 h-4" />
                  <span>Unggah Cover</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
