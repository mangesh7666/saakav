import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";

export default function FarmerProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://saakav1.onrender.com/api/farmer/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setForm(res.data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /* ================= UPDATE PROFILE ================= */
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setMessage("");
      setError("");

      await axios.put(
        "https://saakav1.onrender.com/api/farmer/profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError("Profile update failed");
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>My Profile</Card.Title>
        <Card.Text>
          View and update your personal information.
        </Card.Text>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              value={form.email || ""}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="address"
              value={form.address || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control
                  name="state"
                  value={form.state || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  name="city"
                  value={form.city || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </div>

          <Button type="submit" variant="success">
            Update Profile
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
