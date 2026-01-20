import FarmerNavbar from "./FarmerNavbar";
import { Outlet } from "react-router-dom";

export default function FarmerLayout() {
  return (
    <>
      {/* Navbar visible on all farmer pages */}
      <FarmerNavbar />

      {/* Page content */}
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
}
