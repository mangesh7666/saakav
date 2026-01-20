import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HelpRequestForm() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [helps, setHelps] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchMyHelps = async () => {
    try {
      const res = await axios.get("https://saakav1.onrender.com/api/user/help", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHelps(res.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyHelps();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    try {
      await axios.post(
        "https://saakav1.onrender.com/api/user/userhelp",
        {
          subject: formData.subject,
          message: formData.message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSubmitted(true);
      setFormData({ subject: "", message: "" });
      fetchMyHelps(); // 🔄 refresh list
    } catch {
      setError("Failed to submit help request");
    }
  };

  return (
    <div className="container my-5">
      {/* ================= FORM ================= */}
      <Row className="justify-content-center mb-5">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h3 className="text-center mb-3">Need Help?</h3>
              <p className="text-center text-muted">
                Submit your query and our support team will get back to you.
              </p>

              {submitted && (
                <Alert variant="success">
                  Your request has been submitted successfully!
                </Alert>
              )}

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Help Category</Form.Label>
                  <Form.Select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select an issue</option>
                    <option value="Account Issue">Account Issue</option>
                    <option value="Payment Problem">Payment Problem</option>
                    <option value="Order / Delivery">Order / Delivery</option>
                    <option value="Seller Support">Seller Support</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Your Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="success" size="lg">
                    Submit Request
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ================= MY HELP REQUESTS ================= */}
      <h4 className="mb-3 text-center">My Help Requests</h4>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="success" />
        </div>
      ) : helps.length === 0 ? (
        <Alert variant="info" className="text-center">
          No help requests submitted yet.
        </Alert>
      ) : (
        helps.map((help) => (
          <Card key={help._id} className="mb-3 shadow-sm">
            <Card.Body className="d-flex justify-content-between">
              <div>
                <h6>{help.subject}</h6>
                <p className="text-muted mb-1">{help.message}</p>
                <small className="text-muted">
                  {new Date(help.createdAt).toLocaleString()}
                </small>
              </div>

              <Badge bg={help.status === "resolved" ? "success" : "warning"}>
                {help.status.toUpperCase()}
              </Badge>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}
