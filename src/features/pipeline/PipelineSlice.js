
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllApplications,
    updateApplication,
} from "../../api/applicationsApi";

// Fetch all applications for the Pipeline board
export const fetchPipelineApplications = createAsyncThunk(
    "pipeline/fetchApplications",
    async () => {
        return await getAllApplications();
    }
);

// Change application status with optimistic update and rollback
export const changePipelineStatus = createAsyncThunk(
    "pipeline/changeStatus",
    async ({ id, status }, { getState, dispatch, rejectWithValue }) => {
        const currentApplication = getState().pipeline.data.find(
            (application) => application.id === id
        );

        if (!currentApplication) {
            return rejectWithValue("Application not found");
        }

        // Save the previous status before changing it
        const previousStatus = currentApplication.status;

        // Update the UI immediately
        dispatch(optimisticallyUpdateStatus({ id, status }));

        try {
            const updatedApplication = await updateApplication({
                id,
                updates: { status },
                currentApplication,
            });

            // Replace optimistic data with the API response
            dispatch(updateStatusSucceeded(updatedApplication));

            return updatedApplication;
        } catch (error) {
            // Restore the previous status if the API fails
            dispatch(rollbackStatus({ id, previousStatus }));

            return rejectWithValue(
                error.message || "Failed to update application status"
            );
        }
    }
);

const pipelineSlice = createSlice({
    name: "pipeline",

    initialState: {
        data: [],
        status: "idle",
        error: null,
    },

    reducers: {
        optimisticallyUpdateStatus: (state, action) => {
            const { id, status } = action.payload;

            const application = state.data.find(
                (item) => item.id === id
            );

            if (application) {
                application.status = status;
            }
        },

        updateStatusSucceeded: (state, action) => {
            const updatedApplication = action.payload;

            state.data = state.data.map((application) =>
                application.id === updatedApplication.id
                    ? updatedApplication
                    : application
            );
        },

        rollbackStatus: (state, action) => {
            const { id, previousStatus } = action.payload;

            const application = state.data.find(
                (item) => item.id === id
            );

            if (application) {
                application.status = previousStatus;
            }
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchPipelineApplications.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchPipelineApplications.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchPipelineApplications.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export const {
    optimisticallyUpdateStatus,
    updateStatusSucceeded,
    rollbackStatus,
} = pipelineSlice.actions;

export default pipelineSlice.reducer;
