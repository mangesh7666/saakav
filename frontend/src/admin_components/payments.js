import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Button, Badge, Modal, Form } from "react-bootstrap";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  const [formData, setFormData] = useState({
    paymentMode: "Manual",
    transactionId: "",
  });

  const token = localStorage.getItem("token");

  const fetchPayments = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/all-crops",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPayments(res.data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Open modal
  const openPaymentForm = (crop) => {
    setSelectedCrop(crop);
    setFormData({ paymentMode: "Manual", transactionId: "" });
    setShow(true);
  };

  // Submit payment
  const submitPayment = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/crop/payment/${selectedCrop._id}`,
        {
          paymentStatus: "Paid",
          paymentMode: formData.paymentMode,
          transactionId: formData.transactionId || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Payment released successfully");
      setShow(false);
      fetchPayments();
    } catch (error) {
      alert("Payment update failed");
    }
  };

  return (
    <>
      <h3 className="mb-4">💰 Payments & Settlements</h3>

      <Card>
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Farmer</th>
                <th>Crop</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.farmer?.name}</td>
                  <td>{p.name}</td>
                  <td>{p.expectedPrice}</td>
                  <td>
                    <Badge bg={p.paymentStatus === "Paid" ? "success" : "warning"}>
                      {p.paymentStatus}
                    </Badge>
                  </td>
                  <td>
                    {p.paymentStatus === "Unpaid" && (
                      <Button
                        size="sm"
                        onClick={() => openPaymentForm(p)}
                      >
                        Release Payment
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* ================= PAYMENT MODAL ================= */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Release Payment</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            <strong>Farmer:</strong> {selectedCrop?.farmer?.name}<br />
            <strong>Crop:</strong> {selectedCrop?.name}<br />
            <strong>Amount:</strong> ₹{selectedCrop?.expectedPrice}
          </p>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Payment Mode</Form.Label>
              <Form.Select
                value={formData.paymentMode}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMode: e.target.value })
                }
              >
                <option>Manual</option>
                <option>UPI</option>
                <option>Cash</option>
                <option>Bank</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Transaction ID (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter transaction id"
                value={formData.transactionId}
                onChange={(e) =>
                  setFormData({ ...formData, transactionId: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={submitPayment}>
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
