
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getApplications,
    getApplicationById,
    updateApplication,
    createApplication,
    deleteApplication,
} from "../../api/applicationsApi";

// Fetch all applications
export const fetchApplications = createAsyncThunk(
    "applications/fetchApplications",
    async (filters = {}) => {
        return await getApplications(filters);
    }
);

// Fetch a single application by ID
export const fetchApplicationById = createAsyncThunk(
    "applications/fetchApplicationById",
    async (id) => {
        return await getApplicationById(id);
    }
);

// Update an application
export const updateApplicationById = createAsyncThunk(
    "applications/updateApplication",
    async ({ id, updates, currentApplication }) => {
        return await updateApplication({
            id,
            updates,
            currentApplication,
        });
    }
);

// Create a new application
export const createApplicationById = createAsyncThunk(
    "applications/createApplication",
    async (applicationData) => {
        return await createApplication(applicationData);
    }
);

// Delete an application
export const deleteApplicationById = createAsyncThunk(
    "applications/deleteApplication",
    async (id) => {
        return await deleteApplication(id);
    }
);

const applicationsSlice = createSlice({
    name: "applications",

    initialState: {
        data: [],
        total: 0,
        status: "idle",
        error: null,

        // State for application details
        applicationDetails: null,
        detailsStatus: "idle",
        detailsError: null,

        // State for updating an application
        updateStatus: "idle",
        updateError: null,

        // State for creating an application
        createStatus: "idle",
        createError: null,

        // State for deleting an application
        deleteStatus: "idle",
        deleteError: null,
    },

    reducers: {
        clearDeleteError: (state) => {
            state.deleteError = null;
            state.deleteStatus = "idle";
        },
    },

    extraReducers: (builder) => {
        builder
            // Fetch all applications
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
            })

            // Fetch one application's details
            .addCase(fetchApplicationById.pending, (state) => {
                state.detailsStatus = "loading";
                state.detailsError = null;
                state.applicationDetails = null;
            })
            .addCase(fetchApplicationById.fulfilled, (state, action) => {
                state.detailsStatus = "succeeded";
                state.applicationDetails = action.payload;
            })
            .addCase(fetchApplicationById.rejected, (state, action) => {
                state.detailsStatus = "failed";
                state.detailsError = action.error.message;
            })

            // Update an application
            .addCase(updateApplicationById.pending, (state) => {
                state.updateStatus = "loading";
                state.updateError = null;
            })
            .addCase(updateApplicationById.fulfilled, (state, action) => {
                state.updateStatus = "succeeded";

                state.data = state.data.map((application) =>
                    application.id === action.payload.id
                        ? action.payload
                        : application
                );

                state.applicationDetails = action.payload;
            })
            .addCase(updateApplicationById.rejected, (state, action) => {
                state.updateStatus = "failed";
                state.updateError = action.error.message;
            })

            // Create an application
            .addCase(createApplicationById.pending, (state) => {
                state.createStatus = "loading";
                state.createError = null;
            })
            .addCase(createApplicationById.fulfilled, (state, action) => {
                state.createStatus = "succeeded";
                state.data.unshift(action.payload);
                state.total += 1;
            })
            .addCase(createApplicationById.rejected, (state, action) => {
                state.createStatus = "failed";
                state.createError =
                    action.error.message || "Failed to create application";
            })

            // Delete an application
            .addCase(deleteApplicationById.pending, (state) => {
                state.deleteStatus = "loading";
                state.deleteError = null;
            })
            .addCase(deleteApplicationById.fulfilled, (state, action) => {
                state.deleteStatus = "succeeded";

                state.data = state.data.filter(
                    (application) => application.id !== action.payload
                );

                state.total = Math.max(0, state.total - 1);
            })
            .addCase(deleteApplicationById.rejected, (state, action) => {
                state.deleteStatus = "failed";
                state.deleteError =
                    action.error.message || "Failed to delete application";
            });
    },
});

export const { clearDeleteError } = applicationsSlice.actions;

export default applicationsSlice.reducer;
