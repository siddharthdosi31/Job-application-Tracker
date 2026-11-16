const statusStyles = {
    Wishlist: {
        bar: "bg-gray-400",
        text: "text-gray-600 dark:text-gray-300",
    },
    Applied: {
        bar: "bg-blue-500",
        text: "text-blue-600 dark:text-blue-400",
    },
    Interview: {
        bar: "bg-purple-500",
        text: "text-purple-600 dark:text-purple-400",
    },
    Offer: {
        bar: "bg-green-500",
        text: "text-green-600 dark:text-green-400",
    },
    Rejected: {
        bar: "bg-red-500",
        text: "text-red-600 dark:text-red-400",
    },
};

const StatusBreakdown = ({ breakdown, total }) => {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Application Status Breakdown
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Overview of your applications by status
            </p>

            <div className="mt-6 space-y-5">
                {breakdown.map((item) => {
                    const percentage =
                        total > 0 ? (item.count / total) * 100 : 0;

                    const styles = statusStyles[item.status];

                    return (
                        <div key={item.status}>
                            {/* Status name and count */}
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {item.status}
                                </span>

                                <span className={`text-sm font-semibold ${styles.text}`}>
                                    {item.count} ({percentage.toFixed(1)}%)
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StatusBreakdown;
