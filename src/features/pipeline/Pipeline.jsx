
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    Briefcase,
    CalendarDays,
    RefreshCw,
    GripVertical,
} from "lucide-react";

import {
    fetchPipelineApplications,
    changePipelineStatus,
} from "./PipelineSlice";

const statuses = [
    { value: "wishlist", label: "Wishlist" },
    { value: "applied", label: "Applied" },
    { value: "interview", label: "Interview" },
    { value: "offer", label: "Offer" },
    { value: "rejected", label: "Rejected" },
];

const statusStyles = {
    wishlist: "bg-gray-100 text-gray-700",
    applied: "bg-blue-100 text-blue-700",
    interview: "bg-purple-100 text-purple-700",
    offer: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
};

function formatDate(date) {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function Pipeline() {
    const dispatch = useDispatch();

    const { data, status, error } = useSelector(
        (state) => state.pipeline
    );

    const [draggedApplication, setDraggedApplication] = useState(null);
    const [toast, setToast] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchPipelineApplications());
        }
    }, [dispatch, status]);

    const handleStatusChange = async (application, newStatus) => {
        if (application.status === newStatus || updatingId === application.id) {
            return;
        }

        setUpdatingId(application.id);

        try {
            await dispatch(
                changePipelineStatus({
                    id: application.id,
                    status: newStatus,
                })
            ).unwrap();

            setToast({
                type: "success",
                message: `${application.company} moved to ${newStatus}.`,
            });
        } catch (error) {
            setToast({
                type: "error",
                message: error || "Could not update application status.",
            });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDrop = (newStatus) => {
        if (!draggedApplication) return;

        handleStatusChange(draggedApplication, newStatus);
        setDraggedApplication(null);
    };

    if (status === "loading") {
        return (
            <div className="flex min-h-60 items-center justify-center gap-3 text-gray-500">
                <RefreshCw className="animate-spin" size={20} />
                Loading pipeline...
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="rounded-xl border border-red-200 bg-white p-6 text-center">
                <p className="text-red-600">
                    {error || "Failed to load applications."}
                </p>

                <button
                    onClick={() => dispatch(fetchPipelineApplications())}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="min-w-0 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                        Application Pipeline
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Track and manage your applications by status.
                    </p>
                </div>

                <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                    {data.length} Applications
                </span>
            </div>

            {toast && (
                <div
                    className={`flex items-center justify-between rounded-lg p-3 text-sm ${
                        toast.type === "success"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                    }`}
                >
                    <span>{toast.message}</span>

                    <button
                        onClick={() => setToast(null)}
                        className="ml-3 font-semibold"
                    >
                        ×
                    </button>
                </div>
            )}

            {data.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                    <Briefcase className="mx-auto mb-3 text-gray-400" size={36} />
                    <h2 className="font-semibold text-gray-700">
                        No applications yet
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Add an application to see it in your pipeline.
                    </p>
                    <Link
                        to="/applications"
                        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                        Go to applications
                    </Link>
                </div>
            ) : (
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {statuses.map((column) => {
                        const columnApplications = data.filter(
                            (application) => application.status === column.value
                        );

                        return (
                            <div
                                key={column.value}
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={() => handleDrop(column.value)}
                                className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-3"
                            >
                                <div className="mb-4 flex items-center justify-between gap-2">
                                    <h2 className="font-semibold text-gray-700">
                                        {column.label}
                                    </h2>

                                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-600">
                                        {columnApplications.length}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {columnApplications.length === 0 ? (
                                        <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-xs text-gray-400">
                                            No applications
                                        </div>
                                    ) : (
                                        columnApplications.map((application) => (
                                            <div
                                                key={application.id}
                                                draggable={updatingId !== application.id}
                                                onDragStart={() =>
                                                    setDraggedApplication(application)
                                                }
                                                onDragEnd={() =>
                                                    setDraggedApplication(null)
                                                }
                                                className={`min-w-0 rounded-lg border border-gray-200 bg-white p-3 shadow-sm ${
                                                    updatingId === application.id
                                                        ? "opacity-60"
                                                        : "cursor-grab active:cursor-grabbing"
                                                }`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <GripVertical
                                                        size={16}
                                                        className="mt-1 shrink-0 text-gray-400"
                                                    />

                                                    <div className="min-w-0 flex-1">
                                                        <Link
                                                            to={`/applications/${application.id}`}
                                                            className="break-words font-semibold text-gray-800 hover:text-blue-600"
                                                        >
                                                            {application.company}
                                                        </Link>

                                                        <p className="mt-1 break-words text-sm text-gray-500">
                                                            {application.role}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                                    <CalendarDays size={13} />
                                                    {formatDate(application.dateApplied)}
                                                </div>

                                                <div className="mt-3">
                                                    <span
                                                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                                            statusStyles[application.status] ||
                                                            "bg-gray-100 text-gray-700"
                                                        }`}
                                                    >
                                                        {column.label}
                                                    </span>
                                                </div>

                                                <div className="mt-3 border-t border-gray-100 pt-3">
                                                    <label className="mb-1 block text-xs text-gray-500">
                                                        Move to
                                                    </label>

                                                    <select
                                                        value={application.status}
                                                        disabled={updatingId === application.id}
                                                        onChange={(event) =>
                                                            handleStatusChange(
                                                                application,
                                                                event.target.value
                                                            )
                                                        }
                                                        className="w-full min-w-0 rounded-md border border-gray-200 bg-white px-2 py-2 text-xs text-gray-700 outline-none focus:border-blue-500 disabled:opacity-50"
                                                    >
                                                        {statuses.map((option) => (
                                                            <option
                                                                key={option.value}
                                                                value={option.value}
                                                            >
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Pipeline;
