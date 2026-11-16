
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
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
                Applications Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                Applications by status
            </p>

            <div className="mt-6 flex h-56 items-end justify-around gap-3 border-b border-gray-200 pb-2">
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
                            <span className="mb-2 text-sm font-semibold text-gray-700">
                                {item.count}
                            </span>

                            <div className="flex h-full w-full items-end justify-center">
                                <div
                                    className={`w-full max-w-12 rounded-t-md transition-all duration-500 ${
                                        chartColors[item.status]
                                    }`}
                                    style={{
                                        height: `${height}%`,
                                        minHeight: item.count > 0 ? "6px" : "0px",
                                    }}
                                    title={`${item.status}: ${item.count}`}
                                />
                            </div>

                            <span className="mt-3 text-center text-xs text-gray-500">
                                {item.status}
                            </span>
                        </div>
                    );
                })}
            </div>

            <p className="mt-4 text-sm text-gray-500">
                Total applications: <span className="font-semibold text-gray-800">{total}</span>
            </p>
        </div>
    );
};

export default ApplicationChart;
