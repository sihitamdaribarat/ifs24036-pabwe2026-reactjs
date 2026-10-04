import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, fireEvent } from "../../../test-utils";
import SidebarComponent from "./SidebarComponent";

describe("SidebarComponent", () => {
  it("should render navigation items", () => {
    renderWithProviders(
      <SidebarComponent
        isOpen={true}
        onClose={vi.fn()}
        onOpenAddModal={vi.fn()}
        activeTab="list"
      />
    );

    expect(screen.getByText("Dashboard Laporan")).toBeInTheDocument();
    expect(screen.getByText("Statistik")).toBeInTheDocument();
    expect(screen.getByText("Daftar Pengguna")).toBeInTheDocument();
    expect(screen.getByText("Profil Saya")).toBeInTheDocument();
    expect(screen.getByText("Tambah Laporan")).toBeInTheDocument();
  });

  it("should trigger onOpenAddModal when clicking Tambah Laporan", () => {
    const addMock = vi.fn();
    renderWithProviders(
      <SidebarComponent
        isOpen={true}
        onClose={vi.fn()}
        onOpenAddModal={addMock}
      />
    );

    const btn = screen.getByText("Tambah Laporan");
    fireEvent.click(btn);
    expect(addMock).toHaveBeenCalled();
  });
});
