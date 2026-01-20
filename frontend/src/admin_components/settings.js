import { Card, Form, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /* ================= FETCH ADMIN SETTINGS ================= */
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://saakav1.onrender.com/api/admin/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSettings((prev) => ({
          ...prev,
          name: res.data.name,
          email: res.data.email,
        }));
      } catch (err) {
        setError("Failed to load admin settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ================= UPDATE PROFILE ================= */
  const handleSaveProfile = async () => {
    try {
      setMessage("");
      setError("");
      setLoading(true);

      await axios.put(
        "https://saakav1.onrender.com/api/admin/settings/profile",
        { name: settings.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const handleChangePassword = async () => {
    if (settings.newPassword !== settings.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      setMessage("");
      setError("");
      setLoading(true);

      await axios.put(
        "https://saakav1.onrender.com/api/admin/settings/password",
        {
          currentPassword: settings.currentPassword,
          newPassword: settings.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Password updated successfully");

      setSettings({
        ...settings,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <h3 className="mb-4">⚙️ Admin Settings</h3>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* ================= PROFILE SETTINGS ================= */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Profile Settings</h5>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  name="name"
                  value={settings.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control value={settings.email} disabled />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="success" onClick={handleSaveProfile}>
            Save Profile
          </Button>
        </Card.Body>
      </Card>

      {/* ================= CHANGE PASSWORD ================= */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Change Password</h5>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  name="currentPassword"
                  value={settings.currentPassword}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={settings.newPassword}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={settings.confirmPassword}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="warning" onClick={handleChangePassword}>
            Change Password
          </Button>
        </Card.Body>
      </Card>

      {/* ================= NOTIFICATIONS ================= */}
      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Notification Preferences</h5>

          <Form.Check
            type="switch"
            label="Enable notifications"
            name="notifications"
            checked={settings.notifications}
            onChange={handleChange}
            disabled
          />
          <small className="text-muted">
            (Notification settings demo only)
          </small>
        </Card.Body>
      </Card>
    </>
  );
}
