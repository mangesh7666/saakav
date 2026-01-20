import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Button
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/logout";

export default function OrganizationNavbar() {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Brand
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => navigate("/organization/dashboard")}
        >
          🏢 Organization Panel
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="org-navbar" />

        <Navbar.Collapse id="org-navbar">
          <Nav className="me-auto">

            {/* DASHBOARD */}
            <Nav.Link onClick={() => navigate("/organization/dashboard")}>
              Dashboard
            </Nav.Link>

            {/* ACCOUNT */}
            <NavDropdown title="Account" menuVariant="light">
              <NavDropdown.Item onClick={() => navigate("/organization/profile")}>
                My Profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/organization/help")}>
                Help Centre
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => navigate("/organization/settings")}>
                Settings
              </NavDropdown.Item>
            </NavDropdown>

            {/* PAYMENTS */}
            <NavDropdown title="Payments" menuVariant="light">
              <NavDropdown.Item onClick={() => navigate("/organization/bank-upi")}>
                Bank & UPI Details
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/organization/payments")}>
                Payment & Refund
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/organization/history")}>
                History
              </NavDropdown.Item>
            </NavDropdown>

            {/* CROPS / PROCUREMENT */}
            <NavDropdown title="Procurement" menuVariant="light">
              <NavDropdown.Item onClick={() => navigate("/organization/crops")}>
                Available Crops
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/organization/orders")}>
                Purchase Orders
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/organization/contracts")}>
                Contracts / Deals
              </NavDropdown.Item>
            </NavDropdown>

            {/* LOGISTICS */}
            <NavDropdown title="Logistics" menuVariant="light">
              <NavDropdown.Item onClick={() => navigate("/organization/shipments")}>
                Shipments
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/organization/invoices")}>
                Invoices
              </NavDropdown.Item>
            </NavDropdown>

            {/* LEGAL */}
            <Nav.Link onClick={() => navigate("/organization/legal")}>
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
