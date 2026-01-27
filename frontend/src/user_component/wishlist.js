import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://saakav1.onrender.com";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* =====================
      FETCH WISHLIST
  ===================== */
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchWishlist();
  }, [token]);

  /* =====================
      REMOVE FROM WISHLIST
  ===================== */
  const removeFromWishlist = async (cropId) => {
    try {
      await axios.post(
        `${BASE_URL}/api/user/wishlist/${cropId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist((prev) => prev.filter((item) => item._id !== cropId));
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">❤️ My Wishlist</h2>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-success"></div>
        </div>
      )}

      {!loading && wishlist.length === 0 && (
        <p className="text-muted text-center" style={{ marginBottom: 280 }}>
          Your wishlist is empty
        </p>
      )}

      <div className="row g-3">
        {wishlist.map((crop) => (
          <div className="col-md-4 col-lg-3" key={crop._id}>
            <div className="card h-100 shadow-sm rounded-4 overflow-hidden">
              {/* UPDATED IMAGE LOGIC START */}
              <img
                src={crop.image || "https://via.placeholder.com/300"}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300";
                }}
                className="card-img-top"
                alt={crop.name}
                style={{ height: "180px", objectFit: "cover" }}
              />
              {/* UPDATED IMAGE LOGIC END */}

              <div className="card-body">
                <h6 className="fw-bold text-truncate">{crop.name}</h6>
                <p className="mb-2 text-success fw-bold">₹{crop.sellingPrice}</p>

                <button
                  className="btn btn-outline-danger w-100 rounded-pill"
                  onClick={() => removeFromWishlist(crop._id)}
                >
                  Remove ❤️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
