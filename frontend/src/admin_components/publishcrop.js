import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Form, Table, Badge } from "react-bootstrap";

export default function AdminPublishCrop() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch crops for admin
  const fetchCrops = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/crops", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCrops(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  // Handle input change
  const handleChange = (id, field, value) => {
    setCrops((prev) =>
      prev.map((crop) =>
        crop._id === id ? { ...crop, [field]: value } : crop
      )
    );
  };

  // Publish crop
  const publishCrop = async (crop) => {
    try {
      setLoading(true);

      await axios.put(
        `http://localhost:5000/api/admin/crop/publish/${crop._id}`,
        {
          marketPrice: crop.marketPrice,
          sellingPrice: crop.sellingPrice,
          description: crop.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Crop published successfully ✅");
      fetchCrops();
    } catch (err) {
      alert("Failed to publish crop ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow">
      <h3 className="mb-4">🌾 Publish Crops (Admin)</h3>

      <Table bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Crop</th>
            <th>Farmer</th>
            <th>Qty</th>
            <th>Market Price</th>
            <th>Selling Price</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {crops.map((crop) => (
            <tr key={crop._id}>
              <td>{crop.name}</td>
              <td>{crop.farmer?.name}</td>
              <td>{crop.quantity} kg</td>

              <td>
                <Form.Control
                  type="number"
                  placeholder="₹ Market"
                  value={crop.marketPrice || ""}
                  onChange={(e) =>
                    handleChange(crop._id, "marketPrice", e.target.value)
                  }
                />
              </td>

              <td>
                <Form.Control
                  type="number"
                  placeholder="₹ Selling"
                  value={crop.sellingPrice || ""}
                  onChange={(e) =>
                    handleChange(crop._id, "sellingPrice", e.target.value)
                  }
                />
              </td>

              <td>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Description"
                  value={crop.description || ""}
                  onChange={(e) =>
                    handleChange(crop._id, "description", e.target.value)
                  }
                />
              </td>

              <td>
                <Badge bg={crop.status === "Approved" ? "success" : "warning"}>
                  {crop.status}
                </Badge>
              </td>

              <td>
                <Button
                  variant="success"
                  size="sm"
                  disabled={loading}
                  onClick={() => publishCrop(crop)}
                >
                  Publish
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
