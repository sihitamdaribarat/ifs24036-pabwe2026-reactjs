import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../../test-utils";
import AuthLayout from "./AuthLayout";

describe("AuthLayout", () => {
  it("should render branding for unauthenticated user", () => {
    renderWithProviders(<AuthLayout />, {
      preloadedState: {
        auth: { token: null },
      },
    });

    expect(screen.getByText("Delcom")).toBeInTheDocument();
    expect(screen.getByText("Lost & Found")).toBeInTheDocument();
    expect(screen.getByText("Terpercaya")).toBeInTheDocument();
  });
});
