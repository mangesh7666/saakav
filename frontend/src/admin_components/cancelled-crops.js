import { Card, Table, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminCancelledCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch rejected/cancelled crops from backend
  const fetchCancelledCrops = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/admin/crops/rejected",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCrops(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch cancelled crops:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCancelledCrops();
  }, []);

  return (
    <>
      <h3 className="mb-4">❌ Cancelled / Rejected Crops</h3>
      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Farmer</th>
                <th>Crop</th>
                <th>Quantity (kg)</th>
                <th>Price / kg (₹)</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">Loading...</td>
                </tr>
              ) : crops.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No cancelled crops</td>
                </tr>
              ) : (
                crops.map((c, index) => (
                  <tr key={c._id}>
                    <td>{index + 1}</td>
                    <td>{c.farmer?.name}</td>
                    <td>{c.name}</td>
                    <td>{c.quantity}</td>
                    <td>{c.expectedPrice}</td>
                    <td><Badge bg="danger">{c.status}</Badge></td>
                     <td>{c.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}
