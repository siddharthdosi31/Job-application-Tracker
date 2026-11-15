
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Kanban,
} from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Applications",
    path: "/applications",
    icon: BriefcaseBusiness,
  },
  {
    name: "Pipeline",
    path: "/pipeline",
    icon: Kanban,
  },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-gray-200 bg-white px-5 py-6">

      {/* Application Branding */}
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
          A
        </div>

        <h1 className="text-xl font-bold text-gray-900">
          Applied
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto border-t border-gray-200 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
            S
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Siddharth
            </p>
            <p className="text-xs text-gray-500">
              Personal workspace
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
