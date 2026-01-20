import { useEffect, useState } from "react";
import { Card, Table, Alert } from "react-bootstrap";
import axios from "axios";

export default function AdminBankUPIDetails() {
  const [farmers, setFarmers] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/bank-upi-details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFarmers(res.data);
      } catch (err) {
        setError("Failed to load bank & UPI details");
      }
    };

    fetchFarmers();
  }, []);

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!farmers.length) return <p>Loading...</p>;

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h4 className="mb-3">🏦 Farmer Bank & UPI Details</h4>

        <Table bordered responsive hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Bank</th>
              <th>Account No</th>
              <th>IFSC</th>
              <th>UPI ID</th>
            </tr>
          </thead>

          <tbody>
            {farmers.map((f, index) => (
              <tr key={f._id}>
                <td>{index + 1}</td>
                <td>{f.name}</td>
                <td>{f.email}</td>
                <td>{f.phone}</td>
                <td>{f.bankName || "-"}</td>
                <td>{f.accountNumber || "-"}</td>
                <td>{f.ifsc || "-"}</td>
                <td>{f.upiId || "-"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
