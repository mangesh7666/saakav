import { Offcanvas, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/logout";

export default function AdminSidebar({ show, onHide }) {
  const navigate = useNavigate();

  const go = path => {
    navigate(path);
    onHide();
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div
        className="d-none d-lg-block"
        style={{
          width: 260,
          background: "#1f2937",
          color: "#fff",
          minHeight: "100vh",
          padding: 20,
          position: "fixed",
top: 0,
left: 0,
height: "100vh",
width: 260,
overflowY: "auto"

        }}
      >
        <SidebarContent go={navigate} />
      </div>

      {/* MOBILE OFFCANVAS */}
      <Offcanvas show={show} onHide={onHide} className="d-lg-none">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarContent go={go} />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function SidebarContent({ go }) {
  return (
    <>
      <h4 className="text-center mb-4">🛡️ Admin Panel</h4>

      <Nav className="flex-column gap-1">

        <Nav.Link onClick={() => go("/admin/dashboard")}>Dashboard</Nav.Link>

        <Nav.Link onClick={() => go("/admin/profile")}>My Profile</Nav.Link>
        <Nav.Link onClick={() => go("/admin/help")}>Help Centre</Nav.Link>
        <Nav.Link onClick={() => go("/admin/bank-upi")}>Bank & UPI</Nav.Link>
        <Nav.Link onClick={() => go("/admin/payments")}>Payments & Refunds</Nav.Link>

        <hr />

        <Nav.Link onClick={() => go("/admin/uploaded-crops")}>Uploaded Crops</Nav.Link>
        <Nav.Link onClick={() => go("/admin/pending-crops")}>Pending Crops</Nav.Link>
        <Nav.Link onClick={() => go("/admin/approved-crops")}>Approved Crops</Nav.Link>
        <Nav.Link onClick={() => go("/admin/cancelled-crops")}>Cancelled Crops</Nav.Link>
        <Nav.Link onClick={() => go("/admin/publishcrop")}>Publish Crops</Nav.Link>

        <hr />

        <Nav.Link onClick={() => go("/admin/orders")}>Customer Orders</Nav.Link>
        <Nav.Link onClick={() => go("/admin/history")}>History</Nav.Link>
        <Nav.Link onClick={() => go("/admin/legal")}>Legal & Policies</Nav.Link>
        <Nav.Link onClick={() => go("/admin/settings")}>Settings</Nav.Link>

        <Nav.Link onClick={logout} className="text-danger">
          Logout
        </Nav.Link>
      </Nav>
    </>
  );
}
