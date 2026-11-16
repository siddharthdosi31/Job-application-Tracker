import { configureStore } from "@reduxjs/toolkit";
import applicationsReducer from "../features/applications/applicationsSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

export const store = configureStore({
    reducer: {
        applications: applicationsReducer,
        dashboard: dashboardReducer,
    },
});