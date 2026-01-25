import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Navbar,
  Nav,
  Modal,
  Spinner,
} from "react-bootstrap";

export default function Login() {
  const navigate = useNavigate();

  /* ================= LOGIN STATES ================= */
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  /* ================= PRODUCTS STATES ================= */
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://saakav1.onrender.com/api/user/user/crops"
        );
        setProducts(res.data);
      } catch (err) {
        setProductsError("Failed to load products");
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= VALIDATION ================= */
  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = password => password.length >= 8;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    let newErrors = { ...errors };
    if (name === "email")
      newErrors.email = validateEmail(value)
        ? ""
        : "Enter a valid email address";
    if (name === "password")
      newErrors.password = validatePassword(value)
        ? ""
        : "Password must be at least 8 characters";
    setErrors(newErrors);
  };

  const isFormValid =
    validateEmail(form.email) && validatePassword(form.password);

  /* ================= LOGIN SUBMIT ================= */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setLoading(true);
      setServerError("");

      const res = await axios.post(
        "https://saakav1.onrender.com/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      setShowLogin(false);

      if (res.data.role === "farmer")
        navigate("/farmer/dashboard");
      else if (res.data.role === "user")
        navigate("/user/products");
      else if (res.data.role === "organization")
        navigate("/organization/dashboard");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= STYLES ================= */
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1470&q=80')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "60vh",
    color: "#fff",
  };

  return (
    <>
      {/* ================= RESPONSIVE NAVBAR ================= */}
      <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Brand className="fw-bold text-success">
            Saakav
          </Navbar.Brand>

          {/* ✅ REQUIRED FOR RESPONSIVENESS */}
          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto mt-3 mt-lg-0">
              <Button
                variant="outline-success"
                className="me-lg-2 mb-2 mb-lg-0"
                onClick={() => setShowLogin(true)}
              >
                Login
              </Button>

              <Button
                variant="success"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ================= HERO ================= */}
      <div style={heroStyle} className="d-flex align-items-center">
        <Container className="text-center">
          <h1 className="fw-bold">Fresh Crops Direct From Farmers</h1>
          <p className="lead mt-3">
            Buy high-quality agricultural products at the best price.
          </p>
          <Button
            variant="success"
            size="lg"
            onClick={() => setShowLogin(true)}
          >
            Get Started
          </Button>
        </Container>
      </div>

      {/* ================= PRODUCTS ================= */}
      <Container className="my-5">
        <h2 className="fw-bold mb-4 text-center">
          Available Products
        </h2>

        {productsLoading && (
          <div className="text-center">
            <Spinner animation="border" variant="success" />
          </div>
        )}

        {productsError && (
          <Alert variant="danger" className="text-center">
            {productsError}
          </Alert>
        )}

       <div className="row g-4">
  {products.map(product => {
    const imageUrl =
      product.image || "https://dummyimage.com/400x300/cccccc/000000&text=No+Image";

    return (
      <div className="col-md-4" key={product._id}>
        <Card className="shadow-sm h-100 border-0">
          <div style={{ height: "200px", overflow: "hidden" }}>
            <Card.Img
              src={imageUrl}
              alt={product.name}
              style={{ objectFit: "cover", height: "100%" }}
              onError={e => {
                e.target.src =
                  "https://dummyimage.com/400x300/cccccc/000000&text=No+Image";
              }}
            />
          </div>

          <Card.Body>
            <Card.Title className="fw-bold">{product.name}</Card.Title>
            <Card.Text className="text-muted small">
              {product.description || "No description available"}
            </Card.Text>
            <h6 className="text-success fw-bold">₹{product.sellingPrice}</h6>
          </Card.Body>
        </Card>
      </div>
    );
  })}
</div>

      </Container>

      {/* ================= LOGIN MODAL ================= */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Body>
          <Card className="shadow-lg p-3">
            <Card.Body>
              <h4 className="text-center fw-bold mb-3">
                Welcome Back To Saakav
              </h4>
  
              {serverError && (
                <Alert variant="danger" className="py-2 small">
                  {serverError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  disabled={!isFormValid || loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <Link
                  to="/register"
                  className="text-primary small text-decoration-none"
                >
                  Create new account
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </>
  );
}
