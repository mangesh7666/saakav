import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">📦 My Orders</h3>

      {orders.length === 0 ? (
        <div className="text-center py-5 shadow-sm rounded-4 bg-light">
          <h5>No orders found</h5>
          <p className="text-muted">You haven't purchased any fresh crops yet.</p>
          <a href="/user/products" className="btn btn-success rounded-pill px-4">Start Shopping</a>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div className="col-12 mb-4" key={order._id}>
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small">ORDER ID:</span>
                    <span className="fw-bold ms-2">{order.razorpayOrderId || order._id}</span>
                  </div>
                  <span className={`badge rounded-pill ${order.paymentStatus === 'Paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-md-8">
                      <h6 className="fw-bold mb-3">Items:</h6>
                      {order.items.map((item, index) => (
                        <div key={index} className="d-flex justify-content-between mb-2">
                          <span>{item.name} <span className="text-muted">x {item.quantity}</span></span>
                          <span className="fw-semibold">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="col-md-4 border-start ps-md-4 mt-3 mt-md-0">
                      <h6 className="fw-bold">Shipping Details:</h6>
                      <p className="text-muted small mb-1">{order.shippingAddress?.address}</p>
                     {/* <p className="text-muted small mb-3">Phone: {order.shippingAddress?.phone}</p>*/}
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold text-uppercase">Total:</span>
                        <span className="fw-bold fs-5 text-success">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card-footer bg-light border-0 py-2">
                  <small className="text-muted">
                    Ordered on: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}