import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginApi, registerApi, logoutApi } from "./authApi";
import * as apiHelper from "../../../helpers/apiHelper";

vi.mock("../../../helpers/apiHelper", () => ({
  fetchApi: vi.fn(),
}));

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call loginApi with POST /auth/login and body", async () => {
    apiHelper.fetchApi.mockResolvedValue({ status: "success" });
    const result = await loginApi({ email: "test@delcom.org", password: "secret" });

    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: { email: "test@delcom.org", password: "secret" },
    });
    expect(result).toEqual({ status: "success" });
  });

  it("should call registerApi with POST /auth/register and body", async () => {
    apiHelper.fetchApi.mockResolvedValue({ status: "success" });
    const result = await registerApi({
      name: "John",
      email: "john@delcom.org",
      password: "secret",
    });

    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      body: { name: "John", email: "john@delcom.org", password: "secret" },
    });
    expect(result).toEqual({ status: "success" });
  });

  it("should call logoutApi with POST /auth/logout", async () => {
    apiHelper.fetchApi.mockResolvedValue({ status: "success" });
    const result = await logoutApi();

    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/auth/logout", {
      method: "POST",
    });
    expect(result).toEqual({ status: "success" });
  });
});
