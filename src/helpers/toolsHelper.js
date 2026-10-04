import Swal from "sweetalert2";

/**
 * Display interactive success dialog using SweetAlert2
 * @param {string} message - Message body
 * @param {string} [title="Berhasil!"] - Title header
 * @returns {Promise<any>}
 */
export function showSuccessDialog(message, title = "Berhasil!") {
  return Swal.fire({
    icon: "success",
    title,
    text: message,
    confirmButtonColor: "#2563eb",
    timer: 2500,
    timerProgressBar: true,
  });
}

/**
 * Display interactive error dialog using SweetAlert2
 * @param {string} message - Message body or validation error
 * @param {string} [title="Terjadi Kesalahan"] - Title header
 * @returns {Promise<any>}
 */
export function showErrorDialog(message, title = "Terjadi Kesalahan") {
  return Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonColor: "#ef4444",
  });
}

/**
 * Display interactive confirmation dialog using SweetAlert2
 * @param {string} message - Question/confirmation message
 * @param {string} [title="Apakah Anda Yakin?"] - Title header
 * @param {string} [confirmButtonText="Ya, Lanjutkan"] - Text for confirm button
 * @param {string} [cancelButtonText="Batal"] - Text for cancel button
 * @returns {Promise<boolean>} - Resolves true if confirmed, false otherwise
 */
export async function showConfirmDialog(
  message,
  title = "Apakah Anda Yakin?",
  confirmButtonText = "Ya, Lanjutkan",
  cancelButtonText = "Batal"
) {
  const result = await Swal.fire({
    icon: "warning",
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#64748b",
    reverseButtons: true,
  });

  return result.isConfirmed;
}

/**
 * Format timestamp or date string to readable Indonesian format
 * @param {string|Date} dateString - Raw date string
 * @param {Intl.DateTimeFormatOptions} [customOptions] - Custom options
 * @returns {string} - Formatted date string
 */
export function formatDate(dateString, customOptions) {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);

    const defaultOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return new Intl.DateTimeFormat("id-ID", customOptions || defaultOptions).format(date);
  } catch {
    return String(dateString);
  }
}
