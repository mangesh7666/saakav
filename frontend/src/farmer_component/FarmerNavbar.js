import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { logout } from "../utils/logout";
import { useNavigate } from "react-router-dom";

export default function FarmerNavbar() {
  const navigate = useNavigate();

  return (
    <Navbar bg="success" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Brand
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => navigate("/farmer/dashboard")}
        >
          🌾 Farmer Panel
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="farmer-navbar" />

        <Navbar.Collapse id="farmer-navbar">
          <Nav className="me-auto">

            {/* DASHBOARD */}
            <Nav.Link onClick={() => navigate("/farmer/dashboard")}>
              Dashboard
            </Nav.Link>

            {/* PROFILE & SUPPORT */}
            <NavDropdown title="Account" menuVariant="light">
              <NavDropdown.Item onClick={() => navigate("/farmer/profile")}>
                My Profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/farmer/help")}>
                Help Centre
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => navigate("/farmer/settings")}>
                Settings
              </NavDropdown.Item>
            </NavDropdown>

            {/* BANK & PAYMENTS */}
            <NavDropdown title="Payments" menuVariant="light">
              <NavDropdown.Item onClick={() => navigate("/farmer/bank-upi")}>
                Bank & UPI Details
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/farmer/payments")}>
                Payment & Refund
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/farmer/history")}>
                History
              </NavDropdown.Item>
            </NavDropdown>

            {/* CROPS MANAGEMENT */}
            <NavDropdown title="Crops" menuVariant="light">
              <NavDropdown.Item onClick={() => navigate("/farmer/upload-crop")}>
                Upload / Share Crops
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/farmer/pending-crops")}>
                Pending Crops
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/farmer/approved-crops")}>
                Approved Crops
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/farmer/cancelled-crops")}>
                Cancelled Crops
              </NavDropdown.Item>
            </NavDropdown>

            {/* LEGAL */}
            <Nav.Link onClick={() => navigate("/farmer/legal")}>
              Legal & Policies
            </Nav.Link>

          </Nav>

          {/* LOGOUT */}
          <Button
            variant="outline-light"
            onClick={logout}
            className="ms-lg-3"
          >
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
