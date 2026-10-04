import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi, logoutApi } from "../api/authApi";
import { getAccessToken, putAccessToken } from "../../../helpers/apiHelper";

export const asyncAuthLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginApi({ email, password });
      const token = response?.data?.token;
      if (token) {
        putAccessToken(token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal melakukan login"
      );
    }
  }
);

export const asyncAuthRegister = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await registerApi({ name, email, password });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal melakukan registrasi"
      );
    }
  }
);

export const asyncAuthLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch {
      // Even if API fails, still clear local token
    } finally {
      putAccessToken(null);
    }
    return true;
  }
);

const initialState = {
  isAuthLogin: false,
  isAuthRegister: false,
  isAuthLogout: false,
  user: null,
  token: getAccessToken() || null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthLogin: (state, action) => {
      state.isAuthLogin = action.payload;
    },
    setIsAuthRegister: (state, action) => {
      state.isAuthRegister = action.payload;
    },
    setIsAuthLogout: (state, action) => {
      state.isAuthLogout = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetAuthStatus: (state) => {
      state.isAuthLogin = false;
      state.isAuthRegister = false;
      state.isAuthLogout = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(asyncAuthLogin.pending, (state) => {
        state.isAuthLogin = true;
        state.error = null;
      })
      .addCase(asyncAuthLogin.fulfilled, (state, action) => {
        state.isAuthLogin = false;
        state.token = action.payload?.token || null;
        state.user = action.payload?.user || null;
        state.error = null;
      })
      .addCase(asyncAuthLogin.rejected, (state, action) => {
        state.isAuthLogin = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(asyncAuthRegister.pending, (state) => {
        state.isAuthRegister = true;
        state.error = null;
      })
      .addCase(asyncAuthRegister.fulfilled, (state) => {
        state.isAuthRegister = false;
        state.error = null;
      })
      .addCase(asyncAuthRegister.rejected, (state, action) => {
        state.isAuthRegister = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(asyncAuthLogout.pending, (state) => {
        state.isAuthLogout = true;
      })
      .addCase(asyncAuthLogout.fulfilled, (state) => {
        state.isAuthLogout = false;
        state.token = null;
        state.user = null;
      })
      .addCase(asyncAuthLogout.rejected, (state) => {
        state.isAuthLogout = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const {
  setIsAuthLogin,
  setIsAuthRegister,
  setIsAuthLogout,
  setUser,
  resetAuthStatus,
} = authSlice.actions;

export default authSlice.reducer;
