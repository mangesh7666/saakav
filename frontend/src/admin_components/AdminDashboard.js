import { 
  Card, Row, Col, Spinner, Container, Table, Button 
} from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from "recharts";

const THEME_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ===============================
  // FETCH DASHBOARD STATS
  // ===============================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "https://saakav1.onrender.com/api/admin/dashboard-stats",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://saakav1.onrender.com/api/admin/users/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Users fetch error:", err);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchStats();
    fetchUsers();
  }, [token]);

  // ===============================
  // DELETE USER
  // ===============================
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(
        `https://saakav1.onrender.com/api/admin/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="grow" variant="primary" />
        <p className="mt-2 text-muted">Loading Analytics...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const revenueData = data?.revenueData || [];
  const categoryData = data?.categoryData || [];

  const totalRevenue = revenueData.reduce(
    (acc, curr) => acc + (curr.revenue || 0),
    0
  );

  return (
    <Container fluid className="py-4">
      <h3 className="mb-4 fw-bold text-dark">System Analytics Overview</h3>

      {/* ================= KPI ROW ================= */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm bg-primary text-white h-100">
            <Card.Body>
              <h6 className="text-uppercase small fw-bold opacity-75">
                Monthly Revenue
              </h6>
              <h2 className="fw-bold">₹{totalRevenue.toLocaleString()}</h2>
              <div className="small">Lifetime processed</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm bg-success text-white h-100">
            <Card.Body>
              <h6 className="text-uppercase small fw-bold opacity-75">
                Active Farmers
              </h6>
              <h2 className="fw-bold">{stats.totalFarmers || 0}</h2>
              <div className="small">Verified partners</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm bg-warning text-dark h-100">
            <Card.Body>
              <h6 className="text-uppercase small fw-bold opacity-75">
                Pending Approvals
              </h6>
              <h2 className="fw-bold">{stats.pendingCrops || 0}</h2>
              <div className="small fw-bold">Items to review</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm bg-dark text-white h-100">
            <Card.Body>
              <h6 className="text-uppercase small fw-bold opacity-75">
                Total Orders
              </h6>
              <h2 className="fw-bold">{stats.totalOrders || 0}</h2>
              <div className="small">Customer purchases</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ================= CHARTS ================= */}
      <Row className="mb-4">
        <Col lg={8} className="mb-3">
          <Card className="border-0 shadow-sm p-3">
            <h5 className="mb-4 fw-bold text-muted">
              Revenue Growth Trend
            </h5>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area dataKey="revenue" stroke="#0d6efd" fill="#0d6efd33" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col lg={4} className="mb-3">
          <Card className="border-0 shadow-sm p-3 h-100">
            <h5 className="mb-4 fw-bold text-muted">
              Category Distribution
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" outerRadius={90}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={THEME_COLORS[i % 5]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* ================= USERS TABLE ================= */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm p-3">
            <h5 className="fw-bold mb-3">👥 User Management</h5>

            {usersLoading ? (
              <Spinner animation="border" />
            ) : (
              <Table responsive hover bordered>
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name || "-"}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{new Date(u.updatedAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteUser(u._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
