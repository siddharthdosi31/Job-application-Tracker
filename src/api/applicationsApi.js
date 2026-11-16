const BASE_URL = "http://localhost:3001";
const PAGE_LIMIT = 10;

export const getApplications = async ({
  q = "",
  status = "",
  page = 1,
  sortBy = "dateApplied",
  order = "desc",
} = {}) => {
  const params = new URLSearchParams();

  if (q.trim()) params.set("q", q.trim());
  if (status) params.set("status", status);

  params.set("_page", page);
  params.set("_limit", PAGE_LIMIT);
  params.set("_sort", sortBy);
  params.set("_order", order);

  const response = await fetch(
    `${BASE_URL}/applications?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  const data = await response.json();
  const total = Number(response.headers.get("X-Total-Count") || 0);

  return { data, total };
};
export const getApplicationById = async (id) => {
  const response = await fetch(`${BASE_URL}/applications/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch application details");
  }

  return response.json();
};
// Update an existing application
export const updateApplication = async ({
  id,
  updates,
  currentApplication,
}) => {
  const now = new Date().toISOString();

  const updatedData = {
    ...updates,
    updatedAt: now,
  };

  // Add a new status history entry only when the status changes
  if (updates.status && updates.status !== currentApplication.status) {
    updatedData.statusHistory = [
      ...(currentApplication.statusHistory || []),
      {
        status: updates.status,
        changedAt: now,
      },
    ];
  }

  const response = await fetch(`${BASE_URL}/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error("Failed to update application");
  }

  return response.json();
};
// Create a new application
export const createApplication = async (applicationData) => {
  const now = new Date().toISOString();

  const newApplication = {
    ...applicationData,
    statusHistory: [
      {
        status: applicationData.status,
        changedAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  const response = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newApplication),
  });

  if (!response.ok) {
    throw new Error("Failed to create application");
  }

  return response.json();
};

// Delete an application
export const deleteApplication = async (id) => {
    const response = await fetch(`${BASE_URL}/applications/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete application");
    }

    return id;
};
// Fetch all applications for the dashboard
export const getAllApplications = async () => {
  const response = await fetch(`${BASE_URL}/applications`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard applications");
  }

  return response.json();
};