import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://saakav1.onrender.com/api/user/user/crops");
        setCrops(response.data);
      } catch (err) {
        setError("Unable to load crops. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  return (
    <div className="min-vh-100 bg-white" style={{ fontFamily: "'Inter', sans-serif", color: "#333" }}>
      {/* SIMPLE NAVBAR */}
      <nav className="border-bottom py-3 mb-5">
        <div className="container d-flex justify-content-between align-items-center">
          <h4 className="fw-bold mb-0" style={{ letterSpacing: "-0.5px" }}>SAAKA <span className="text-success">AGRI</span></h4>
          <div className="text-muted small">Mandi Live Feed</div>
        </div>
      </nav>

      <main className="container">
        {/* SIMPLE HEADER */}
        <header className="mb-5">
          <h1 className="fw-bold">Available Stock</h1>
          <p className="text-muted">Direct from verified regional suppliers</p>
        </header>

        {/* LOADING & ERROR STATES */}
        {loading ? (
          <div className="py-5 text-center">
            <div className="spinner-border text-dark spinner-border-sm" role="status"></div>
            <p className="mt-2 small text-muted">Fetching latest prices...</p>
          </div>
        ) : error ? (
          <div className="alert alert-light border text-center p-4">{error}</div>
        ) : (
          <div className="row g-4">
            {crops.map((crop) => (
              <div className="col-12 col-sm-6 col-lg-3" key={crop._id}>
                <div className="card border-0 h-100">
                  {/* IMAGE SECTION */}
                  <div className="overflow-hidden rounded-3 mb-3 bg-light" style={{ aspectRatio: "4/3" }}>
                    <img
                      src={crop.image ? `http://localhost:5000/uploads/${crop.image}` : 'https://via.placeholder.com/400x300'}
                      alt={crop.name}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                    />
                  </div>

                  {/* CONTENT SECTION */}
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <span className="text-uppercase small fw-bold text-muted" style={{ fontSize: '10px' }}>{crop.category}</span>
                      {crop.discountPercent > 0 && <span className="text-danger small fw-bold">-{crop.discountPercent}%</span>}
                    </div>
                    <h6 className="fw-bold mb-1">{crop.name}</h6>
                    <p className="text-muted small text-truncate mb-3">{crop.description}</p>
                    
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>Price per MT</div>
                        <div className="fw-bold text-success">₹{crop.sellingPrice.toLocaleString()}</div>
                      </div>
                      <div className="text-end">
                        <div className="text-muted" style={{ fontSize: '11px' }}>Available</div>
                        <div className="fw-bold">{crop.quantity} MT</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SIMPLE FOOTER NOTE */}
        {!loading && !error && (
          <footer className="mt-5 py-5 border-top text-center">
            <p className="text-muted small">End of stock list. Updates every 30 minutes.</p>
          </footer>
        )}
      </main>
    </div>
  );
}
