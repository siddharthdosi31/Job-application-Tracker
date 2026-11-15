
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Save } from "lucide-react";
import { fetchApplicationById, updateApplicationById } from "../applicationsSlice";
import useForm from "../../../hooks/useForm";

const emptyValues = {
    company: "",
    role: "",
    jobUrl: "",
    status: "wishlist",
    dateApplied: "",
    salaryMin: "",
    salaryMax: "",
    currency: "INR",
    locationType: "onsite",
    location: "",
    notes: "",
};

function validate(values) {
    const errors = {};

    if (!values.company.trim()) {
        errors.company = "Company name is required";
    }

    if (!values.role.trim()) {
        errors.role = "Job role is required";
    }

    if (values.jobUrl.trim()) {
        try {
            new URL(values.jobUrl);
        } catch {
            errors.jobUrl = "Enter a valid URL";
        }
    }

    if (
        values.salaryMin !== "" &&
        values.salaryMax !== "" &&
        Number(values.salaryMin) > Number(values.salaryMax)
    ) {
        errors.salaryMax = "Maximum salary must be greater than minimum salary";
    }

    if (values.dateApplied) {
        const today = new Date().toISOString().split("T")[0];

        if (values.dateApplied > today) {
            errors.dateApplied = "Date applied cannot be in the future";
        }
    } else if (values.status !== "wishlist") {
        errors.dateApplied = "Date applied is required";
    }

    return errors;
}

function ApplicationDrawer({ applicationId, onClose }) {
    const dispatch = useDispatch();

    const {
        applicationDetails,
        detailsStatus,
        detailsError,
        updateStatus,
        updateError,
    } = useSelector((state) => state.applications);

    const form = useForm({
        initialValues: emptyValues,
        validate,
        onSubmit: async (values) => {
            if (!applicationDetails) return;

            const updates = {
                ...values,
                salaryMin: values.salaryMin === "" ? null : Number(values.salaryMin),
                salaryMax: values.salaryMax === "" ? null : Number(values.salaryMax),
                dateApplied:
                    values.status === "wishlist" ? null : values.dateApplied || null,
            };

            try {
                await dispatch(
                    updateApplicationById({
                        id: applicationId,
                        updates,
                        currentApplication: applicationDetails,
                    })
                ).unwrap();

                onClose();
            } catch {
                // The Redux state displays the update error
            }
        },
    });

    // Fetch the selected application when the drawer opens
    useEffect(() => {
        dispatch(fetchApplicationById(applicationId));
    }, [dispatch, applicationId]);

    // Load the fetched application into the form
    useEffect(() => {
        if (applicationDetails?.id === applicationId) {
            form.resetForm({
                company: applicationDetails.company || "",
                role: applicationDetails.role || "",
                jobUrl: applicationDetails.jobUrl || "",
                status: applicationDetails.status || "wishlist",
                dateApplied: applicationDetails.dateApplied || "",
                salaryMin: applicationDetails.salaryMin ?? "",
                salaryMax: applicationDetails.salaryMax ?? "",
                currency: applicationDetails.currency || "INR",
                locationType: applicationDetails.locationType || "onsite",
                location: applicationDetails.location || "",
                notes: applicationDetails.notes || "",
            });
        }
    }, [applicationDetails, applicationId]);

    // Close drawer with Escape
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    });

    const hasUnsavedChanges =
        JSON.stringify(form.values) !==
        JSON.stringify({
            company: applicationDetails?.company || "",
            role: applicationDetails?.role || "",
            jobUrl: applicationDetails?.jobUrl || "",
            status: applicationDetails?.status || "wishlist",
            dateApplied: applicationDetails?.dateApplied || "",
            salaryMin: applicationDetails?.salaryMin ?? "",
            salaryMax: applicationDetails?.salaryMax ?? "",
            currency: applicationDetails?.currency || "INR",
            locationType: applicationDetails?.locationType || "onsite",
            location: applicationDetails?.location || "",
            notes: applicationDetails?.notes || "",
        });

    const handleClose = () => {
        if (detailsStatus !== "succeeded" || !applicationDetails) {
            onClose();
            return;
        }

        if (hasUnsavedChanges) {
            const confirmed = window.confirm(
                "You have unsaved changes. Are you sure you want to close?"
            );

            if (!confirmed) return;
        }

        onClose();
    };

    const inputClass =
        "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

    const renderField = (name, label, type = "text") => (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={form.values[name]}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                className={inputClass}
            />

            {form.touched[name] && form.errors[name] && (
                <p className="mt-1 text-xs text-red-600">{form.errors[name]}</p>
            )}
        </div>
    );

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    handleClose();
                }
            }}
        >
            <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Edit Application
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Update the application information
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close drawer"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Drawer Content */}
                {detailsStatus === "loading" || detailsStatus === "idle" ? (
                    <p className="p-6 text-sm text-gray-500">
                        Loading application details...
                    </p>
                ) : detailsStatus === "failed" ? (
                    <div className="p-6">
                        <p className="text-sm text-red-600">{detailsError}</p>
                        <button
                            onClick={() => dispatch(fetchApplicationById(applicationId))}
                            className="mt-3 text-sm font-semibold text-indigo-600 hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <>
                        <form
                            onSubmit={form.handleSubmit}
                            className="flex-1 space-y-5 overflow-y-auto px-6 py-5"
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {renderField("company", "Company *")}
                                {renderField("role", "Job role *")}
                            </div>

                            {renderField("jobUrl", "Job URL", "url")}

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={form.values.status}
                                    onChange={(event) => {
                                        form.handleChange(event);

                                        if (event.target.value === "wishlist") {
                                            form.resetForm({
                                                ...form.values,
                                                status: "wishlist",
                                                dateApplied: "",
                                            });
                                        }
                                    }}
                                    onBlur={form.handleBlur}
                                    className={inputClass}
                                >
                                    <option value="wishlist">Wishlist</option>
                                    <option value="applied">Applied</option>
                                    <option value="interview">Interview</option>
                                    <option value="offer">Offer</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            {renderField("dateApplied", "Date applied", "date")}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {renderField("salaryMin", "Minimum salary", "number")}
                                {renderField("salaryMax", "Maximum salary", "number")}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Currency
                                    </label>
                                    <select
                                        name="currency"
                                        value={form.values.currency}
                                        onChange={form.handleChange}
                                        className={inputClass}
                                    >
                                        <option value="INR">INR</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Location type
                                    </label>
                                    <select
                                        name="locationType"
                                        value={form.values.locationType}
                                        onChange={form.handleChange}
                                        className={inputClass}
                                    >
                                        <option value="onsite">Onsite</option>
                                        <option value="hybrid">Hybrid</option>
                                        <option value="remote">Remote</option>
                                    </select>
                                </div>
                            </div>

                            {renderField("location", "Location")}

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    rows={4}
                                    value={form.values.notes}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                    className={inputClass}
                                />
                            </div>

                            {/* Status History */}
                            <div className="border-t border-gray-200 pt-5">
                                <h3 className="mb-4 font-semibold text-gray-900">
                                    Status History
                                </h3>

                                {applicationDetails.statusHistory?.length ? (
                                    <div className="space-y-4">
                                        {applicationDetails.statusHistory.map((entry, index) => (
                                            <div key={`${entry.changedAt}-${index}`}>
                                                <p className="text-sm font-medium capitalize text-gray-800">
                                                    {entry.status}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {entry.changedAt
                                                        ? new Date(entry.changedAt).toLocaleString("en-IN")
                                                        : "-"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No status history available.
                                    </p>
                                )}
                            </div>

                            <div className="border-t border-gray-200 pt-4 text-xs text-gray-500">
                                <p>
                                    <p>
                                        Application ID: {applicationDetails.id}
                                    </p>
                                    Created:{" "}
                                    {applicationDetails.createdAt
                                        ? new Date(applicationDetails.createdAt).toLocaleString("en-IN")
                                        : "-"}
                                </p>
                                <p className="mt-1">
                                    Last updated:{" "}
                                    {applicationDetails.updatedAt
                                        ? new Date(applicationDetails.updatedAt).toLocaleString("en-IN")
                                        : "-"}
                                </p>
                            </div>

                            {updateStatus === "failed" && (
                                <p className="text-sm text-red-600">{updateError}</p>
                            )}
                        </form>

                        {/* Drawer Footer */}
                        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={form.handleSubmit}
                                disabled={updateStatus === "loading"}
                                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={16} />
                                {updateStatus === "loading" ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
}

export default ApplicationDrawer;
