import FarmerNavbar from "../farmer_component/FarmerNavbar";
import UserNavbar from "../user_component/UserNavbar";
import OrgNavbar from "../organization_component/OrgNavbar";
import AdminNavbar from "../admin_components/AdminSidebar";

export default function NavbarLoader() {
  const role = localStorage.getItem("role");

  if (role === "farmer") return <FarmerNavbar />;
  if (role === "user") return <UserNavbar />;
  if (role === "organization") return <OrgNavbar />;
  if (role === "admin") return <AdminNavbar />;

  return null;
}
