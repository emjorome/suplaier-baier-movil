import { React } from "react";
import { Routes, Route } from "react-router-native";

import HomeProveedorPage from "../pages/HomeProveedorPage";
import OfertasProveedorPage from "../pages/OfertasProveedorPage";
import SearchProveedorPage from "../pages/SearchProveedorPage";
import NotificationsProveedorPage from "../pages/NotificationsProveedorPage";
import DemandasProveedorPage from "../pages/DemandasProveedorPage";

const HomeRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<HomeProveedorPage />} />
      <Route path="ofertas" element={<OfertasProveedorPage />} />
      <Route path="demandas" element={<DemandasProveedorPage />} />
      <Route path="search" element={<SearchProveedorPage />} />
      <Route path="notifications" element={<NotificationsProveedorPage />} />
    </Routes>
  );
};
export default HomeRoutes;
