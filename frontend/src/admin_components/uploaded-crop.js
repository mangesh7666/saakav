import { useState, useEffect } from "react";
import { Card, Table, Badge, Button } from "react-bootstrap";
import axios from "axios";

export default function AdminUploadedCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch all uploaded crops from backend
  const fetchCrops = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/admin/crops/uploaded",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCrops(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch crops:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  // Handle approve/reject
  const handleStatusChange = async (cropId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/crop/status/${cropId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state locally without refetching
      const updated = crops.map((c) =>
        c._id === cropId ? { ...c, status: newStatus } : c
      );
      setCrops(updated);
    } catch (err) {
      console.error("Failed to update crop status:", err);
      alert("Failed to update crop status");
    }
  };

  return (
    <>
      <h3 className="mb-4">🌾 Uploaded Crops</h3>

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : crops.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No crops found
                  </td>
                </tr>
              ) : (
                crops.map((c, index) => (
                  <tr key={c._id}>
                    <td>{index + 1}</td>
                    <td>{c.farmer?.name}</td>
                    <td>{c.name}</td>
                    <td>{c.quantity}</td>
                    <td>{c.expectedPrice}</td>
                    <td>
                      <Badge
                        bg={
                          c.status === "Approved"
                            ? "success"
                            : c.status === "Pending"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="d-flex gap-2">
                      {c.status === "Pending" ? (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleStatusChange(c._id, "Approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleStatusChange(c._id, "Rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="secondary" disabled>
                          Done
                        </Button>
                      )}
                    </td>
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
