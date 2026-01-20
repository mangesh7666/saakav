import React, { useEffect, useState } from "react";
import { Card, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

export default function UserLegal() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLegalContent();
  }, []);

  const fetchLegalContent = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/farmer/legal");
      setSections(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load legal content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Legal & Policies</Card.Title>
        <Card.Text>
          Please read the following legal information and policies carefully.
        </Card.Text>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}

        <div style={{ maxHeight: "500px", overflowY: "auto" }}>
          {sections.map((sec, index) => (
            <div key={index} className="mb-3">
              <h5>{index + 1}. {sec.title}</h5>
              <p>{sec.content}</p>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}
