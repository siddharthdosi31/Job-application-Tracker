
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchApplications } from "./applicationsSlice";

const statusStyles = {
    wishlist: "bg-gray-100 text-gray-700",
    applied: "bg-blue-50 text-blue-700",
    interview: "bg-purple-50 text-purple-700",
    offer: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
};

function formatDate(date) {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatSalary(min, max, currency = "INR") {
    if (min == null && max == null) return "-";

    const formatAmount = (amount) =>
        `${currency} ${(amount / 100000).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
        })}L`;

    if (min == null) return `Up to ${formatAmount(max)}`;
    if (max == null) return `From ${formatAmount(min)}`;

    return `${formatAmount(min)} – ${formatAmount(max)}`;
}

function ApplicationsList() {
    const dispatch = useDispatch();

    const { data, total, status, error } = useSelector(
        (state) => state.applications
    );

    const [searchParams, setSearchParams] = useSearchParams();

    const searchText = searchParams.get("q") || "";
    const selectedStatus = searchParams.get("status") || "";
    const currentPage = Number(searchParams.get("page")) || 1;
    const totalPages = Math.ceil(total / 10);

    const [searchInput, setSearchInput] = useState(searchText);

    // Keep the input synchronized with URL changes
    useEffect(() => {
        setSearchInput(searchText);
    }, [searchText]);

    // Debounce search and fetch applications
    // Debounce search and fetch applications
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(
                fetchApplications({
                    q: searchText,
                    status: selectedStatus,
                    page: currentPage,
                })
            );
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [dispatch, searchText, selectedStatus, currentPage]);

    const handleSearchChange = (value) => {
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set("q", value);
        } else {
            params.delete("q");
        }

        params.delete("page");
        setSearchParams(params);
    };

    const handleStatusChange = (value) => {
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set("status", value);
        } else {
            params.delete("status");
        }

        params.delete("page");
        setSearchParams(params);
    };
    {/* Loading and Error Messages */ }
    {
        status === "loading" && (
            <p className="text-sm text-indigo-600">
                Updating applications...
            </p>
        )
    }
    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams);

        if (page === 1) {
            params.delete("page");
        } else {
            params.set("page", page);
        }

        setSearchParams(params);
    };

    {
        status === "failed" && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">
                    Unable to load applications: {error}
                </p>

                <button
                    onClick={() =>
                        dispatch(
                            fetchApplications({
                                q: searchText,
                                status: selectedStatus,
                            })
                        )
                    }
                    className="mt-2 text-sm font-semibold text-red-700 hover:underline"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Page Heading */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        All Applications
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Keep track of your job applications and their progress.
                    </p>
                </div>

                <span className="w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
                    {data.length} Applications
                </span>
            </div>

            {/* Search and Status Filter */}
            {/* Search and Status Filter */}
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path strokeLinecap="round" d="m16 16 4 4" />
                    </svg>

                    <input
                        type="text"
                        value={searchInput}
                        onChange={(event) => {
                            setSearchInput(event.target.value);
                            handleSearchChange(event.target.value);
                        }}
                        placeholder="Search by company or role..."
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                </div>

                <div className="flex items-center gap-3 sm:w-56">
                    <span className="whitespace-nowrap text-sm font-medium text-gray-500">
                        Status
                    </span>

                    <select
                        value={selectedStatus}
                        onChange={(event) => handleStatusChange(event.target.value)}
                        className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    >
                        <option value="">All statuses</option>
                        <option value="wishlist">Wishlist</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Applications Table */}
            {data.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        No applications found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Try changing your search or status filter.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Company
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Date Applied
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Salary Range
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {data.map((application) => (
                                    <tr
                                        key={application.id}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-900">
                                                {application.company}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {application.role}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[application.status] ||
                                                    "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {application.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(application.dateApplied)}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                            {formatSalary(
                                                application.salaryMin,
                                                application.salaryMax,
                                                application.currency
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-6 py-4 sm:flex-row">
                        <p className="text-sm text-gray-500">
                            Showing {data.length === 0 ? 0 : (currentPage - 1) * 10 + 1}
                            {" - "}
                            {(currentPage - 1) * 10 + data.length} of {total} applications
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                                (page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`rounded-lg px-3 py-2 text-sm font-medium ${currentPage === page
                                                ? "bg-indigo-600 text-white"
                                                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ApplicationsList;
