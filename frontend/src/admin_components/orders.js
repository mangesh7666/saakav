import { Card, Table, Badge, Button, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminCustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from Backend
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming token storage
      const res = await axios.get("https://saakav1.onrender.com/api/admin/all-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://saakav1.onrender.com/api/admin/order/status/${orderId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      // Refresh list after update
      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getBadge = status => {
    switch (status) {
      case "Pending": return "secondary";
      case "Processing": return "info";
      case "Ready to Dispatch": return "warning";
      case "Dispatched": return "primary";
      case "Delivered": return "success";
      case "Cancelled": return "danger";
      default: return "dark";
    }
  };

  if (loading) return <Spinner animation="border" variant="success" className="d-block mx-auto mt-5" />;

  return (
    <>
      <h3 className="mb-4">📦 Customer Orders</h3>
      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Products</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="small text-muted">{order._id.substring(0, 8)}...</td>
                  <td>{order.user?.name || "N/A"}</td>
                  <td>
                    <div className="small">{order.user?.email}</div>
                    <div className="small">{order.user?.phone || order.shippingAddress?.phone}</div>
                  </td>
                  <td>
                    {order.items.map((p, idx) => (
                      <div key={idx} className="small">
                        • {p.name} ({p.quantity}kg)
                      </div>
                    ))}
                  </td>
                  <td><strong>₹{order.totalAmount}</strong></td>
                </tr>
              ))}
            </tbody>
          </Table>
          {orders.length === 0 && <div className="text-center p-4">No orders found.</div>}
        </Card.Body>
      </Card>
    </>
  );
}
