
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/Mainlayout";
import ApplicationsList from "../features/applications/ApplicationsList";
import ApplicationDetails from "../features/applications/ApplicationDetails";
import Dashboard from "../features/dashboard/dashboard";

import Pipeline from "../features/pipeline/Pipeline";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="applications" element={<ApplicationsList />} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="applications/:id" element={<ApplicationDetails />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
