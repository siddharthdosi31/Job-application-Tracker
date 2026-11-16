
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const statusStyles = {
    wishlist: "bg-gray-100 text-gray-700",
    applied: "bg-blue-100 text-blue-700",
    interview: "bg-purple-100 text-purple-700",
    offer: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
};

const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) return "Not specified";

    return parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const RecentApplication = ({ applications }) => {
    return (
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Recent Applications
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Your latest five applications
                    </p>
                </div>

                <Link
                    to="/applications"
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    View all
                    <ArrowUpRight size={16} />
                </Link>
            </div>

            <div className="space-y-4">
                {applications.map((application) => (
                    <div
                        key={application.id}
                        className="flex flex-col gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                        {/* Company and role */}
                        <div className="min-w-0">
                            <Link
                                to={`/applications/${application.id}`}
                                className="break-words font-medium text-gray-800 hover:text-blue-600"
                            >
                                {application.company}
                            </Link>

                            <p className="mt-1 break-words text-sm text-gray-500">
                                {application.role}
                            </p>
                        </div>

                        {/* Status and date */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                                    statusStyles[application.status] ||
                                    "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {application.status}
                            </span>

                            <span className="text-sm text-gray-500">
                                {formatDate(
                                    application.dateApplied ||
                                    application.createdAt
                                )}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {applications.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-500">
                    No recent applications found.
                </p>
            )}
        </div>
    );
};

export default RecentApplication;
