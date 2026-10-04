import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "../../../test-utils";
import UsersPage from "./UsersPage";
import * as apiHelper from "../../../helpers/apiHelper";

vi.mock("../../../helpers/apiHelper", () => ({
  fetchApi: vi.fn(),
  getAccessToken: vi.fn(() => "mock-token"),
  putAccessToken: vi.fn(),
  formatDate: (d) => String(d),
}));

describe("UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render users list header and user cards", async () => {
    const mockUsers = [
      { id: 1, name: "Deon Gideon", email: "deon@delcom.org", photo: null },
      { id: 2, name: "Sarah Jane", email: "sarah@delcom.org", photo: null },
    ];

    apiHelper.fetchApi.mockResolvedValue({
      status: "success",
      data: { users: mockUsers },
    });

    renderWithProviders(<UsersPage />, {
      preloadedState: {
        users: { users: mockUsers },
      },
    });

    expect(screen.getByText("Daftar Pengguna Sistem")).toBeInTheDocument();
    expect(await screen.findByText("Deon Gideon")).toBeInTheDocument();
    expect(await screen.findByText("Sarah Jane")).toBeInTheDocument();
  });
});
