import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, fireEvent } from "../../../test-utils";
import LoginPage from "./LoginPage";

describe("LoginPage", () => {
  it("should render login form elements", () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText("Masuk ke Akun")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("nama@delcom.org")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByText("Masuk Sekarang")).toBeInTheDocument();
  });

  it("should display validation errors when submitting empty form", async () => {
    renderWithProviders(<LoginPage />);

    const submitBtn = screen.getByText("Masuk Sekarang");
    fireEvent.click(submitBtn);

    expect(await screen.findByText("Email wajib diisi")).toBeInTheDocument();
    expect(await screen.findByText("Kata sandi wajib diisi")).toBeInTheDocument();
  });
});
