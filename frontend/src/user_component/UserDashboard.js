import { useEffect, useState } from "react";
import axios from "axios";

export default function HealthFocusedDashboard() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get("https://saakav1.onrender.com/api/user/user/crops");
        setCrops(response.data);
      } catch (err) {
        console.error("Error fetching health data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  // Helper to assign a health benefit based on category or name
  // In a real app, this data would come from your Backend
  const getHealthBenefit = (crop) => {
    const name = crop.name.toLowerCase();
    if (name.includes("wheat") || name.includes("grain")) return { tag: "Digestive Health", icon: "🌾", color: "#f39c12" };
    if (name.includes("oil")) return { tag: "Heart Healthy", icon: "❤️", color: "#e74c3c" };
    if (name.includes("pulse") || name.includes("dal")) return { tag: "Muscle Growth", icon: "💪", color: "#2980b9" };
    return { tag: "Immunity Booster", icon: "🛡️", color: "#27ae60" };
  };

  return (
    <div style={{ backgroundColor: "#fcfdfb", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        .health-card {
          border: none;
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          background: #fff;
          overflow: hidden;
        }
        .health-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
        }
        .benefit-badge {
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .nutrition-dot {
          height: 8px; width: 8px; border-radius: 50%; display: inline-block; margin-right: 6px;
        }
      `}</style>

      {/* MINIMAL HEALTH HEADER */}
      <header className="container py-5 text-center">
        <span className="badge bg-success-subtle text-success mb-3 px-3 py-2 rounded-pill">100% Organic & Fresh</span>
        <h1 className="fw-bold display-5">Eat Fresh, <span className="text-success">Live Strong</span></h1>
        <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
          Discover crops harvested at peak nutrition to help you build a stronger immune system and better vitality.
        </p>
      </header>

      <section className="container pb-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h4 className="fw-bold mb-0">Farmer's Fresh Picks</h4>
            <p className="small text-muted mb-0">Nutritional value verified</p>
          </div>
          <div className="text-success small fw-bold">View Vitality Guide →</div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-grow text-success" role="status"></div>
          </div>
        ) : (
          <div className="row g-4">
            {crops.map((crop) => {
              const health = getHealthBenefit(crop);
              return (
                <div className="col-lg-3 col-md-6" key={crop._id}>
                  <div className="health-card shadow-sm h-100">
                    {/* Image with overlay health tag */}
                    <div className="position-relative">
                      <img 
                        src={crop.image ? `https://saakav1.onrender.com/uploads/${crop.image}` : 'https://via.placeholder.com/300x200'} 
                        className="w-100" 
                        style={{ height: "200px", objectFit: "cover" }}
                        alt={crop.name}
                      />
                      <div className="position-absolute bottom-0 start-0 p-3 w-100" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
                        <span className="bg-white text-dark benefit-badge">
                          {health.icon} {health.tag}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h5 className="fw-bold mb-1">{crop.name}</h5>
                      <p className="text-muted small mb-3" style={{ fontSize: "0.85rem", height: "40px", overflow: "hidden" }}>
                        Packed with essential minerals and vitamins to support your daily energy.
                      </p>

                      <div className="bg-light rounded-4 p-3 mb-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="small text-muted"><span className="nutrition-dot bg-success"></span>Purity</span>
                          <span className="small fw-bold">100%</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="small text-muted"><span className="nutrition-dot bg-warning"></span>Immunity</span>
                          <span className="small fw-bold">High</span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="d-block text-muted small" style={{ fontSize: "10px" }}>FRESH PRICE</span>
                          <span className="fw-bold text-dark">₹{crop.sellingPrice}</span>
                        </div>
                        <button className="btn btn-success rounded-pill px-4 btn-sm fw-bold">Add to Diet</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* HEALTH TIPS SECTION */}
      <section className="container mb-5">
        <div className="bg-dark text-white p-5 rounded-5 shadow-lg position-relative overflow-hidden">
          <div className="row align-items-center">
            <div className="col-md-7">
              <h2 className="fw-bold">Daily Immunity Tip</h2>
              <p className="lead opacity-75">Consuming fresh {crops[0]?.name || 'grains'} daily can improve your gut health by up to 40%. Direct from farm to your kitchen.</p>
              <button className="btn btn-light rounded-pill px-4 fw-bold">Explore Health Blog</button>
            </div>
          </div>
          {/* Decorative Circle */}
          <div className="position-absolute end-0 top-0 bg-success opacity-25" style={{ width: "300px", height: "300px", borderRadius: "50%", marginRight: "-100px", marginTop: "-100px" }}></div>
        </div>
      </section>
    </div>
  );
}
