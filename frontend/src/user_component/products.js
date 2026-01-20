import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://saakav1.onrender.com";

export default function CropListing() {
  const [crops, setCrops] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]); // Will now store IDs only
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");

  const token = localStorage.getItem("token");

  /* =======================
      FETCH CROPS
  ======================= */
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/user/crops`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCrops(res.data);
        setFiltered(res.data);
        setCategories(["all", ...new Set(res.data.map(c => c.category))]);
      } catch (err) {
        console.error("Crops Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, [token]);

  /* =======================
      FETCH WISHLIST (FIXED)
  ======================= */
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Your backend returns [ {cropObj}, {cropObj} ]
        // We map it to get [ "id1", "id2" ] so .includes() works
        const wishlistIds = res.data.map(item => item._id);
        setWishlist(wishlistIds);
      } catch (err) {
        console.error("Wishlist Fetch Error:", err);
      }
    };

    if (token) fetchWishlist();
  }, [token]);

  /* =======================
      FILTER / SORT
  ======================= */
  useEffect(() => {
    let data = [...crops];

    if (search)
      data = data.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );

    if (category !== "all")
      data = data.filter(c => c.category === category);

    if (sort === "low")
      data.sort((a, b) => a.sellingPrice - b.sellingPrice);
    if (sort === "high")
      data.sort((a, b) => b.sellingPrice - a.sellingPrice);

    setFiltered(data);
  }, [search, category, sort, crops]);

  /* =======================
      WISHLIST TOGGLE (FIXED)
  ======================= */
  const toggleWishlist = async (cropId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/user/wishlist/${cropId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Sync local state with the boolean returned from your route
      if (res.data.wishlisted) {
        setWishlist(prev => [...prev, cropId]);
      } else {
        setWishlist(prev => prev.filter(id => id !== cropId));
      }
    } catch (err) {
      console.error("Wishlist Toggle Error:", err);
      alert("Please login to use wishlist");
    }
  };

  /* =======================
      ADD TO CART
  ======================= */
  const addToCart = async (cropId) => {
    try {
      await axios.post(
        `${BASE_URL}/api/user/cart/add/${cropId}`,
        { type: "inc" }, // Added type for backend consistency
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to cart 🛒");
    } catch (err) {
      console.error("Cart Error:", err);
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  /* =======================
      UI
  ======================= */
  return (
    <div className="main-wrapper">
      <style>{`
        :root {
          --primary:#065f46;
          --success:#10b981;
          --bg:#f8fafc;
          --heart:#ef4444;
        }
        body { background: var(--bg); }

        .hero {
          background: linear-gradient(135deg,#065f46,#10b981);
          padding:60px 0 100px;
          color:white;
          text-align:center;
          border-radius:0 0 40px 40px;
        }

        .filter-box {
          margin-top:-40px;
          background:white;
          border-radius:20px;
          padding:20px;
          box-shadow:0 10px 30px rgba(0,0,0,.05);
        }

        .card {
          border-radius:24px;
          border:1px solid #f1f5f9;
          overflow:hidden;
          position:relative;
          height:100%;
          transition: transform 0.2s;
        }
        .card:hover { transform: translateY(-5px); }

        .heart-btn {
          position:absolute;
          top:12px;
          right:12px;
          background:white;
          border:none;
          border-radius:50%;
          width:34px;
          height:34px;
          box-shadow:0 4px 8px rgba(0,0,0,.15);
          color:#cbd5e1;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }

        .heart-btn.active {
          color:var(--heart);
        }

        .crop-img {
          width:100%;
          height:200px;
          object-fit:cover;
          border-radius:18px;
        }

        .price {
          font-weight:800;
          font-size:1.2rem;
        }

        .strike {
          text-decoration:line-through;
          color:#94a3b8;
          margin-left:5px;
        }

        .discount {
          color:#059669;
          font-weight:700;
          font-size:.8rem;
        }
      `}</style>

      <div className="hero">
        <h1 className="fw-bold">Saakav 🌱</h1>
        
      </div>

      <div className="container pb-5">
        <div className="filter-box mb-4">
          <div className="row g-2">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Search crops..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Sort Price</option>
                <option value="low">Low → High</option>
                <option value="high">High → Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row g-3">
          {loading ? (
             <div className="text-center w-100 py-5">
                <div className="spinner-border text-success"></div>
             </div>
          ) : (
            filtered.map(crop => (
              <div className="col-12 col-md-4 col-lg-3" key={crop._id}>
                <div className="card p-2">
                  <button
                    className={`heart-btn ${wishlist.includes(crop._id) ? "active" : ""}`}
                    onClick={() => toggleWishlist(crop._id)}
                  >
                    {/* Use a filled heart if active */}
                    {wishlist.includes(crop._id) ? "❤️" : "🤍"}
                  </button>

                  <img
                    src={`${BASE_URL}/uploads/${crop.image}`}
                    onError={(e)=>e.target.src="https://via.placeholder.com/300"}
                    className="crop-img"
                    alt={crop.name}
                  />

                  <div className="p-2">
                    <small className="text-muted text-uppercase">
                      {crop.category}
                    </small>
                    <h6 className="fw-bold text-truncate">{crop.name}</h6>

                    <div>
                      <span className="price">₹{crop.sellingPrice}</span>
                      {crop.marketPrice > crop.sellingPrice && (
                        <span className="strike">₹{crop.marketPrice}</span>
                      )}
                    </div>

                    {crop.discountPercent > 0 && (
                      <div className="discount">
                        {crop.discountPercent}% OFF
                      </div>
                    )}

                    <div className="d-flex gap-2 mt-2">
                      
                      <button
                        className="btn btn-outline-success w-100 rounded-pill"
                        onClick={() => addToCart(crop._id)}
                      >
                        Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
