
import { createSelector } from "@reduxjs/toolkit";

// Get all dashboard applications from Redux
const selectDashboardApplications = (state) => state.dashboard.data;

// Calculate total applications and counts by status
export const selectDashboardStats = createSelector(
    [selectDashboardApplications],
    (applications) => {
        return {
            total: applications.length,

            wishlist: applications.filter(
                (app) => app.status === "wishlist"
            ).length,

            applied: applications.filter(
                (app) => app.status === "applied"
            ).length,

            interview: applications.filter(
                (app) => app.status === "interview"
            ).length,

            offer: applications.filter(
                (app) => app.status === "offer"
            ).length,

            rejected: applications.filter(
                (app) => app.status === "rejected"
            ).length,
        };
    }
);

// Prepare application counts for the status breakdown
export const selectStatusBreakdown = createSelector(
    [selectDashboardStats],
    (stats) => [
        { status: "Wishlist", count: stats.wishlist },
        { status: "Applied", count: stats.applied },
        { status: "Interview", count: stats.interview },
        { status: "Offer", count: stats.offer },
        { status: "Rejected", count: stats.rejected },
    ]
);

// Get the five most recently created applications
export const selectRecentApplications = createSelector(
    [selectDashboardApplications],
    (applications) => {
        return [...applications]
            .sort((a, b) => {
                const dateA = new Date(
                    a.createdAt || a.dateApplied || 0
                ).getTime();

                const dateB = new Date(
                    b.createdAt || b.dateApplied || 0
                ).getTime();

                return dateB - dateA;
            })
            .slice(0, 5);
    }
);
