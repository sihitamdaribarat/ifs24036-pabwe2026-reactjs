import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../../test-utils";
import ProfilePage from "./ProfilePage";

describe("ProfilePage", () => {
  it("should render profile information and password update form", () => {
    const mockProfile = {
      id: 3,
      name: "Deon Gideon",
      email: "deon@delcom.org",
      photo: null,
    };

    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: { profile: mockProfile },
      },
    });

    expect(screen.getByText("Informasi Profil")).toBeInTheDocument();
    expect(screen.getByText("Ganti Kata Sandi")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Deon Gideon")).toBeInTheDocument();
    expect(screen.getByDisplayValue("deon@delcom.org")).toBeInTheDocument();
  });
});
