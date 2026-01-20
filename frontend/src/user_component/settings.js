import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";

export default function UserSettings() {
  const token = localStorage.getItem("token");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 🔹 Fetch profile
  useEffect(() => {
    axios
      .get("https://saakav1.onrender.com/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile((prev) => ({
          ...prev,
          ...res.data,
        }));
      })
      .catch(() => setError("Failed to load profile"));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 🔹 Update Profile
  const updateProfile = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/user/update-profile",
        {
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          state: profile.state,
          city: profile.city,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Profile updated successfully");
    } catch {
      setError("Profile update failed");
    }
  };

  // 🔹 Change Password
  const changePassword = async () => {
    if (profile.newPassword !== profile.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await axios.put(
        "https://saakav1.onrender.com/api/user/change-password",
        {
          currentPassword: profile.currentPassword,
          newPassword: profile.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Password changed successfully");
      setProfile({
        ...profile,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      setError("Password change failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    updateProfile();
    if (profile.currentPassword && profile.newPassword) {
      changePassword();
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 fw-bold">⚙️ Account Settings</h2>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          {/* PROFILE */}
          <Col md={6} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h5>👤 Profile</h5>

                <Form.Group className="mb-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control value={profile.email} disabled />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Control
                      placeholder="State"
                      name="state"
                      value={profile.state}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      placeholder="City"
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* SECURITY */}
          <Col md={6} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h5>🔐 Security</h5>

                <Form.Control
                  className="mb-2"
                  type="password"
                  placeholder="Current Password"
                  name="currentPassword"
                  value={profile.currentPassword}
                  onChange={handleChange}
                />

                <Form.Control
                  className="mb-2"
                  type="password"
                  placeholder="New Password"
                  name="newPassword"
                  value={profile.newPassword}
                  onChange={handleChange}
                />

                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={profile.confirmPassword}
                  onChange={handleChange}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Button type="submit" variant="success" size="lg">
          💾 Save Changes
        </Button>
      </Form>
    </Container>
  );
}
