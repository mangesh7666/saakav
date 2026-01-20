import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Form, Button, Alert } from "react-bootstrap";

export default function FarmerBankUPI() {
  const [form, setForm] = useState({
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upiId: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://saakav1.onrender.com/api/farmer/bank-details",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data) {
        setForm(res.data);
      }
    } catch (err) {
      setError("Failed to load bank details");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.bankName && !form.upiId) {
      setError("Please provide bank details or UPI ID");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/farmer/bank-details",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Bank / UPI details saved successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save details");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Bank & UPI Details</Card.Title>
        <Card.Text>
          Enter your bank account or UPI information for payments.
        </Card.Text>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Bank Name</Form.Label>
            <Form.Control
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>IFSC Code</Form.Label>
            <Form.Control
              name="ifsc"
              value={form.ifsc}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>UPI ID</Form.Label>
            <Form.Control
              name="upiId"
              value={form.upiId}
              onChange={handleChange}
            />
          </Form.Group>

          <Button type="submit" variant="success">
            Save Details
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
