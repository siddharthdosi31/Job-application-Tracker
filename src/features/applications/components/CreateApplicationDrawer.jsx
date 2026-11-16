import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { X, Save } from "lucide-react";
import { createApplicationById } from "../applicationsSlice";
import ApplicationForm from "./ApplicationForm";
import useForm from "../../../hooks/useForm";
import { fetchDashboardApplications } from "../../dashboard/dashboardSlice";

const initialValues = {
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

function CreateApplicationDrawer({ onClose }) {
  const dispatch = useDispatch();
  const [, setSearchParams] = useSearchParams();

  const { createStatus, createError } = useSelector(
    (state) => state.applications
  );

  const form = useForm({
    initialValues,
    validate,
    onSubmit: async (values) => {
      const applicationData = {
        ...values,
        salaryMin:
          values.salaryMin === "" ? null : Number(values.salaryMin),
        salaryMax:
          values.salaryMax === "" ? null : Number(values.salaryMax),
        dateApplied:
          values.status === "wishlist" ? null : values.dateApplied || null,
      };

      try {
        await dispatch(createApplicationById(applicationData)).unwrap();

        dispatch(fetchDashboardApplications());
        setSearchParams({});
        onClose();
      } catch {
        // The Redux state displays the creation error
      }
    },
  });

  const handleClose = () => {
    if (createStatus === "loading") return;

    const hasChanges =
      JSON.stringify(form.values) !== JSON.stringify(initialValues);

    if (hasChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );

      if (!confirmed) return;
    }

    onClose();
  };

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

  const isSaving = createStatus === "loading";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl transition-colors dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Add Application
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter the details of your job application.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            aria-label="Close drawer"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={form.handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto px-6 py-5"
        >
          <ApplicationForm form={form} />

          {createStatus === "failed" && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Unable to create application: {createError}
            </p>
          )}
        </form>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={form.handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {isSaving ? "Creating..." : "Create application"}
          </button>
        </div>
      </aside>
    </div>
  );
}

export default CreateApplicationDrawer;