import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";

export default function UserLayout() {
  return (
    <>
      {/* Navbar visible on all farmer pages */}
      <UserNavbar/>

      {/* Page content */}
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
}
