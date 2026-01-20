import React, { useEffect, useState } from "react";
import { Card, Table, Alert } from "react-bootstrap";
import axios from "axios";

export default function FarmerApprovedCrops() {
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApprovedCrops();
  }, []);

  const fetchApprovedCrops = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://saakav1.onrender.com/api/farmer/approved-crops", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCrops(res.data);
    } catch (err) {
      setError("Failed to load approved crops");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Approved Crops</Card.Title>
        <Card.Text>These crops are approved and visible to buyers.</Card.Text>

        {error && <Alert variant="danger">{error}</Alert>}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Crop Name</th>
              <th>Quantity</th>
              <th>Expected Price</th>
              <th>Upload Date</th>
            </tr>
          </thead>
          <tbody>
            {crops.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No approved crops
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
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
