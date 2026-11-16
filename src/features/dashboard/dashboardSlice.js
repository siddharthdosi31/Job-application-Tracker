import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllApplications } from "../../api/applicationsApi";

// Fetch all applications for the dashboard
export const fetchDashboardApplications = createAsyncThunk(
    "dashboard/fetchDashboardApplications",
    async () => {
        return await getAllApplications();
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",

    initialState: {
        data: [],
        status: "idle",
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardApplications.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchDashboardApplications.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchDashboardApplications.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.error.message || "Failed to load dashboard data";
            });
    },
});

export default dashboardSlice.reducer;