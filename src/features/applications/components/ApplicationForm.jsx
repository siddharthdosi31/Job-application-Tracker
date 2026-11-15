function ApplicationForm({ form, applicationDetails = null }) {
  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const renderField = (name, label, type = "text") => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
        <p className="mt-1 text-xs text-red-600">{form.errors[name]}</p>
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
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
        <p className="-mt-4 text-xs text-red-600">
          {form.errors.salaryMax}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
          <p className="mt-1 text-xs text-red-600">{form.errors.notes}</p>
        )}
      </div>

      {applicationDetails && (
        <>
          <div className="border-t border-gray-200 pt-5">
            <h3 className="mb-4 font-semibold text-gray-900">
              Status History
            </h3>

            {applicationDetails.statusHistory?.length ? (
              <div className="space-y-4">
                {applicationDetails.statusHistory.map((entry, index) => (
                  <div key={`${entry.changedAt}-${index}`}>
                    <p className="text-sm font-medium capitalize text-gray-800">
                      {entry.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      {entry.changedAt
                        ? new Date(entry.changedAt).toLocaleString("en-IN")
                        : "-"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No status history available.
              </p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 text-xs text-gray-500">
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