import { Card, Button, Row, Col, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminLegal() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" or "edit"
  const [currentPolicy, setCurrentPolicy] = useState({ title: "", content: "", order: 0 });

  const token = localStorage.getItem("token");

  // Fetch all legal content
  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/legal", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolicies(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch legal content");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Open modal for add or edit
  const openModal = (type, policy = null) => {
    setModalType(type);
    if (policy) setCurrentPolicy(policy);
    else setCurrentPolicy({ title: "", content: "", order: 0 });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // Create or update policy
  const handleSave = async () => {
    try {
      if (modalType === "add") {
        await axios.post(
          "http://localhost:5000/api/admin/legal",
          currentPolicy,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (modalType === "edit") {
        await axios.put(
          `http://localhost:5000/api/admin/legal/${currentPolicy._id}`,
          currentPolicy,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      closeModal();
      fetchPolicies();
    } catch (err) {
      console.error(err);
      alert("Failed to save policy");
    }
  };

  // Delete policy
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/legal/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPolicies();
    } catch (err) {
      console.error(err);
      alert("Failed to delete policy");
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h3 className="mb-4">⚖️ Legal & Policies</h3>

      <Button className="mb-3" onClick={() => openModal("add")}>
        ➕ Add Policy
      </Button>

      <Row className="mb-4">
        {policies.map((policy) => (
          <Col md={6} lg={4} key={policy._id} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{policy.title}</Card.Title>
                <Card.Text>{policy.content}</Card.Text>
                <div className="mt-auto d-flex justify-content-between">
                  <Button variant="warning" onClick={() => openModal("edit", policy)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(policy._id)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "add" ? "Add Policy" : "Edit Policy"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={currentPolicy.title}
                onChange={(e) => setCurrentPolicy({ ...currentPolicy, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={currentPolicy.content}
                onChange={(e) => setCurrentPolicy({ ...currentPolicy, content: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Order</Form.Label>
              <Form.Control
                type="number"
                value={currentPolicy.order}
                onChange={(e) => setCurrentPolicy({ ...currentPolicy, order: Number(e.target.value) })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
