import React, { useEffect, useState } from "react";
import { Card, Table, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

export default function FarmerHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/farmer/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>History</Card.Title>
        <Card.Text>Track all your crop uploads, payments, and actions.</Card.Text>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Action</th>
              <th>Quantity / Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No history found
                </td>
              </tr>
            ) : (
              history.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.type} {item.name ? `- ${item.name}` : ""}</td>
                  <td>{item.quantity ? `${item.quantity} kg` : item.amount}</td>
                   <td>{item.type} {item.status ? `- ${item.status}` : ""}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
