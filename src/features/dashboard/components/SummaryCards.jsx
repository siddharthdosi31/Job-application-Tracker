const SummaryCard = ({ title, count, icon: Icon, color }) => {
    return (
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 sm:p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {title}
                </p>

                <div className={`rounded-lg p-2 ${color}`}>
                    <Icon size={20} />
                </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-gray-800 dark:text-white">
                {count}
            </h2>
        </div>
    );
};

export default SummaryCard;
