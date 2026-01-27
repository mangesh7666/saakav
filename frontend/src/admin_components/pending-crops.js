import { Card, Table, Badge, Button, Modal, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPendingCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedCropId, setSelectedCropId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch pending crops from backend
  const fetchPendingCrops = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://saakav1.onrender.com/api/admin/crops/pending",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCrops(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch pending crops:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCrops();
  }, []);

  // Approve crop
  const handleApprove = async (cropId) => {
    try {
      await axios.put(
        `https://saakav1.onrender.com/api/admin/crop/status/${cropId}`,
        { status: "Approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state locally
      const updated = crops.map(c =>
        c._id === cropId ? { ...c, status: "Approved" } : c
      );
      setCrops(updated);
    } catch (err) {
      console.error("Failed to approve crop:", err);
      alert("Failed to approve crop");
    }
  };

  // Open reject modal
  const openRejectModal = (cropId) => {
    setSelectedCropId(cropId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  // Reject crop with reason
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please enter a reason for rejection");
      return;
    }

    try {
      await axios.put(
        `https://saakav1.onrender.com/api/admin/crop/status/${selectedCropId}`,
        { status: "Rejected", reason: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state locally
      const updated = crops.map(c =>
        c._id === selectedCropId ? { ...c, status: "Rejected", reason: rejectReason } : c
      );
      setCrops(updated);

      setShowRejectModal(false);
    } catch (err) {
      console.error("Failed to reject crop:", err);
      alert("Failed to reject crop");
    }
  };

  return (
    <>
      <h3 className="mb-4">🕒 Pending Crops</h3>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center">Loading...</td>
                </tr>
              ) : crops.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No pending crops</td>
                </tr>
              ) : (
                crops.map((c, index) => (
                  <tr key={c._id}>
                    <td>{index + 1}</td>
                    <td>{c.farmer?.name}</td>
                    <td>{c.name}</td>
                    <td>{c.quantity}</td>
                    <td>{c.expectedPrice}</td>
                    <td><Badge bg="warning">{c.status}</Badge></td>
                    <td className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleApprove(c._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => openRejectModal(c._id)}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Crop</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason for rejection</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Reject
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
