import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "../../../test-utils";
import HomePage from "./HomePage";
import * as apiHelper from "../../../helpers/apiHelper";

vi.mock("../../../helpers/apiHelper", () => ({
  fetchApi: vi.fn(),
  getAccessToken: vi.fn(() => "mock-token"),
  putAccessToken: vi.fn(),
  formatDate: (d) => String(d),
}));

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render metric summary cards and lost & found list", async () => {
    const mockLostFounds = [
      {
        id: 1,
        title: "Kunci Motor Honda",
        description: "Hilang dekat kantin",
        status: "lost",
        is_completed: 0,
        author: { name: "Pelapor 1" },
      },
    ];

    apiHelper.fetchApi.mockResolvedValue({
      status: "success",
      data: {
        lost_founds: mockLostFounds,
      },
    });

    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: {
          lostFounds: mockLostFounds,
          isLostFound: false,
          lostFoundStats: { daily: null, monthly: null },
        },
      },
    });

    expect(screen.getByText("Total Laporan")).toBeInTheDocument();
    expect(screen.getByText("Barang Hilang")).toBeInTheDocument();
    expect(screen.getByText("Barang Ditemukan")).toBeInTheDocument();
    expect(screen.getByText("Kasus Selesai")).toBeInTheDocument();

    expect(await screen.findByText("Kunci Motor Honda")).toBeInTheDocument();
  });
});
