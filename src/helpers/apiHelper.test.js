import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getAccessToken,
  putAccessToken,
  buildUrl,
  fetchApi,
  BASE_URL,
} from "./apiHelper";

describe("apiHelper", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should return null if token does not exist in localStorage", () => {
    expect(getAccessToken()).toBeNull();
  });

  it("should store and retrieve token correctly", () => {
    putAccessToken("my-secret-token");
    expect(getAccessToken()).toBe("my-secret-token");

    putAccessToken(null);
    expect(getAccessToken()).toBeNull();
  });

  it("should build URL with query params correctly", () => {
    const url = buildUrl("/lost-founds", { status: "lost", is_completed: 1, empty: "" });
    expect(url).toContain("/lost-founds");
    expect(url).toContain("status=lost");
    expect(url).toContain("is_completed=1");
    expect(url).not.toContain("empty=");
  });

  it("should execute fetchApi successfully and attach Bearer token", async () => {
    putAccessToken("mock-token");
    const mockJson = { status: "success", data: { id: 1 } };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: (h) => (h === "content-type" ? "application/json" : null),
      },
      json: vi.fn().mockResolvedValue(mockJson),
    });

    const result = await fetchApi("/test-endpoint", {
      method: "POST",
      body: { name: "Test Item" },
    });

    expect(global.fetch).toHaveBeenCalled();
    const [callUrl, callOptions] = global.fetch.mock.calls[0];
    expect(callUrl).toContain("/test-endpoint");
    expect(callOptions.headers["Authorization"]).toBe("Bearer mock-token");
    expect(callOptions.headers["Content-Type"]).toBe("application/json");
    expect(result).toEqual(mockJson);
  });

  it("should throw an error on failed response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: {
        get: () => "application/json",
      },
      json: vi.fn().mockResolvedValue({ message: "Unauthenticated" }),
    });

    await expect(fetchApi("/protected")).rejects.toThrow("Unauthenticated");
  });
});
