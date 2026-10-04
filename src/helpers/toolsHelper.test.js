import { describe, it, expect, vi, beforeEach } from "vitest";
import Swal from "sweetalert2";
import {
  showSuccessDialog,
  showErrorDialog,
  showConfirmDialog,
  formatDate,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe("toolsHelper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should trigger Swal.fire for showSuccessDialog", () => {
    showSuccessDialog("Operasi berhasil", "Sukses");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "success",
        title: "Sukses",
        text: "Operasi berhasil",
      })
    );
  });

  it("should trigger Swal.fire for showErrorDialog", () => {
    showErrorDialog("Terjadi error", "Error");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "error",
        title: "Error",
        text: "Terjadi error",
      })
    );
  });

  it("should return true when confirmed in showConfirmDialog", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    const result = await showConfirmDialog("Yakin?", "Konfirmasi");
    expect(result).toBe(true);
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "warning",
        title: "Konfirmasi",
        text: "Yakin?",
      })
    );
  });

  it("should return false when cancelled in showConfirmDialog", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: false });
    const result = await showConfirmDialog("Yakin?");
    expect(result).toBe(false);
  });

  it("should format date string correctly", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate("")).toBe("-");

    const formatted = formatDate("2026-10-04T10:00:00Z");
    expect(formatted).toBeDefined();
    expect(typeof formatted).toBe("string");
  });
});
