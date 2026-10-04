import { describe, it, expect } from "vitest";
import store from "./store";

describe("Redux Store Integration", () => {
  it("should initialize store with auth, users, and lostFounds reducers", () => {
    const state = store.getState();
    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("users");
    expect(state).toHaveProperty("lostFounds");

    expect(state.auth.isAuthLogin).toBe(false);
    expect(Array.isArray(state.users.users)).toBe(true);
    expect(Array.isArray(state.lostFounds.lostFounds)).toBe(true);
  });
});
