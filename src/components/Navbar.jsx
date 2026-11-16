
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

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

function Navbar({ onMenuClick }) {
  const location = useLocation();

  const currentPage = pageDetails[location.pathname] || {
    title: "Applied",
    description: "Manage your job applications",
  };

  return (
    <header className="flex min-w-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:px-8 sm:py-5">
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="shrink-0 rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
            {currentPage.title}
          </h1>

          <p className="mt-1 hidden text-sm text-gray-500 sm:block">
            {currentPage.description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(
            new Event("open-create-application")
          );
        }}
        className="shrink-0 rounded-lg bg-indigo-600 px-3 py-2.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 sm:px-4 sm:text-sm"
      >
        <span className="sm:hidden">+ Add</span>
        <span className="hidden sm:inline">+ Add Application</span>
      </button>
    </header>
  );
}

export default Navbar;
