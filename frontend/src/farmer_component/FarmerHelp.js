import React, { useState } from "react";
import axios from "axios";
import { Card, Form, Button, Alert } from "react-bootstrap";

export default function FarmerHelp() {
  const [form, setForm] = useState({
    subject: "",
    message: "",
  });

  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.subject || !form.message) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setError("");
      setResponse("");

      await axios.post(
        "https://saakav1.onrender.com/api/farmer/help",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponse("Your query has been submitted! We will contact you soon.");
      setForm({ subject: "", message: "" });
    } catch (err) {
      setError("Failed to submit query. Please try again.");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Help Centre</Card.Title>
        <Card.Text>
          If you face any issues, please submit your query here.
        </Card.Text>

        {response && <Alert variant="success">{response}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              name="subject"
              placeholder="Enter subject"
              value={form.subject}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="message"
              placeholder="Write your query"
              value={form.message}
              onChange={handleChange}
            />
          </Form.Group>

          <Button type="submit" variant="success">
            Submit Query
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
