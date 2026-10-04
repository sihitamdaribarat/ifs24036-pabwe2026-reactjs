import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../../test-utils";
import DetailPage from "./DetailPage";

describe("DetailPage", () => {
  it("should render item detail with title, description, and status", () => {
    const mockDetail = {
      id: 5,
      title: "Laptop Asus ROG",
      description: "Tertinggal di Lab Komputer Lantai 2",
      status: "lost",
      is_completed: 0,
      created_at: "2026-10-04T12:00:00Z",
      author: { name: "Budi Santoso", photo: null },
    };

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        lostFounds: {
          lostFound: mockDetail,
          isLostFound: false,
        },
      },
    });

    expect(screen.getByText("Laptop Asus ROG")).toBeInTheDocument();
    expect(screen.getByText("Tertinggal di Lab Komputer Lantai 2")).toBeInTheDocument();
    expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    expect(screen.getByText("Barang Hilang")).toBeInTheDocument();
    expect(screen.getByText("Dalam Proses")).toBeInTheDocument();
  });
});
