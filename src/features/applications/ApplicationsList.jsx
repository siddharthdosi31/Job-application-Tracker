
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import {
    fetchApplications,
    deleteApplicationById,
    clearDeleteError,
} from "./applicationsSlice";
import ApplicationDrawer from "./components/ApplicationDrawer";
import CreateApplicationDrawer from "./components/CreateApplicationDrawer";
import { fetchDashboardApplications } from "../dashboard/dashboardSlice";
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
    const [editingApplicationId, setEditingApplicationId] = useState(null);
    const [deletingApplication, setDeletingApplication] = useState(null);
    const {
        data,
        total,
        status,
        error,
        deleteStatus,
        deleteError,
    } = useSelector((state) => state.applications);

    const [searchParams, setSearchParams] = useSearchParams();

    const searchText = searchParams.get("q") || "";
    const selectedStatus = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "dateApplied";
    const order = searchParams.get("order") || "desc";

    const currentPage = Number(searchParams.get("page")) || 1;
    const totalPages = Math.ceil(total / 10);

    const [searchInput, setSearchInput] = useState(searchText);
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

    // Keep the input synchronized with URL changes
    useEffect(() => {
        setSearchInput(searchText);
    }, [searchText]);

    // Debounce search and fetch applications
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(
                fetchApplications({
                    q: searchText,
                    status: selectedStatus,
                    page: currentPage,
                    sortBy,
                    order,
                })
            );
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [
        dispatch,
        searchText,
        selectedStatus,
        currentPage,
        sortBy,
        order,
    ]);
    useEffect(() => {
        const openCreateDrawer = () => {
            setIsCreateDrawerOpen(true);
        };

        window.addEventListener("open-create-application", openCreateDrawer);

        return () => {
            window.removeEventListener("open-create-application", openCreateDrawer);
        };
    }, []);

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

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams);

        if (page === 1) {
            params.delete("page");
        } else {
            params.set("page", page);
        }

        setSearchParams(params);
    };

    const handleSortChange = (value) => {
        const params = new URLSearchParams(searchParams);

        if (value === "company-asc") {
            params.set("sortBy", "company");
            params.set("order", "asc");
        } else if (value === "company-desc") {
            params.set("sortBy", "company");
            params.set("order", "desc");
        } else if (value === "dateApplied-asc") {
            params.set("sortBy", "dateApplied");
            params.set("order", "asc");
        } else {
            params.set("sortBy", "dateApplied");
            params.set("order", "desc");
        }

        // Reset pagination when sorting changes
        params.delete("page");

        setSearchParams(params);
    };

    const handleRetry = () => {
        dispatch(
            fetchApplications({
                q: searchText,
                status: selectedStatus,
                page: currentPage,
                sortBy,
                order,
            })
        );
    };
    const handleDeleteClick = (application) => {
        dispatch(clearDeleteError());
        setDeletingApplication(application);
    };

    const handleConfirmDelete = async () => {
        if (!deletingApplication || deleteStatus === "loading") return;

        try {
            await dispatch(
                deleteApplicationById(deletingApplication.id)
            ).unwrap();

            // Refresh dashboard statistics after successful deletion
            dispatch(fetchDashboardApplications());

            setDeletingApplication(null);

            // If the deleted row was the only row on this page,
            // go back one page.
            if (data.length === 1 && currentPage > 1) {
                handlePageChange(currentPage - 1);
            } else {
                // Refresh the current page using the existing filters and sorting.
                dispatch(
                    fetchApplications({
                        q: searchText,
                        status: selectedStatus,
                        page: currentPage,
                        sortBy,
                        order,
                    })
                );
            }
        } catch {
            // The Redux state displays the deletion error.
        }
    };

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

            {/* Search, Status Filter and Sorting */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(event) => {
                        setSearchInput(event.target.value);
                        handleSearchChange(event.target.value);
                    }}
                    placeholder="Search company or role..."
                    className="h-11 min-w-0 w-full flex-1 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                {/* Status Filter */}
                <div className="relative w-full sm:w-44">
                    <select
                        value={selectedStatus}
                        onChange={(event) => handleStatusChange(event.target.value)}
                        aria-label="Filter by status"
                        className="h-11 w-full appearance-none cursor-pointer rounded-lg border border-gray-200 bg-white pl-4 pr-10 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="">All statuses</option>
                        <option value="wishlist">Wishlist</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                </div>

                {/* Sorting */}
                <div className="relative w-full sm:w-48">
                    <select
                        value={`${sortBy}-${order}`}
                        onChange={(event) => handleSortChange(event.target.value)}
                        aria-label="Sort applications"
                        className="h-11 w-full appearance-none cursor-pointer rounded-lg border border-gray-200 bg-white pl-4 pr-10 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="dateApplied-desc">Newest first</option>
                        <option value="dateApplied-asc">Oldest first</option>
                        <option value="company-asc">Company A–Z</option>
                        <option value="company-desc">Company Z–A</option>
                    </select>

                    <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                </div>
            </div>

            {/* Loading and Error Messages */}
            {status === "loading" && (
                <p className="text-sm text-indigo-600">
                    Updating applications...
                </p>
            )}

            {status === "failed" && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-700">
                        Unable to load applications: {error}
                    </p>

                    <button
                        onClick={handleRetry}
                        className="mt-2 text-sm font-semibold text-red-700 hover:underline"
                    >
                        Try Again
                    </button>
                </div>
            )}
            
            {/* Applications Table and Mobile Cards */}
            {data.length === 0 && status !== "loading" ? (
                <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        No applications found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Try changing your search or status filter.
                    </p>
                </div>
            ) : (
                data.length > 0 && (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                        {/* Desktop Table: visible on medium screens and above */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[920px] text-left">
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
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Actions
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
                                                <Link
                                                    to={`/applications/${application.id}`}
                                                    className="font-semibold text-indigo-600 hover:underline"
                                                >
                                                    {application.company}
                                                </Link>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {application.role}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                                        statusStyles[application.status] ||
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

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEditingApplicationId(application.id)
                                                        }
                                                        aria-label={`Edit ${application.company}`}
                                                        title="Edit application"
                                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                                                    >
                                                        <Pencil size={17} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteClick(application)
                                                        }
                                                        aria-label={`Delete ${application.company}`}
                                                        title="Delete application"
                                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards: visible below medium screens */}
                        <div className="divide-y divide-gray-100 md:hidden">
                            {data.map((application) => (
                                <div
                                    key={application.id}
                                    className="space-y-3 p-4"
                                >
                                    {/* Company and Role */}
                                    <div className="min-w-0">
                                        <Link
                                            to={`/applications/${application.id}`}
                                            className="break-words text-base font-semibold text-indigo-600 hover:underline"
                                        >
                                            {application.company}
                                        </Link>

                                        <p className="mt-1 break-words text-sm text-gray-600">
                                            {application.role}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                                statusStyles[application.status] ||
                                                "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {application.status}
                                        </span>
                                    </div>

                                    {/* Application Details */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-gray-400">
                                                Date Applied
                                            </p>
                                            <p className="mt-1 break-words text-sm text-gray-700">
                                                {formatDate(application.dateApplied)}
                                            </p>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-gray-400">
                                                Salary Range
                                            </p>
                                            <p className="mt-1 break-words text-sm text-gray-700">
                                                {formatSalary(
                                                    application.salaryMin,
                                                    application.salaryMax,
                                                    application.currency
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingApplicationId(application.id)
                                            }
                                            aria-label={`Edit ${application.company}`}
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
                                        >
                                            <Pencil size={16} />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteClick(application)
                                            }
                                            aria-label={`Delete ${application.company}`}
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination: shared by desktop and mobile */}
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-3 py-4 sm:px-6 md:flex-row">
                            <p className="text-center text-sm text-gray-500">
                                Showing {(currentPage - 1) * 10 + 1}
                                {" - "}
                                {(currentPage - 1) * 10 + data.length} of {total} applications
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`rounded-lg px-3 py-2 text-sm font-medium ${
                                            currentPage === page
                                                ? "bg-indigo-600 text-white"
                                                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

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
                )
            )}

            {editingApplicationId !== null && (
                <ApplicationDrawer
                    applicationId={editingApplicationId}
                    onClose={() => setEditingApplicationId(null)}
                />
            )}
            {isCreateDrawerOpen && (
                <CreateApplicationDrawer
                    onClose={() => setIsCreateDrawerOpen(false)}
                />
            )}
            {/* Delete Confirmation Modal */}
            {deletingApplication && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            deleteStatus !== "loading"
                        ) {
                            setDeletingApplication(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                    >
                        <h3
                            id="delete-modal-title"
                            className="text-lg font-bold text-gray-900"
                        >
                            Delete Application?
                        </h3>

                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to delete the application for{" "}
                            <span className="font-semibold text-gray-900">
                                {deletingApplication.company}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        {deleteError && (
                            <p className="mt-3 text-sm text-red-600">
                                Unable to delete application: {deleteError}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeletingApplication(null)}
                                disabled={deleteStatus === "loading"}
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={deleteStatus === "loading"}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleteStatus === "loading"
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ApplicationsList;
