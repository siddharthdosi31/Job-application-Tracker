function ApplicationForm({ form, applicationDetails = null }) {
  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200";

  const errorClass = "mt-1 text-xs text-red-600 dark:text-red-400";

  const renderField = (name, label, type = "text") => (
    <div>
      <label className={labelClass}>
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
        <p className={errorClass}>{form.errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {renderField("company", "Company *")}
        {renderField("role", "Job role *")}
      </div>

      {renderField("jobUrl", "Job URL", "url")}

      <div>
        <label className={labelClass}>
          Status
        </label>

        <select
          name="status"
          value={form.values.status}
          onChange={form.handleChange}
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

      {form.errors.salaryMax && form.touched.salaryMax && (
        <p className="-mt-4 text-xs text-red-600 dark:text-red-400">
          {form.errors.salaryMax}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
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
        <label className={labelClass}>
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

        {form.touched.notes && form.errors.notes && (
          <p className={errorClass}>{form.errors.notes}</p>
        )}
      </div>

      {applicationDetails && (
        <>
          <div className="border-t border-gray-200 pt-5 dark:border-gray-700">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Status History
            </h3>

            {applicationDetails.statusHistory?.length ? (
              <div className="space-y-4">
                {applicationDetails.statusHistory.map((entry, index) => (
                  <div key={`${entry.changedAt}-${index}`}>
                    <p className="text-sm font-medium capitalize text-gray-800 dark:text-gray-200">
                      {entry.status}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.changedAt
                        ? new Date(entry.changedAt).toLocaleString("en-IN")
                        : "-"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No status history available.
              </p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <p>Application ID: {applicationDetails.id}</p>
            <p className="mt-1">
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
        </>
      )}
    </div>
  );
}

export default ApplicationForm;