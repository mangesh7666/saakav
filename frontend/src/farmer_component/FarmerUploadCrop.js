import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

export default function FarmerUploadCrop() {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    expectedPrice: "",
    category: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setForm({ ...form, image: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name || !form.quantity || !form.expectedPrice || !form.category || !form.image) {
      setError("Please fill all fields and upload an image.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("name", form.name);
      data.append("category", form.category);
      data.append("quantity", form.quantity);
      data.append("expectedPrice", form.expectedPrice);
      data.append("image", form.image);

      const res = await axios.post(
        "https://saakav1.onrender.com/api/farmer/upload-crop",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);
      setForm({ name: "", category: "", quantity: "", expectedPrice: "", image: null });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload crop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Upload / Share Crop</Card.Title>
        <Card.Text>Fill in the details below to share your crop with buyers.</Card.Text>

        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="cropName">
                <Form.Label>Crop Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter crop name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="cropCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="cropQuantity">
                <Form.Label>Quantity (kg)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter quantity in kg"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="cropExpectedPrice">
                <Form.Label>Expected Total Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter expected price per kg"
                  name="expectedPrice"
                  value={form.expectedPrice}
                  onChange={handleChange}
                  required
                  min="0.1"
                  step="0.01"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="cropImage" className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" variant="success" disabled={loading}>
            {loading ? "Uploading..." : "Upload Crop"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
