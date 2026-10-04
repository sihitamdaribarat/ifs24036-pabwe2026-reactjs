import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUsersApi,
  getUserByIdApi,
  getProfileApi,
  updateProfileApi,
  changePhotoProfileApi,
  changePasswordApi,
} from "../api/userApi";

export const asyncGetUsers = createAsyncThunk(
  "users/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUsersApi();
      return response?.data?.users || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal mengambil daftar pengguna"
      );
    }
  }
);

export const asyncGetUserById = createAsyncThunk(
  "users/getUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getUserByIdApi(id);
      return response?.data?.user || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal mengambil data pengguna"
      );
    }
  }
);

export const asyncGetProfile = createAsyncThunk(
  "users/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfileApi();
      return response?.data?.user || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal mengambil profil"
      );
    }
  }
);

export const asyncUpdateProfile = createAsyncThunk(
  "users/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updateProfileApi(payload);
      return response?.data?.user || response?.data || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal memperbarui profil"
      );
    }
  }
);

export const asyncChangePhotoProfile = createAsyncThunk(
  "users/changePhotoProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await changePhotoProfileApi(formData);
      return response?.data?.user || response?.data || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal mengubah foto profil"
      );
    }
  }
);

export const asyncChangePassword = createAsyncThunk(
  "users/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await changePasswordApi(payload);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal mengubah kata sandi"
      );
    }
  }
);

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

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setIsProfile: (state, action) => {
      state.isProfile = action.payload;
    },
    setIsChangeProfile: (state, action) => {
      state.isChangeProfile = action.payload;
    },
    setIsChangeProfilePhoto: (state, action) => {
      state.isChangeProfilePhoto = action.payload;
    },
    setIsChangeProfilePassword: (state, action) => {
      state.isChangeProfilePassword = action.payload;
    },
    resetUserStatuses: (state) => {
      state.isChangeProfile = false;
      state.isChangeProfilePhoto = false;
      state.isChangeProfilePassword = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Users
    builder
      .addCase(asyncGetUsers.pending, (state) => {
        state.error = null;
      })
      .addCase(asyncGetUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(asyncGetUsers.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Get User By Id
    builder
      .addCase(asyncGetUserById.fulfilled, (state, action) => {
        state.user = action.payload;
      });

    // Get Profile
    builder
      .addCase(asyncGetProfile.pending, (state) => {
        state.isProfile = true;
        state.error = null;
      })
      .addCase(asyncGetProfile.fulfilled, (state, action) => {
        state.isProfile = false;
        state.profile = action.payload;
      })
      .addCase(asyncGetProfile.rejected, (state, action) => {
        state.isProfile = false;
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(asyncUpdateProfile.pending, (state) => {
        state.isChangeProfile = true;
        state.error = null;
      })
      .addCase(asyncUpdateProfile.fulfilled, (state, action) => {
        state.isChangeProfile = false;
        if (action.payload) {
          state.profile = { ...state.profile, ...action.payload };
        }
      })
      .addCase(asyncUpdateProfile.rejected, (state, action) => {
        state.isChangeProfile = false;
        state.error = action.payload;
      });

    // Change Photo Profile
    builder
      .addCase(asyncChangePhotoProfile.pending, (state) => {
        state.isChangeProfilePhoto = true;
        state.error = null;
      })
      .addCase(asyncChangePhotoProfile.fulfilled, (state, action) => {
        state.isChangeProfilePhoto = false;
        if (action.payload?.photo) {
          state.profile = { ...state.profile, photo: action.payload.photo };
        }
      })
      .addCase(asyncChangePhotoProfile.rejected, (state, action) => {
        state.isChangeProfilePhoto = false;
        state.error = action.payload;
      });

    // Change Password
    builder
      .addCase(asyncChangePassword.pending, (state) => {
        state.isChangeProfilePassword = true;
        state.error = null;
      })
      .addCase(asyncChangePassword.fulfilled, (state) => {
        state.isChangeProfilePassword = false;
      })
      .addCase(asyncChangePassword.rejected, (state, action) => {
        state.isChangeProfilePassword = false;
        state.error = action.payload;
      });
  },
});

export const {
  setUsers,
  setUser,
  setProfile,
  setIsProfile,
  setIsChangeProfile,
  setIsChangeProfilePhoto,
  setIsChangeProfilePassword,
  resetUserStatuses,
} = userSlice.actions;

export default userSlice.reducer;
