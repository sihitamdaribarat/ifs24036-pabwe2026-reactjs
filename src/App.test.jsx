import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "./test-utils";
import App from "./App";
import * as apiHelper from "./helpers/apiHelper";

describe("App Routing and Integration", () => {
  it("should render LoginPage when navigating to /auth/login", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(<App />, {
      initialRoute: "/auth/login",
      preloadedState: {
        auth: { token: null },
      },
    });

    expect(screen.getByText("Masuk ke Akun")).toBeInTheDocument();
    expect(screen.getByText("Masuk Sekarang")).toBeInTheDocument();
  });

  it("should render RegisterPage when navigating to /auth/register", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(<App />, {
      initialRoute: "/auth/register",
      preloadedState: {
        auth: { token: null },
      },
    });

    expect(screen.getByText("Daftar Akun Baru")).toBeInTheDocument();
    expect(screen.getByText("Daftar Akun")).toBeInTheDocument();
  });

  it("should render HomePage in protected layout when authenticated", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("authenticated-jwt");

    renderWithProviders(<App />, {
      initialRoute: "/",
      preloadedState: {
        auth: { token: "authenticated-jwt" },
        users: { profile: { id: 1, name: "Admin Delcom" } },
        lostFounds: {
          lostFounds: [],
          isLostFound: false,
          lostFoundStats: { daily: null, monthly: null },
        },
      },
    });

    expect(screen.getByText("Laporan Barang Hilang & Ditemukan")).toBeInTheDocument();
    expect(screen.getByText("Total Laporan")).toBeInTheDocument();
  });
});
