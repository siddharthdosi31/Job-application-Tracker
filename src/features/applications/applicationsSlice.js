
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApplications } from "../../api/applicationsApi";

// Fetch applications from the API
export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (filters = {}) => {
    return await getApplications(filters);
  }
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState: {
    data: [],
    total: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default applicationsSlice.reducer;
