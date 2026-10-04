import { describe, it, expect } from "vitest";
import userReducer, {
  setUsers,
  setUser,
  setProfile,
  setIsProfile,
  setIsChangeProfile,
  setIsChangeProfilePhoto,
  setIsChangeProfilePassword,
  resetUserStatuses,
  asyncGetUsers,
  asyncGetProfile,
  asyncUpdateProfile,
  asyncChangePhotoProfile,
  asyncChangePassword,
} from "./userSlice";

describe("userSlice", () => {
  const initialState = {
    users: [],
    user: null,
    profile: null,
    isProfile: false,
    isChangeProfile: false,
    isChangeProfilePhoto: false,
    isChangeProfilePassword: false,
    error: null,
  };

  it("should handle initial state", () => {
    expect(userReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle setters and resetUserStatuses", () => {
    let state = userReducer(initialState, setUsers([{ id: 1 }]));
    expect(state.users).toHaveLength(1);

    state = userReducer(state, setUser({ id: 2 }));
    expect(state.user).toEqual({ id: 2 });

    state = userReducer(state, setProfile({ id: 3, name: "Me" }));
    expect(state.profile).toEqual({ id: 3, name: "Me" });

    state = userReducer(state, setIsProfile(true));
    expect(state.isProfile).toBe(true);

    state = userReducer(state, setIsChangeProfile(true));
    state = userReducer(state, setIsChangeProfilePhoto(true));
    state = userReducer(state, setIsChangeProfilePassword(true));
    expect(state.isChangeProfile).toBe(true);
    expect(state.isChangeProfilePhoto).toBe(true);
    expect(state.isChangeProfilePassword).toBe(true);

    state = userReducer(state, resetUserStatuses());
    expect(state.isChangeProfile).toBe(false);
    expect(state.isChangeProfilePhoto).toBe(false);
    expect(state.isChangeProfilePassword).toBe(false);
  });

  it("should handle asyncGetUsers fulfilled", () => {
    const users = [{ id: 1, name: "User 1" }];
    const state = userReducer(initialState, {
      type: asyncGetUsers.fulfilled.type,
      payload: users,
    });
    expect(state.users).toEqual(users);
  });

  it("should handle asyncGetProfile pending and fulfilled", () => {
    let state = userReducer(initialState, {
      type: asyncGetProfile.pending.type,
    });
    expect(state.isProfile).toBe(true);

    state = userReducer(state, {
      type: asyncGetProfile.fulfilled.type,
      payload: { id: 10, name: "John" },
    });
    expect(state.isProfile).toBe(false);
    expect(state.profile).toEqual({ id: 10, name: "John" });
  });

  it("should handle asyncUpdateProfile fulfilled", () => {
    const baseState = { ...initialState, profile: { id: 1, name: "Old" } };
    const state = userReducer(baseState, {
      type: asyncUpdateProfile.fulfilled.type,
      payload: { name: "New" },
    });
    expect(state.profile.name).toBe("New");
  });

  it("should handle asyncChangePhotoProfile fulfilled", () => {
    const baseState = { ...initialState, profile: { id: 1, photo: "old.jpg" } };
    const state = userReducer(baseState, {
      type: asyncChangePhotoProfile.fulfilled.type,
      payload: { photo: "new.jpg" },
    });
    expect(state.profile.photo).toBe("new.jpg");
  });

  it("should handle asyncChangePassword pending and fulfilled", () => {
    let state = userReducer(initialState, {
      type: asyncChangePassword.pending.type,
    });
    expect(state.isChangeProfilePassword).toBe(true);

    state = userReducer(state, {
      type: asyncChangePassword.fulfilled.type,
    });
    expect(state.isChangeProfilePassword).toBe(false);
  });
});
