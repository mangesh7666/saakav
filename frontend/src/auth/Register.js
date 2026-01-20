import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

export default function Register() {
  const navigate = useNavigate();

  /* ================= FORM STATE ================= */

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    role: "farmer",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= VALIDATIONS ================= */

  const validateName = name =>
    /^[A-Za-z\s]+$/.test(name) && name.length >= 3;

  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = phone =>
    /^[6-9]\d{9}$/.test(phone); // Indian mobile numbers

  const validateText = value =>
    value.trim().length >= 3;

  const validatePassword = password => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  });

  /* ================= HANDLE CHANGE ================= */

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    let newErrors = { ...errors };

    if (name === "name") {
      newErrors.name = validateName(value)
        ? ""
        : "Name must contain only letters (min 3)";
    }

    if (name === "email") {
      newErrors.email = validateEmail(value)
        ? ""
        : "Enter a valid email address";
    }

    if (name === "phone") {
      newErrors.phone = validatePhone(value)
        ? ""
        : "Enter valid 10-digit mobile number";
    }

    if (["address", "state", "city"].includes(name)) {
      newErrors[name] = validateText(value)
        ? ""
        : "Minimum 3 characters required";
    }

    if (name === "password") {
      newErrors.password = validatePassword(value);
    }

    setErrors(newErrors);
  };

  /* ================= FINAL VALIDATION ================= */

  const isPasswordValid =
    errors.password &&
    Object.values(errors.password).every(Boolean);

  const isFormValid =
    validateName(form.name) &&
    validateEmail(form.email) &&
    validatePhone(form.phone) &&
    validateText(form.address) &&
    validateText(form.state) &&
    validateText(form.city) &&
    isPasswordValid;

  /* ================= SUBMIT ================= */

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setLoading(true);
      setServerError("");

      await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
    >
      <Card style={{ width: "480px" }} className="shadow-lg border-0">
        <Card.Body>
          <h3 className="text-center mb-4 fw-bold">
            Create Account
          </h3>

          {serverError && (
            <Alert variant="danger">{serverError}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* NAME */}
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="name"
                placeholder="Enter full name"
                onChange={handleChange}
                isInvalid={!!errors.name}
                isValid={form.name && !errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            {/* EMAIL */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                placeholder="Enter email"
                onChange={handleChange}
                isInvalid={!!errors.email}
                isValid={form.email && !errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            {/* PHONE */}
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                name="phone"
                placeholder="Enter mobile number"
                onChange={handleChange}
                isInvalid={!!errors.phone}
                isValid={form.phone && !errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            {/* ADDRESS */}
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                placeholder="Enter full address"
                onChange={handleChange}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
            </Form.Group>

            {/* STATE & CITY */}
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    name="state"
                    placeholder="State"
                    onChange={handleChange}
                    isInvalid={!!errors.state}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.state}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    name="city"
                    placeholder="City"
                    onChange={handleChange}
                    isInvalid={!!errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            {/* PASSWORD */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={handleChange}
              />

              {errors.password && (
                <ul className="small mt-2">
                  <li className={errors.password.length ? "text-success" : "text-danger"}>
                    Minimum 8 characters
                  </li>
                  <li className={errors.password.upper ? "text-success" : "text-danger"}>
                    One uppercase letter
                  </li>
                  <li className={errors.password.lower ? "text-success" : "text-danger"}>
                    One lowercase letter
                  </li>
                  <li className={errors.password.number ? "text-success" : "text-danger"}>
                    One number
                  </li>
                  <li className={errors.password.special ? "text-success" : "text-danger"}>
                    One special character
                  </li>
                </ul>
              )}
            </Form.Group>

            {/* ROLE */}
            <Form.Group className="mb-4">
              <Form.Label>Register As</Form.Label>
              <Form.Select
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="farmer">Farmer</option>
                <option value="user">User</option>
                {/*<option value="organization">Organization</option>*/}
              </Form.Select>
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              variant="success"
              disabled={!isFormValid || loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
