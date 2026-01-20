import React, { useEffect, useState } from "react";
import { Card, Table, Alert } from "react-bootstrap";
import axios from "axios";

export default function FarmerCancelledCrops() {
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCancelledCrops();
  }, []);

  const fetchCancelledCrops = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/farmer/cancelled-crops", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCrops(res.data);
    } catch (err) {
      setError("Failed to load cancelled crops");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Cancelled Crops</Card.Title>
        <Card.Text>These crops were cancelled due to various reasons.</Card.Text>

        {error && <Alert variant="danger">{error}</Alert>}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Crop Name</th>
              <th>Quantity</th>
              <th>Expected Price</th>
              <th>Upload Date</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {crops.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No cancelled crops
                </td>
              </tr>
            ) : (
              crops.map((crop, index) => (
                <tr key={crop._id}>
                  <td>{index + 1}</td>
                  <td>{crop.name}</td>
                  <td>{crop.quantity} kg</td>
                  <td>₹{crop.expectedPrice}</td>
                  <td>{new Date(crop.updatedAt || crop.createdAt).toLocaleDateString()}</td>
                  <td>{crop.reason || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
