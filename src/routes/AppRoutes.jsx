
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/Mainlayout";
import ApplicationsList from "../features/applications/ApplicationsList";

function Dashboard() {
  return <h2 className="text-xl font-semibold">Dashboard</h2>;
}

function Applications() {
  return <h2 className="text-xl font-semibold">Applications</h2>;
}

function Pipeline() {
  return <h2 className="text-xl font-semibold">Pipeline</h2>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="applications" element={<ApplicationsList />} />
        <Route path="pipeline" element={<Pipeline />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
