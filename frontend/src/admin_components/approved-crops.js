import { Card, Table, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminApprovedCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch approved crops
  const fetchApprovedCrops = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://saakav1.onrender.com/api/admin/crops/approved",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCrops(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch approved crops:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedCrops();
  }, []);

  return (
    <>
      <h3 className="mb-4">✅ Approved Crops</h3>
      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Farmer</th>
                <th>Crop</th>
                <th>Quantity (kg)</th>
                <th>Price (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">Loading...</td>
                </tr>
              ) : crops.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No approved crops</td>
                </tr>
              ) : (
                crops.map((c, index) => (
                  <tr key={c._id}>
                    <td>{index + 1}</td>
                    <td>{c.farmer?.name}</td>
                    <td>{c.name}</td>
                    <td>{c.quantity}</td>
                    <td>{c.expectedPrice}</td>
                    <td><Badge bg="success">{c.status}</Badge></td>
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
