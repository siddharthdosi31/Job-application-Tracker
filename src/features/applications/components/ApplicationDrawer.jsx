
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Save } from "lucide-react";
import { fetchApplicationById, updateApplicationById } from "../applicationsSlice";
import useForm from "../../../hooks/useForm";
import ApplicationForm from "./ApplicationForm";
import { fetchDashboardApplications } from "../../dashboard/dashboardSlice";

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
                salaryMin:
                    values.salaryMin === "" ? null : Number(values.salaryMin),
                salaryMax:
                    values.salaryMax === "" ? null : Number(values.salaryMax),
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

                // Refresh dashboard statistics after successful update
                dispatch(fetchDashboardApplications());

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

    const handleClose = useCallback(() => {
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
    }, [detailsStatus, applicationDetails, hasUnsavedChanges, onClose]);

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
    }, [handleClose]);

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
                            type="button"
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
                            <ApplicationForm
                                form={form}
                                applicationDetails={applicationDetails}
                            />

                            {updateStatus === "failed" && (
                                <p className="text-sm text-red-600">
                                    {updateError}
                                </p>
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
