import { Card, Row, Col, Form, Button, Badge, Alert, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    status: ""
  });

  const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
  
    const token = localStorage.getItem("token");

    /* ================= FETCH PROFILE ================= */
    useEffect(() => {
      const fetchProfile = async () => {
        try{
          const res = await axios.get(
            "http://localhost:5000/api/admin/adminprofile",{
            headers: {
              Authorization : `Bearer ${token}`,
            },
          }
          );
          setProfile(res.data);
        } catch (err) {
          setError ("fail to load profile");
        } finally {
          setLoading (false);
        }
      };

      fetchProfile();
    }, [token]);


  const handleChange = e => {
     const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

   /* ================= UPDATE PROFILE ================= */
  const handleSubmit = async e => {
    e.preventDefault();
    try{
      setMessage("");
      setError("");

      await axios.put(
        "http://localhost:5000/api/admin/adminprofileupdate",
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile updated successfully");
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
    <>
      <h3 className="mb-4">🛡️ Admin Profile</h3>

      {/* PROFILE SUMMARY */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={2} className="text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="admin"
                width={90}
              />
            </Col>
            <Col md={7}>
              <h5>{profile.name}</h5>
              <p className="mb-1">{profile.email}</p>
            </Col>
            <Col md={3} className="text-end">
              <Badge bg="success">{profile.status}</Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

  {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

      {/* PERSONAL & ACCOUNT DETAILS */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Account Details</h5>
          <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
            
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  disabled
                  value={profile.email}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  disabled
                  value={profile.role}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Permissions</Form.Label>
                <Form.Control
                  disabled
                  value= "all permissions"
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type = "submit">
            Save Changes
          </Button>
          </Form>
        </Card.Body>
      </Card>
      
    </>
  );
}
