import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, fireEvent } from "../../../test-utils";
import AddModal from "./AddModal";

describe("AddModal", () => {
  it("should not render when isOpen is false", () => {
    const { container } = renderWithProviders(
      <AddModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render form fields when isOpen is true", () => {
    renderWithProviders(<AddModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText("Tambah Laporan Baru")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Contoh: Dompet Kulit/i)).toBeInTheDocument();
    expect(screen.getByText("Kirim Laporan")).toBeInTheDocument();
  });

  it("should validate empty inputs on submit", async () => {
    renderWithProviders(<AddModal isOpen={true} onClose={vi.fn()} />);

    const submitBtn = screen.getByText("Kirim Laporan");
    fireEvent.click(submitBtn);

    expect(await screen.findByText("Judul laporan wajib diisi")).toBeInTheDocument();
  });
});
