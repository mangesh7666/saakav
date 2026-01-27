import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = "https://saakav1.onrender.com";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const token = localStorage.getItem("token");

  /* =====================
      FETCH CART
  ===================== */
  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /* =====================
      UPDATE QUANTITY
  ===================== */
  const updateQty = async (cropId, type, currentQty, availableQuantity) => {
    if (type === "inc" && currentQty >= availableQuantity) {
      alert(`Only ${availableQuantity} units available in stock.`);
      return;
    }

    setProcessingId(cropId);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/user/cart/add/${cropId}`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(res.data.items || []);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating quantity");
    } finally {
      setProcessingId(null);
    }
  };

  /* =====================
      REMOVE ITEM
  ===================== */
  const removeItem = async (cropId) => {
    if (!window.confirm("Remove this item from cart?")) return;

    setProcessingId(cropId);
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/user/cart/remove/${cropId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Remove Error:", err);
    } finally {
      setProcessingId(null);
    }
  };

  /* =====================
      CHECKOUT LOGIC
  ===================== */
  const handleCheckout = async () => {
    const address = prompt("Enter Shipping Address:");
    if (!address) return alert("Address is required");

    try {
      const { data: order } = await axios.post(
        `${BASE_URL}/api/user/create-order`,
        { amount: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_test_eO8U4v2rB4xQx0", // 👈 Replace with your Key
        amount: order.amount,
        currency: order.currency,
        name: "Farm Direct",
        description: "Crop Purchase",
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyData = {
              ...response,
              orderDetails: { address: { address, city: "Default", phone: "0000000000" } },
            };

            await axios.post(`${BASE_URL}/api/user/verify-payment`, verifyData, {
              headers: { Authorization: `Bearer ${token}` },
            });

            alert("Success! Order Placed. 🎉");
            window.location.href = "/user/orders";
          } catch (err) {
            alert("Payment verification failed.");
          }
        },
        theme: { color: "#10b981" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Checkout error. Please try again.");
    }
  };

  // Calculate Total
  const total = cartItems.reduce(
    (sum, item) => sum + (item.crop?.sellingPrice || 0) * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">🛒 My Cart</h3>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            width="120"
            alt="empty-cart"
          />
          <h5 className="mt-3">Your cart is empty</h5>
          <p className="text-muted">Add some fresh crops 🌾</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            {cartItems.map((item) => (
              <div className="card mb-3 border-0 shadow-sm rounded-4" key={item.crop?._id}>
                <div className="row g-0 align-items-center p-3">
                  <div className="col-3 col-md-2">
                    <img
                     src={item.crop.image || "https://via.placeholder.com/150"}
                      className="img-fluid rounded-3"
                      alt={item.crop?.name}
                      style={{ height: "70px", width: "70px", objectFit: "cover" }}
                    />
                  </div>

                  <div className="col-9 col-md-4">
                    <div className="ps-3">
                      <h6 className="fw-bold mb-1">{item.crop?.name}</h6>
                      <p className="text-success fw-bold mb-0">₹{item.crop?.sellingPrice}</p>
                      <small className="text-muted">
                        Available: {item.crop?.quantity} units
                      </small>
                    </div>
                  </div>

                  <div className="col-md-3 text-center my-3 my-md-0">
                    <div className="d-flex flex-column align-items-center">
                      <div className="d-flex justify-content-center align-items-center">
                        <button
                          className="btn btn-light btn-sm border rounded-circle shadow-sm"
                          onClick={() =>
                            updateQty(item.crop?._id, "dec", item.quantity, item.crop?.quantity)
                          }
                          disabled={processingId === item.crop?._id || item.quantity <= 1}
                        >
                          −
                        </button>

                        <span className="mx-3 fw-bold">{item.quantity}</span>

                        <button
                          className="btn btn-light btn-sm border rounded-circle shadow-sm"
                          onClick={() =>
                            updateQty(item.crop?._id, "inc", item.quantity, item.crop?.quantity)
                          }
                          disabled={
                            processingId === item.crop?._id || item.quantity >= item.crop?.quantity
                          }
                        >
                          +
                        </button>
                      </div>

                      {item.quantity >= item.crop?.quantity && (
                        <small
                          className="text-danger mt-1"
                          style={{ fontSize: "0.65rem", fontWeight: "bold" }}
                        >
                          Max Limit Reached
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="col-md-3 text-end">
                    <button
                      className="btn btn-sm btn-outline-danger border-0 fw-semibold"
                      onClick={() => removeItem(item.crop?._id)}
                      disabled={processingId === item.crop?._id}
                    >
                      <i className="bi bi-trash mr-1"></i> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4">
            <div
              className="card shadow-sm border-0 rounded-4 p-4 sticky-top"
              style={{ top: "100px" }}
            >
              <h5 className="fw-bold mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Delivery</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                <span>Total</span>
                <span className="text-success">₹{total}</span>
              </div>
              <button
                className="btn btn-success w-100 py-2 rounded-pill fw-bold shadow-sm"
                disabled={cartItems.length === 0}
                onClick={handleCheckout} // 👈 Added the onClick handler here
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
