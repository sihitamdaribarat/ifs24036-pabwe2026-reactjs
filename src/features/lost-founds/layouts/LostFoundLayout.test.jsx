import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "../../../test-utils";
import LostFoundLayout from "./LostFoundLayout";
import * as apiHelper from "../../../helpers/apiHelper";

describe("LostFoundLayout", () => {
  it("should render layout with navbar and sidebar for authenticated user", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");

    renderWithProviders(<LostFoundLayout />, {
      preloadedState: {
        auth: { token: "valid-token" },
        users: { profile: { id: 1, name: "Admin" } },
      },
    });

    expect(screen.getByText("Delcom")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Laporan")).toBeInTheDocument();
  });
});
