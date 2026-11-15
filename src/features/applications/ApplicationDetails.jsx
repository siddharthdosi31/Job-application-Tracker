
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { fetchApplicationById } from "./applicationsSlice";

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

function ApplicationDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { applicationDetails, detailsStatus, detailsError } = useSelector(
    (state) => state.applications
  );

  useEffect(() => {
    dispatch(fetchApplicationById(id));
  }, [dispatch, id]);

  if (detailsStatus === "loading" || detailsStatus === "idle") {
    return (
      <p className="py-10 text-center text-sm text-gray-500">
        Loading application details...
      </p>
    );
  }

  if (detailsStatus === "failed") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="font-medium text-red-700">
          Unable to load application: {detailsError}
        </p>
        <button
          onClick={() => dispatch(fetchApplicationById(id))}
          className="mt-3 text-sm font-semibold text-red-700 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!applicationDetails) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Application not found
        </h2>
        <Link
          to="/applications"
          className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          Back to applications
        </Link>
      </div>
    );
  }

  const application = applicationDetails;

  const details = [
    { label: "Company", value: application.company },
    { label: "Role", value: application.role },
    { label: "Status", value: application.status },
    { label: "Date Applied", value: formatDate(application.dateApplied) },
    {
      label: "Salary Range",
      value: formatSalary(
        application.salaryMin,
        application.salaryMax,
        application.currency
      ),
    },
    { label: "Location Type", value: application.locationType },
    { label: "Location", value: application.location },
  ];

  return (
    <div className="space-y-6">
      <Link
        to="/applications"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
      >
        <ArrowLeft size={18} />
        Back to applications
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {application.company}
            </h1>
            <p className="mt-1 text-gray-500">{application.role}</p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-sm font-semibold capitalize ${
              statusStyles[application.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {application.status}
          </span>
        </div>

        {application.jobUrl && (
          <a
            href={application.jobUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"
          >
            View job posting
            <ExternalLink size={15} />
          </a>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Application Information
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {details.map((item) => (
            <div key={item.label}>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="mt-1 font-medium capitalize text-gray-900">
                {item.value || "-"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Notes</h2>
        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
          {application.notes || "No notes added."}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Status History
        </h2>

        {application.statusHistory?.length > 0 ? (
          <div className="space-y-5">
            {application.statusHistory.map((entry, index) => (
              <div key={index} className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="h-3 w-3 rounded-full bg-indigo-600" />
                  {index !== application.statusHistory.length - 1 && (
                    <span className="mt-1 h-full w-px bg-gray-200" />
                  )}
                </div>

                <div className="pb-2">
                  <p className="font-medium capitalize text-gray-900">
                    {entry.status}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(
                      entry.changedAt || entry.date || entry.timestamp
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No status history available.
          </p>
        )}
      </div>
    </div>
  );
}

export default ApplicationDetails;
