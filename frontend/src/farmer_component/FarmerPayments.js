import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Badge, Alert, Spinner } from "react-bootstrap";

export default function FarmerPayments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const res = await axios.get(
        "http://localhost:5000/api/farmer/payments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Payments response:", res.data);

      // ✅ Always ensure array
      setPayments(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Unable to load payments");
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>💰 Payments & Settlements</Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Crop</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Transaction</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((p, i) => (
                <tr key={p._id}>
                  <td>{i + 1}</td>
                  <td>{p.crop}</td>
                  <td>{p.quantity}</td>
                  <td>₹{p.amount}</td>
                  <td>{p.paymentMode}</td>
                  <td>{p.transactionId || "—"}</td>
                  <td>
                    {p.paymentDate
                      ? new Date(p.paymentDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    <Badge bg={p.paymentStatus === "Paid" ? "success" : "warning"}>
                      {p.paymentStatus}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
