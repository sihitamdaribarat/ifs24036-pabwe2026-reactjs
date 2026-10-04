import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getLostFoundsApi,
  getLostFoundByIdApi,
  addLostFoundApi,
  updateLostFoundApi,
  changeCoverLostFoundApi,
  deleteLostFoundApi,
  getDailyStatsApi,
  getMonthlyStatsApi,
} from "../api/lostFoundApi";

export const asyncGetLostFounds = createAsyncThunk(
  "lostFounds/getLostFounds",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getLostFoundsApi(params);
      return response?.data?.lost_founds || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal mengambil daftar laporan"
      );
    }
  }
);

export const asyncGetLostFoundById = createAsyncThunk(
  "lostFounds/getLostFoundById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getLostFoundByIdApi(id);
      return response?.data?.lost_found || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal mengambil detail laporan"
      );
    }
  }
);

export const asyncAddLostFound = createAsyncThunk(
  "lostFounds/addLostFound",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await addLostFoundApi(payload);
      return response?.data || response;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal menambahkan laporan"
      );
    }
  }
);

export const asyncUpdateLostFound = createAsyncThunk(
  "lostFounds/updateLostFound",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await updateLostFoundApi(id, payload);
      return { id, payload, response };
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal memperbarui laporan"
      );
    }
  }
);

export const asyncChangeCoverLostFound = createAsyncThunk(
  "lostFounds/changeCoverLostFound",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await changeCoverLostFoundApi(id, formData);
      return { id, response };
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal mengubah foto cover"
      );
    }
  }
);

export const asyncDeleteLostFound = createAsyncThunk(
  "lostFounds/deleteLostFound",
  async (id, { rejectWithValue }) => {
    try {
      await deleteLostFoundApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal menghapus laporan"
      );
    }
  }
);

export const asyncGetDailyStats = createAsyncThunk(
  "lostFounds/getDailyStats",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getDailyStatsApi(params);
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal mengambil statistik harian"
      );
    }
  }
);

export const asyncGetMonthlyStats = createAsyncThunk(
  "lostFounds/getMonthlyStats",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getMonthlyStatsApi(params);
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Gagal mengambil statistik bulanan"
      );
    }
  }
);

const initialState = {
  lostFounds: [],
  lostFound: null,
  isLostFound: false,

  isLostFoundAdd: false,
  isLostFoundAdded: false,

  isLostFoundChange: false,
  isLostFoundChanged: false,

  isLostFoundChangeCover: false,
  isLostFoundChangedCover: false,

  isLostFoundDelete: false,
  isLostFoundDeleted: false,

  lostFoundStats: {
    daily: null,
    monthly: null,
  },
  error: null,
};

const lostFoundSlice = createSlice({
  name: "lostFounds",
  initialState,
  reducers: {
    setLostFounds: (state, action) => {
      state.lostFounds = action.payload;
    },
    setLostFound: (state, action) => {
      state.lostFound = action.payload;
    },
    setIsLostFound: (state, action) => {
      state.isLostFound = action.payload;
    },
    setIsLostFoundAdd: (state, action) => {
      state.isLostFoundAdd = action.payload;
    },
    setIsLostFoundAdded: (state, action) => {
      state.isLostFoundAdded = action.payload;
    },
    setIsLostFoundChange: (state, action) => {
      state.isLostFoundChange = action.payload;
    },
    setIsLostFoundChanged: (state, action) => {
      state.isLostFoundChanged = action.payload;
    },
    setIsLostFoundChangeCover: (state, action) => {
      state.isLostFoundChangeCover = action.payload;
    },
    setIsLostFoundChangedCover: (state, action) => {
      state.isLostFoundChangedCover = action.payload;
    },
    setIsLostFoundDelete: (state, action) => {
      state.isLostFoundDelete = action.payload;
    },
    setIsLostFoundDeleted: (state, action) => {
      state.isLostFoundDeleted = action.payload;
    },
    setLostFoundStats: (state, action) => {
      state.lostFoundStats = action.payload;
    },
    resetLostFoundStatuses: (state) => {
      state.isLostFoundAdd = false;
      state.isLostFoundAdded = false;
      state.isLostFoundChange = false;
      state.isLostFoundChanged = false;
      state.isLostFoundChangeCover = false;
      state.isLostFoundChangedCover = false;
      state.isLostFoundDelete = false;
      state.isLostFoundDeleted = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get list
    builder
      .addCase(asyncGetLostFounds.pending, (state) => {
        state.isLostFound = true;
        state.error = null;
      })
      .addCase(asyncGetLostFounds.fulfilled, (state, action) => {
        state.isLostFound = false;
        state.lostFounds = action.payload;
      })
      .addCase(asyncGetLostFounds.rejected, (state, action) => {
        state.isLostFound = false;
        state.error = action.payload;
      });

    // Get detail
    builder
      .addCase(asyncGetLostFoundById.pending, (state) => {
        state.isLostFound = true;
        state.error = null;
      })
      .addCase(asyncGetLostFoundById.fulfilled, (state, action) => {
        state.isLostFound = false;
        state.lostFound = action.payload;
      })
      .addCase(asyncGetLostFoundById.rejected, (state, action) => {
        state.isLostFound = false;
        state.error = action.payload;
      });

    // Add
    builder
      .addCase(asyncAddLostFound.pending, (state) => {
        state.isLostFoundAdd = true;
        state.isLostFoundAdded = false;
        state.error = null;
      })
      .addCase(asyncAddLostFound.fulfilled, (state) => {
        state.isLostFoundAdd = false;
        state.isLostFoundAdded = true;
      })
      .addCase(asyncAddLostFound.rejected, (state, action) => {
        state.isLostFoundAdd = false;
        state.isLostFoundAdded = false;
        state.error = action.payload;
      });

    // Update
    builder
      .addCase(asyncUpdateLostFound.pending, (state) => {
        state.isLostFoundChange = true;
        state.isLostFoundChanged = false;
        state.error = null;
      })
      .addCase(asyncUpdateLostFound.fulfilled, (state, action) => {
        state.isLostFoundChange = false;
        state.isLostFoundChanged = true;
        if (state.lostFound && state.lostFound.id === action.payload.id) {
          state.lostFound = { ...state.lostFound, ...action.payload.payload };
        }
      })
      .addCase(asyncUpdateLostFound.rejected, (state, action) => {
        state.isLostFoundChange = false;
        state.isLostFoundChanged = false;
        state.error = action.payload;
      });

    // Change cover
    builder
      .addCase(asyncChangeCoverLostFound.pending, (state) => {
        state.isLostFoundChangeCover = true;
        state.isLostFoundChangedCover = false;
        state.error = null;
      })
      .addCase(asyncChangeCoverLostFound.fulfilled, (state) => {
        state.isLostFoundChangeCover = false;
        state.isLostFoundChangedCover = true;
      })
      .addCase(asyncChangeCoverLostFound.rejected, (state, action) => {
        state.isLostFoundChangeCover = false;
        state.isLostFoundChangedCover = false;
        state.error = action.payload;
      });

    // Delete
    builder
      .addCase(asyncDeleteLostFound.pending, (state) => {
        state.isLostFoundDelete = true;
        state.isLostFoundDeleted = false;
        state.error = null;
      })
      .addCase(asyncDeleteLostFound.fulfilled, (state, action) => {
        state.isLostFoundDelete = false;
        state.isLostFoundDeleted = true;
        state.lostFounds = state.lostFounds.filter((item) => item.id !== action.payload);
        if (state.lostFound && state.lostFound.id === action.payload) {
          state.lostFound = null;
        }
      })
      .addCase(asyncDeleteLostFound.rejected, (state, action) => {
        state.isLostFoundDelete = false;
        state.isLostFoundDeleted = false;
        state.error = action.payload;
      });

    // Daily stats
    builder
      .addCase(asyncGetDailyStats.fulfilled, (state, action) => {
        state.lostFoundStats.daily = action.payload;
      });

    // Monthly stats
    builder
      .addCase(asyncGetMonthlyStats.fulfilled, (state, action) => {
        state.lostFoundStats.monthly = action.payload;
      });
  },
});

export const {
  setLostFounds,
  setLostFound,
  setIsLostFound,
  setIsLostFoundAdd,
  setIsLostFoundAdded,
  setIsLostFoundChange,
  setIsLostFoundChanged,
  setIsLostFoundChangeCover,
  setIsLostFoundChangedCover,
  setIsLostFoundDelete,
  setIsLostFoundDeleted,
  setLostFoundStats,
  resetLostFoundStatuses,
} = lostFoundSlice.actions;

export default lostFoundSlice.reducer;
