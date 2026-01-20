import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Spinner, Alert } from "react-bootstrap";
import { Line, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch both dashboard stats and chart data
      const [dashRes, chartRes] = await Promise.all([
        axios.get("https://saakav1.onrender.com/api/farmer/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://saakav1.onrender.com/api/farmer/dashboard-charts", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setDashboard(dashRes.data);
      setChartData(chartRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!dashboard || !chartData) return <Spinner animation="border" />;

  // Stats cards
  const stats = [
    {
      title: "Uploaded Crops",
      count: dashboard.uploadedCount,
      quantity: dashboard.uploadedQty + " kg",
      bg: "success",
      path: "/farmer/upload-crop",
    },
    {
      title: "Pending Crops",
      count: dashboard.pendingCount,
      quantity: dashboard.pendingQty + " kg",
      bg: "warning",
      path: "/farmer/pending-crops",
    },
    {
      title: "Approved Crops",
      count: dashboard.approvedCount,
      quantity: dashboard.approvedQty + " kg",
      bg: "primary",
      path: "/farmer/approved-crops",
    },
    {
      title: "Cancelled Crops",
      count: dashboard.cancelledCount,
      quantity: dashboard.cancelledQty + " kg",
      bg: "danger",
      path: "/farmer/cancelled-crops",
    },
    {
      title: "Payments Received",
      count: "₹" + dashboard.payments.reduce((sum, p) => sum + Number(p.amount), 0),
      bg: "info",
      path: "/farmer/payments",
    },
    {
      title: "History Records",
      count: dashboard.recentActivities.length,
      bg: "secondary",
      path: "/farmer/history",
    },
  ];

  // Line chart: crop trends
  const lineData = {
    labels: chartData.months,
    datasets: [
      {
        label: "Crops Uploaded (kg)",
        data: chartData.uploaded,
        borderColor: "#20c997",
        backgroundColor: "rgba(32,201,151,0.2)",
        tension: 0.4,
      },
      {
        label: "Crops Approved (kg)",
        data: chartData.approved,
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13,110,253,0.2)",
        tension: 0.4,
      },
    ],
  };

  // Bar chart: payments
  const barData = {
    labels: chartData.months,
    datasets: [
      {
        label: "Payments Received (₹)",
        data: chartData.payments,
        backgroundColor: "rgba(255,99,132,0.6)",
      },
    ],
  };

  return (
    <div>
      <h2 className="mb-4">Welcome, Farmer 🌾</h2>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        {stats.map((stat, index) => (
          <Col key={index} md={6} lg={4}>
            <Card
              bg={stat.bg.toLowerCase()}
              text="white"
              className="shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(stat.path)}
            >
              <Card.Body>
                <Card.Title>{stat.title}</Card.Title>
                <Card.Text style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{stat.count}</Card.Text>
                {stat.quantity && <Card.Text>Quantity: {stat.quantity}</Card.Text>}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Crop Trends (kg)</Card.Title>
              <Line data={lineData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Payments Received (₹)</Card.Title>
              <Bar data={barData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Table */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Recent Activities</Card.Title>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Crop / Action</th>
                <th>Status</th>
                <th>Quantity / Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentActivities.map((act, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td
                    style={{ cursor: "pointer", color: "#0d6efd" }}
                    onClick={() => navigate("/farmer/upload-crop")}
                  >
                    {act.crop} {act.type && `(${act.type})`}
                  </td>
                  <td>{act.status}</td>
                  <td>{act.quantity}</td>
                  <td>{new Date(act.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
