import React, { useState, useEffect } from "react";
import { Card, Table, Badge, Button, Form, Row, Col, Container, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

export default function AdminHelp() {
  const [messages, setMessages] = useState([]);
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to get headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // 1. Fetch all enquiries
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const config = getAuthHeaders();

      // Ensure your backend URL is correct
      const response = await axios.get("https://saakav1.onrender.com/api/admin/all-help", config);
      
      setMessages(response.data);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      const message = err.response?.data?.message || "Failed to load enquiries.";
      setError(err.response?.status === 401 ? "Unauthorized: Please login as Admin." : message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 2. Update status from 'open' to 'resolved'
  const handleResolve = async (id) => {
    try {
      const config = getAuthHeaders();
      const response = await axios.patch(
        `https://saakav1.onrender.com/api/admin/help/status/${id}`,
        { status: "resolved" },
        config
      );

      if (response.status === 200) {
        // Update local state directly so the UI updates instantly
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, status: "resolved" } : msg))
        );
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Could not update status"));
    }
  };

  // Filter logic
  const filteredMessages = messages.filter((msg) => {
    if (filterRole === "all") return true;
    // Assuming 'farmer' object has a 'role' field from your User model
    return msg.farmer?.role === filterRole;
  });

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>🛡️ Help Center - Admin Dashboard</h3>
        <Button variant="outline-primary" onClick={fetchMessages} size="sm">
          🔄 Refresh
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filter Card */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body>
          <Form.Group as={Row} className="align-items-center">
            <Form.Label column sm={2} className="fw-bold">Filter by Role:</Form.Label>
            <Col sm={4}>
              <Form.Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Enquiries</option>
                <option value="user">User</option>
                <option value="farmer">Farmer</option>
                <option value="organization">Organization</option>
              </Form.Select>
            </Col>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Data Table */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Fetching help requests...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No messages found.</p>
            </div>
          ) : (
            <Table responsive hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Sender</th>
                   <th>Phone No</th>
                  <th>Subject & Message</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg) => (
                  <tr key={msg._id}>
                    <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="fw-bold">{msg.farmer?.name || "Unknown"}</div>
                      <div className="text-muted small">{msg.farmer?.email}</div>
                      <Badge bg="secondary" style={{ fontSize: '10px' }}>
                        {msg.farmer?.role?.toUpperCase()}
                      </Badge>
                    </td>
                    <td><div className="small text-dark">{msg.farmer?.phone}</div></td>
                    <td>
                      <div className="fw-bold text-primary">{msg.subject}</div>
                      <div className="small text-dark">{msg.message}</div>
                    </td>
                    <td>
                      <Badge bg={msg.status === "open" ? "warning" : "success"}>
                        {msg.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="text-end">
                      {msg.status === "open" && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleResolve(msg._id)}
                        >
                          Mark Resolved
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
