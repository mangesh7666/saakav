import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Button
} from "react-bootstrap";
import { logout } from "../utils/logout";
import { useNavigate } from "react-router-dom";

export default function UserNavbar() {
  const navigate = useNavigate();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Brand
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => navigate("/user/dashboard")}
        >
          🛒 Saakav
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="user-navbar" />

        <Navbar.Collapse id="user-navbar">
          <Nav className="me-auto">

            {/* DASHBOARD */}
            <Nav.Link onClick={() => navigate("/user/dashboard")}>
              Dashboard
            </Nav.Link>

            {/* ACCOUNT */}
            <NavDropdown title="Account" menuVariant="light">
              <NavDropdown.Item onClick={() => navigate("/user/myprofile")}>
                My Profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/user/helpcenter")}>
                Help Centre
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => navigate("/user/settings")}>
                Settings
              </NavDropdown.Item>
            </NavDropdown>
            
            {/* SHOPPING */}
            <NavDropdown title="Shop" menuVariant="light">
              <NavDropdown.Item onClick={() => navigate("/user/products")}>
                Catalogue / Categories
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/user/wishlist")}>
                Wishlist
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/user/cart")}>
                Cart
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/user/orders")}>
                My Orders
              </NavDropdown.Item>
            </NavDropdown>

            {/* LEGAL */}
            <Nav.Link onClick={() => navigate("/user/legal")}>
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
