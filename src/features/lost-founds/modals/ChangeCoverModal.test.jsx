import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "../../../test-utils";
import ChangeCoverModal from "./ChangeCoverModal";

describe("ChangeCoverModal", () => {
  const mockItem = {
    id: 15,
    title: "Kacamata Hitam",
    cover: null,
  };

  it("should not render when isOpen is false", () => {
    const { container } = renderWithProviders(
      <ChangeCoverModal isOpen={false} onClose={vi.fn()} item={mockItem} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render upload prompt when open", () => {
    renderWithProviders(
      <ChangeCoverModal isOpen={true} onClose={vi.fn()} item={mockItem} />
    );

    expect(screen.getByText("Ubah Cover Laporan")).toBeInTheDocument();
    expect(screen.getByText("Pilih berkas foto cover")).toBeInTheDocument();
  });
});
