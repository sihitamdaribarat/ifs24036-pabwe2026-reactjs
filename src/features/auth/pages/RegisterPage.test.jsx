import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, fireEvent } from "../../../test-utils";
import RegisterPage from "./RegisterPage";

describe("RegisterPage", () => {
  it("should render registration form elements", () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByText("Daftar Akun Baru")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Contoh: John Doe/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("nama@delcom.org")).toBeInTheDocument();
    expect(screen.getByText("Daftar Akun")).toBeInTheDocument();
  });

  it("should validate required fields on submit", async () => {
    renderWithProviders(<RegisterPage />);

    const submitBtn = screen.getByText("Daftar Akun");
    fireEvent.click(submitBtn);

    expect(await screen.findByText("Nama lengkap wajib diisi")).toBeInTheDocument();
    expect(await screen.findByText("Email wajib diisi")).toBeInTheDocument();
  });
});
