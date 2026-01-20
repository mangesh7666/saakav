import { Card, Table, Badge, Form, Row, Col } from "react-bootstrap";
import { useState } from "react";

export default function AdminHistory() {
  const [filterStatus, setFilterStatus] = useState("All");

  const historyData = [
    { id: 1, action: "Crop uploaded (Wheat – 500kg)", by: "Farmer Ramesh", type: "Crop", status: "Pending", date: "2026-01-01" },
    { id: 2, action: "Payment released ₹12,000", by: "Admin", type: "Payment", status: "Paid", date: "2026-01-01" },
    { id: 3, action: "Order placed (Rice – 10kg)", by: "User Ankit", type: "Order", status: "Processing", date: "2026-01-02" },
    { id: 4, action: "Crop approved (Corn – 300kg)", by: "Admin", type: "Crop", status: "Approved", date: "2026-01-02" },
    { id: 5, action: "Order marked Delivered (Wheat – 10kg)", by: "Admin", type: "Order", status: "Delivered", date: "2026-01-03" },
  ];

  const filteredHistory = filterStatus === "All"
    ? historyData
    : historyData.filter(item => item.status === filterStatus);

  const getBadge = status => {
    switch (status) {
      case "Pending": return "warning";
      case "Approved": return "success";
      case "Rejected": return "danger";
      case "Processing": return "info";
      case "Delivered": return "success";
      case "Paid": return "success";
      default: return "secondary";
    }
  };

  return (
    <>
      <h3 className="mb-4">📝 Admin Activity History</h3>

      {/* FILTER */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form>
            <Row className="align-items-center">
              <Col md={3}>
                <Form.Label>Status Filter</Form.Label>
                <Form.Select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Processing</option>
                  <option>Delivered</option>
                  <option>Paid</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* HISTORY TABLE */}
      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Action</th>
                <th>Performed By</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.action}</td>
                    <td>{item.by}</td>
                    <td>{item.type}</td>
                    <td>
                      <Badge bg={getBadge(item.status)}>{item.status}</Badge>
                    </td>
                    <td>{item.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No history found for selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}
