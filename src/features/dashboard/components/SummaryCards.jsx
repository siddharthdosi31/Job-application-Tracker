
const SummaryCard = ({ title, count, icon: Icon, color }) => {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                    {title}
                </p>

                <div className={`rounded-lg p-2 ${color}`}>
                    <Icon size={20} />
                </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-gray-800">
                {count}
            </h2>
        </div>
    );
};

export default SummaryCard;
