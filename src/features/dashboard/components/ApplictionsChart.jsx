const chartColors = {
    Wishlist: "bg-gray-400",
    Applied: "bg-blue-500",
    Interview: "bg-purple-500",
    Offer: "bg-green-500",
    Rejected: "bg-red-500",
};

const ApplicationChart = ({ breakdown, total }) => {
    const maxCount = Math.max(
        ...breakdown.map((item) => item.count),
        1
    );

    return (
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 sm:p-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Applications Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Applications by status
            </p>

            <div className="mt-6 flex h-56 min-w-0 items-end justify-around gap-1 border-b border-gray-200 pb-2 dark:border-gray-700 sm:gap-3">
                {breakdown.map((item) => {
                    const height =
                        item.count > 0
                            ? (item.count / maxCount) * 100
                            : 0;

                    return (
                        <div
                            key={item.status}
                            className="flex h-full flex-1 flex-col items-center justify-end"
                        >
                            <span className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                {item.count}
                            </span>

                            <div className="flex h-full w-full items-end justify-center">
                                <div
                                    className={`w-full max-w-12 rounded-t-md transition-all duration-500 ${chartColors[item.status]}`}
                                    style={{
                                        height: `${height}%`,
                                        minHeight: item.count > 0 ? "6px" : "0px",
                                    }}
                                    title={`${item.status}: ${item.count}`}
                                />
                            </div>

                            <span className="mt-3 break-words text-center text-[10px] leading-tight text-gray-500 dark:text-gray-400 sm:text-xs">
                                {item.status}
                            </span>
                        </div>
                    );
                })}
            </div>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Total applications:{" "}
                <span className="font-semibold text-gray-800 dark:text-white">
                    {total}
                </span>
            </p>
        </div>
    );
};

export default ApplicationChart;
