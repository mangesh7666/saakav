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

    fetchWishlist();
  }, []);

  /* =====================
     REMOVE FROM WISHLIST
  ===================== */
  const removeFromWishlist = async (cropId) => {
    await axios.post(
      `${BASE_URL}/api/user/wishlist/${cropId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setWishlist(prev => prev.filter(item => item._id !== cropId));
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">❤️ My Wishlist</h2>

      {loading && <p>Loading...</p>}

      {!loading && wishlist.length === 0 && (
        <p className="text-muted" style ={{marginBottom:280}}>Your wishlist is empty</p>
      )}

      <div className="row g-3">
        {wishlist.map(crop => (
          <div className="col-md-4 col-lg-3" key={crop._id}>
            <div className="card h-100 shadow-sm rounded-4">
              <img
                src={`${BASE_URL}/uploads/${crop.image}`}
                className="card-img-top"
                style={{ height: "180px", objectFit: "cover" }}
              />

              <div className="card-body">
                <h6 className="fw-bold">{crop.name}</h6>
                <p className="mb-1 text-success fw-bold">
                  ₹{crop.sellingPrice}
                </p>

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
