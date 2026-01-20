import { useEffect, useState } from "react";
import axios from "axios"; // 1. Import Axios
// import PremiumFooter from "./footer";

function AnimatedStat({ value, label, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 16;
    const increment = value / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div>
      <h2 className="fw-bold text-agri">
        {prefix}{count.toLocaleString(undefined, { minimumFractionDigits: value % 1 === 0 ? 0 : 1, maximumFractionDigits: 1 })}{suffix}
      </h2>
      <p className="small text-muted mb-0">{label}</p>
    </div>
  );
}

export default function UserDashboard() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 2. Added error state

  // FETCH DATA USING AXIOS
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true);
        // Replace with your actual hosted URL if not localhost
        const response = await axios.get("https://saakav1.onrender.com/api/user/user/crops");
        
        // 3. Axios stores the JSON response in 'response.data'
        setCrops(response.data);
      } catch (err) {
        console.error("Axios Error:", err);
        setError("Could not load latest crop data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  return (
    <div style={{ backgroundColor: "#ffffff", color: "#1a1a1a", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        :root {
          --agri-main: #2d5a27;
          --agri-soft: #eef7f1;
          --glass: rgba(255,255,255,0.7);
        }
        .text-agri { color: var(--agri-main); }
        .bg-soft-green { background: linear-gradient(135deg, #eef7f1, #f9fcfa); }
        .bento-card {
          border-radius: 24px;
          padding: 28px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
          height: 100%;
          overflow: hidden;
        }
        .bento-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
        .btn-agri {
          background: var(--agri-main);
          color: #fff;
          border-radius: 12px;
          padding: 12px 28px;
          border: none;
          font-weight: 600;
        }
        .crop-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          z-index: 2;
        }
        .chart-container { display: flex; align-items: flex-end; gap: 10px; height: 120px; padding-bottom: 20px; }
        .bar { width: 100%; background: #c8e6c9; border-radius: 6px 6px 0 0; position: relative; transition: height 1s ease; }
        .bar.active { background: var(--agri-main); }
        .bar::after { content: attr(data-label); position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #888; }
        .status-pill { font-size: 11px; padding: 4px 12px; border-radius: 20px; font-weight: 600; }
        .status-success { background: #e8f5e9; color: #2e7d32; }
      `}</style>

      {/* OPERATIONAL HERO */}
      <section className="py-5 bg-soft-green">
        <div className="container py-4">
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-7">
              <div className="bento-card bg-transparent border-0 shadow-none ps-0">
                <span className="text-uppercase tracking-wider small fw-bold text-agri mb-3 d-block">Enterprise Trade Terminal</span>
                <h1 className="display-5 fw-bold mb-3">Institutional <span className="text-agri">Agri-Sourcing</span> & Procurement</h1>
                <p className="lead text-muted mb-4">Real-time supply chain visibility for bulk commodities. Manage contracts, verify quality reports, and track shipments.</p>
              </div>
            </div>
            
            <div className="col-lg-5">
              <div className="bento-card">
                <h6 className="fw-bold mb-4 text-secondary">Network Performance (Live)</h6>
                <div className="row g-4 mb-4">
                  <div className="col-6">
                    <AnimatedStat value={94.8} suffix="%" label="Fulfillment Rate" />
                  </div>
                  <div className="col-6">
                    <AnimatedStat value={12.4} suffix="h" label="Avg. Quality Check" />
                  </div>
                </div>
                <p className="small fw-bold mb-2">Inventory Utilization (%)</p>
                <div className="chart-container">
                  <div className="bar" style={{ height: "40%" }} data-label="WH-A" />
                  <div className="bar" style={{ height: "85%" }} data-label="WH-B" />
                  <div className="bar active" style={{ height: "95%" }} data-label="WH-C" />
                  <div className="bar" style={{ height: "60%" }} data-label="WH-D" />
                  <div className="bar" style={{ height: "70%" }} data-label="WH-E" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCUREMENT CATALOG */}
      {/* PROCUREMENT CATALOG */}
<section className="container py-5">
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h4 className="fw-bold mb-0">Verified Live Stock</h4>
    <span className="badge bg-light text-dark border">Found: {crops.length} Units</span>
  </div>

  {loading ? (
    <div className="text-center py-5">
      <div className="spinner-border text-success" role="status"></div>
      <p className="mt-2 text-muted">Synchronizing with Mandi Database...</p>
    </div>
  ) : error ? (
    <div className="alert alert-warning text-center">{error}</div>
  ) : (
    <div className="row g-4">
      {crops.map((crop) => {
        // Construct the full URL for the image
        // If crop.image is just 'filename.jpg', this makes it 'http://localhost:5000/uploads/filename.jpg'
        const imageUrl = crop.image 
          ? `http://localhost:5000/uploads/${crop.image}` 
          : 'https://via.placeholder.com/300x200?text=No+Image+Available';

        return (
          <div className="col-md-3" key={crop._id}>
            <div className="bento-card p-0 position-relative">
              {crop.discountPercent > 0 && (
                <span className="badge bg-danger crop-badge">-{crop.discountPercent}%</span>
              )}
              
              <img 
                src={imageUrl} 
                alt={crop.name} 
                className="w-100" 
                style={{ height: "160px", objectFit: "cover", borderTopLeftRadius: "24px", borderTopRightRadius: "24px" }}
                // Optional: Fallback if the image URL fails to load
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Error+Loading+Image'; }}
              />

              <div className="p-4">
                <span className="status-pill status-success mb-2 d-inline-block">{crop.category}</span>
                <h6 className="fw-bold mb-1 mt-1">{crop.name}</h6>
                <p className="small text-muted mb-3 text-truncate">{crop.description}</p>
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="small text-secondary">Our Price</span>
                    <span className="small fw-bold text-success">₹{crop.sellingPrice}</span>
                  </div>
                  <div className="d-flex justify-content-between mt-1">
                    <span className="small text-secondary">Available Stock</span>
                    <span className="small fw-bold text-agri">{crop.quantity} MT</span>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )}
</section>

      {/* TRANSACTIONAL VISIBILITY */}
      <section className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="bento-card shadow-none border">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Active Contracts</h5>
                <button className="btn btn-sm btn-light border">Export CSV</button>
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr className="text-secondary small">
                      <th>ID</th>
                      <th>Commodity</th>
                      <th>Counterparty</th>
                      <th>Status</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    <tr>
                      <td>PO-2940</td>
                      <td className="fw-bold">Wheat (Milling)</td>
                      <td>Global Exports Ltd</td>
                      <td><span className="status-pill bg-warning bg-opacity-10 text-warning">In Transit</span></td>
                      <td>22 Jan 2026</td>
                    </tr>
                    <tr>
                      <td>PO-2941</td>
                      <td className="fw-bold">Refined Palm Oil</td>
                      <td>AgroCorp Industries</td>
                      <td><span className="status-pill status-success">Delivered</span></td>
                      <td>18 Jan 2026</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="bento-card bg-dark text-white">
              <h5 className="fw-bold mb-4 text-agri">Market Alert</h5>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small text-secondary">Crude Palm Oil</span>
                  <span className="small text-danger">↑ 2.4%</span>
                </div>
                <div className="progress" style={{ height: "4px" }}>
                  <div className="progress-bar bg-danger" style={{ width: "70%" }}></div>
                </div>
              </div>
              <hr className="text-secondary opacity-25" />
              <p className="small text-secondary mb-0"><strong>Advisory:</strong> Bulk procurement for Maize is recommended today as mandi arrivals are high.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
