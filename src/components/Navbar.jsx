
import { Link, useLocation } from "react-router-dom";

const pageDetails = {
  "/": {
    title: "Dashboard",
    description: "Overview of your job application progress",
  },
  "/applications": {
    title: "Applications",
    description: "Manage and track all your job applications",
  },
  "/pipeline": {
    title: "Pipeline",
    description: "Track your applications through each stage",
  },
};

function Navbar() {
  const location = useLocation();

  const currentPage = pageDetails[location.pathname] || {
    title: "Applied",
    description: "Manage your job applications",
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {currentPage.title}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {currentPage.description}
        </p>
      </div>

      <Link
        to="/applications/new"
        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
      >
        + Add Application
      </Link>
    </header>
  );
}

export default Navbar;
