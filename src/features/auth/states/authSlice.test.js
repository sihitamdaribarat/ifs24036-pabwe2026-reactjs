import { describe, it, expect, vi, beforeEach } from "vitest";
import authReducer, {
  setIsAuthLogin,
  setIsAuthRegister,
  setIsAuthLogout,
  setUser,
  resetAuthStatus,
  asyncAuthLogin,
  asyncAuthRegister,
  asyncAuthLogout,
} from "./authSlice";
import * as authApi from "../api/authApi";
import * as apiHelper from "../../../helpers/apiHelper";

vi.mock("../api/authApi");
vi.mock("../../../helpers/apiHelper", () => ({
  getAccessToken: vi.fn(() => null),
  putAccessToken: vi.fn(),
}));

describe("authSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const initialState = {
    isAuthLogin: false,
    isAuthRegister: false,
    isAuthLogout: false,
    user: null,
    token: null,
    error: null,
  };

  it("should handle initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle setter actions", () => {
    let state = authReducer(initialState, setIsAuthLogin(true));
    expect(state.isAuthLogin).toBe(true);

    state = authReducer(state, setIsAuthRegister(true));
    expect(state.isAuthRegister).toBe(true);

    state = authReducer(state, setIsAuthLogout(true));
    expect(state.isAuthLogout).toBe(true);

    state = authReducer(state, setUser({ id: 1, name: "Test" }));
    expect(state.user).toEqual({ id: 1, name: "Test" });

    state = authReducer(state, resetAuthStatus());
    expect(state.isAuthLogin).toBe(false);
    expect(state.isAuthRegister).toBe(false);
    expect(state.isAuthLogout).toBe(false);
  });

  it("should handle asyncAuthLogin pending and fulfilled", async () => {
    const mockUser = { id: 1, name: "User" };
    authApi.loginApi.mockResolvedValue({
      data: { token: "token123", user: mockUser },
    });

    const dispatch = vi.fn();
    const thunk = asyncAuthLogin({ email: "test@delcom.org", password: "123" });
    await thunk(dispatch, () => ({ auth: initialState }), undefined);

    let state = authReducer(initialState, { type: asyncAuthLogin.pending.type });
    expect(state.isAuthLogin).toBe(true);

    state = authReducer(state, {
      type: asyncAuthLogin.fulfilled.type,
      payload: { token: "token123", user: mockUser },
    });
    expect(state.isAuthLogin).toBe(false);
    expect(state.token).toBe("token123");
    expect(state.user).toEqual(mockUser);
  });

  it("should handle asyncAuthLogin rejected", () => {
    const state = authReducer(initialState, {
      type: asyncAuthLogin.rejected.type,
      payload: "Kredensial salah",
    });
    expect(state.isAuthLogin).toBe(false);
    expect(state.error).toBe("Kredensial salah");
  });

  it("should handle asyncAuthLogout fulfilled", () => {
    const loggedInState = {
      ...initialState,
      token: "active-token",
      user: { name: "User" },
    };

    const state = authReducer(loggedInState, {
      type: asyncAuthLogout.fulfilled.type,
    });
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });
});
