import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, fireEvent } from "../../../test-utils";
import NavbarComponent from "./NavbarComponent";

describe("NavbarComponent", () => {
  it("should render application title and brand", () => {
    renderWithProviders(<NavbarComponent onToggleSidebar={vi.fn()} />, {
      preloadedState: {
        users: { profile: { name: "Deon Gideon", email: "deon@delcom.org" } },
      },
    });

    expect(screen.getByText("Delcom")).toBeInTheDocument();
    expect(screen.getByText("Lost & Found")).toBeInTheDocument();
    expect(screen.getByText("Deon Gideon")).toBeInTheDocument();
  });

  it("should trigger sidebar toggle on menu button click", () => {
    const toggleMock = vi.fn();
    renderWithProviders(<NavbarComponent onToggleSidebar={toggleMock} />);

    const menuBtn = screen.getByLabelText("Buka Menu");
    fireEvent.click(menuBtn);
    expect(toggleMock).toHaveBeenCalled();
  });
});
