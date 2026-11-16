
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Briefcase,
    Bookmark,
    Send,
    CalendarDays,
    Trophy,
    XCircle,
} from "lucide-react";
import {
    selectDashboardStats,
    selectStatusBreakdown,
    selectRecentApplications,
} from "./dashboardSelector";

import StatusBreakdown from "./components/StatusBreakdown";
import RecentApplication from "./components/RecentApplication";
import ApplicationChart from "./components/ApplictionsChart";

import { fetchDashboardApplications } from "./dashboardSlice";
import SummaryCard from "./components/SummaryCards";

const Dashboard = () => {
    const dispatch = useDispatch();

    const { status, error } = useSelector(
        (state) => state.dashboard
    );

    // Get memoized dashboard statistics
    const stats = useSelector(selectDashboardStats);
    const breakdown = useSelector(selectStatusBreakdown);
    const recentApplications = useSelector(selectRecentApplications);


    // Fetch dashboard applications
    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchDashboardApplications());
        }
    }, [dispatch, status]);

    // Loading state
    if (status === "loading") {
        return <div className="p-6">Loading dashboard...</div>;
    }

    // Error state
    if (status === "failed") {
        return (
            <div className="p-6">
                <p className="text-red-600">{error}</p>

                <button
                    onClick={() => dispatch(fetchDashboardApplications())}
                    className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Empty state
    if (status === "succeeded" && stats.total === 0) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold">
                    No applications yet
                </h2>
                <p className="mt-2 text-gray-500">
                    Add your first application to see your dashboard statistics.
                </p>
            </div>
        );
    }

    const summaryCards = [
        {
            title: "Total Applications",
            count: stats.total,
            icon: Briefcase,
            color: "bg-blue-100 text-blue-600",
        },
        {
            title: "Wishlist",
            count: stats.wishlist,
            icon: Bookmark,
            color: "bg-gray-100 text-gray-600",
        },
        {
            title: "Applied",
            count: stats.applied,
            icon: Send,
            color: "bg-indigo-100 text-indigo-600",
        },
        {
            title: "Interviews",
            count: stats.interview,
            icon: CalendarDays,
            color: "bg-purple-100 text-purple-600",
        },
        {
            title: "Offers",
            count: stats.offer,
            icon: Trophy,
            color: "bg-green-100 text-green-600",
        },
        {
            title: "Rejected",
            count: stats.rejected,
            icon: XCircle,
            color: "bg-red-100 text-red-600",
        },
    ];

    return (
        <div className="p-6">
            {/* Dashboard heading */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Dashboard
                </h1>

                <p className="mt-1 text-gray-500">
                    Welcome to your application overview.
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {summaryCards.map((card) => (
                    <SummaryCard
                        key={card.title}
                        title={card.title}
                        count={card.count}
                        icon={card.icon}
                        color={card.color}
                    />
                ))}
            </div>
            {/* Application status breakdown */}
            <div className="mt-6">
                <StatusBreakdown
                    breakdown={breakdown}
                    total={stats.total}
                />
            </div>
            {/* Recent applications */}
            <div className="mt-6">
                <RecentApplication applications={recentApplications} />
            </div>
            {/* Application chart */}
            <div className="mt-6">
                <ApplicationChart
                    breakdown={breakdown}
                    total={stats.total}
                />
            </div>
        </div>
    );
};

export default Dashboard;
