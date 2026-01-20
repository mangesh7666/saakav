import React, { useEffect, useState } from "react";
import { Card, Table, Button, Alert } from "react-bootstrap";
import axios from "axios";

export default function FarmerPendingCrops() {
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://saakav1.onrender.com/api/farmer/pending-crops", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCrops(res.data);
    } catch (err) {
      setError("Failed to load pending crops");
    }
  };

  const cancelCrop = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this crop?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://saakav1.onrender.com/api/farmer/crop/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Crop cancelled successfully!");
      setCrops(crops.filter(c => c._id !== id));
    } catch (err) {
      setError("Failed to cancel crop");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Pending Crops</Card.Title>
        <Card.Text>These crops are awaiting approval.</Card.Text>

        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Crop Name</th>
              <th>Quantity</th>
              <th>Expected Price</th>
              <th>Upload Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {crops.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No pending crops
                </td>
              </tr>
            ) : (
              crops.map((crop, index) => (
                <tr key={crop._id}>
                  <td>{index + 1}</td>
                  <td>{crop.name}</td>
                  <td>{crop.quantity} kg</td>
                  <td>₹{crop.expectedPrice}</td>
                  <td>{new Date(crop.createdAt).toLocaleDateString()}</td>
                  <td>
                    {/* You can add Edit functionality later */}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => cancelCrop(crop._id)}
                    >
                      Cancel
                    </Button>
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
