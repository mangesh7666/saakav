import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= VALIDATION & HANDLERS (Unchanged) ================= */
  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = password => password.length >= 8;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    let newErrors = { ...errors };
    if (name === "email") newErrors.email = validateEmail(value) ? "" : "Enter a valid email address";
    if (name === "password") newErrors.password = validatePassword(value) ? "" : "Password must be at least 8 characters";
    setErrors(newErrors);
  };

  const isFormValid = validateEmail(form.email) && validatePassword(form.password);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      setLoading(true);
      setServerError("");
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      if (res.data.role === "farmer") navigate("/farmer/dashboard");
      else if (res.data.role === "user") navigate("/user/products");
      else if (res.data.role === "organization") navigate("/organization/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FANCY STYLES ================= */
  const containerStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed", // Keeps background still while scrolling
    minHeight: "100vh",
  };

  const cardStyle = {
    width: "400px",
    backdropFilter: "blur(12px)", // Glass effect
    backgroundColor: "rgba(255, 255, 255, 0.85)", 
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  };

  return (
    <div style={containerStyle} className="d-flex align-items-center justify-content-center">
      <Container className="d-flex justify-content-center">
        <Card className="shadow-lg p-3" style={cardStyle}>
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-1" style={{ color: "#2c3e50" }}>Welcome Back</h2>
              <p className="text-muted small">Please login to manage your account</p>
            </div>

            {serverError && <Alert variant="danger" className="py-2 small">{serverError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  isValid={form.email && !errors.email}
                  style={{ borderRadius: "10px", padding: "12px" }}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  isValid={form.password && !errors.password}
                  style={{ borderRadius: "10px", padding: "12px" }}
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                className="w-100 fw-bold shadow-sm"
                variant="success" // Changed to green for a fresh look
                disabled={!isFormValid || loading}
                style={{ borderRadius: "10px", padding: "12px", transition: "0.3s" }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <p className="text-muted small mb-1">
                New user? <Link to="/register" className="text-success fw-bold text-decoration-none">Create Account</Link>
              </p>
              <hr className="my-3" />
              <Link to="/admin/login" className="text-danger small fw-semibold text-decoration-none">
                Switch to Admin Portal
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}