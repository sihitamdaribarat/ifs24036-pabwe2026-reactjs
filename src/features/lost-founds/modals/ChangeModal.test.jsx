import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, fireEvent } from "../../../test-utils";
import ChangeModal from "./ChangeModal";

describe("ChangeModal", () => {
  const mockItem = {
    id: 12,
    title: "Jam Tangan Casio",
    description: "Hilang di perpustakaan",
    status: "lost",
    is_completed: 0,
  };

  it("should not render when isOpen is false", () => {
    const { container } = renderWithProviders(
      <ChangeModal isOpen={false} onClose={vi.fn()} item={mockItem} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should populate existing item data", () => {
    renderWithProviders(
      <ChangeModal isOpen={true} onClose={vi.fn()} item={mockItem} />
    );

    expect(screen.getByText("Ubah Informasi Laporan")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jam Tangan Casio")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hilang di perpustakaan")).toBeInTheDocument();
  });
});
