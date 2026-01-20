import { useEffect, useState } from "react";
import axios from "axios";

export default function HealthFocusedDashboard() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await axios.get(
          "https://saakav1.onrender.com/api/user/user/crops"
        );
        setCrops(res.data);
      } catch (err) {
        console.error("Error fetching crops", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  const getHealthBenefit = (crop) => {
    const name = crop.name.toLowerCase();
    if (name.includes("wheat") || name.includes("grain"))
      return { tag: "Digestive Health", icon: "🌾" };
    if (name.includes("oil"))
      return { tag: "Heart Healthy", icon: "❤️" };
    if (name.includes("pulse") || name.includes("dal"))
      return { tag: "Muscle Growth", icon: "💪" };
    return { tag: "Immunity Booster", icon: "🛡️" };
  };

  return (
    <div style={{ backgroundColor: "#fcfdfb", minHeight: "100vh" }}>
      {/* ===== GLOBAL STYLES ===== */}
      <style>{`
        body { font-family: 'Plus Jakarta Sans', sans-serif; }

        .health-card {
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.35s ease;
          background: #fff;
        }
        .health-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .health-card img {
          transition: transform 0.4s ease;
        }
        .health-card:hover img {
          transform: scale(1.05);
        }
        .benefit-badge {
          background: #fff;
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }
      `}</style>

      {/* ===== HERO SECTION ===== */}
      <header className="container py-5 text-center">
        <span className="badge bg-success-subtle text-success px-4 py-2 rounded-pill mb-3">
          🌿 100% Organic • Farm Verified
        </span>
        <h1 className="fw-bold display-4">
          Nourish Your Body With
          <span className="text-success"> Pure Farm Nutrition</span>
        </h1>
        <p className="fs-5 text-muted mx-auto" style={{ maxWidth: 720 }}>
          Freshly harvested crops delivered directly from trusted farmers to
          boost immunity, improve digestion, and support a healthier lifestyle.
        </p>
      </header>

      {/* ===== WHY HEALTHY ===== */}
      <section className="container mb-5">
        <div className="row g-4">
          {[
            {
              icon: "🧬",
              title: "High Nutrition",
              desc: "Harvested at peak maturity to retain vitamins & minerals."
            },
            {
              icon: "🚜",
              title: "Farmer Direct",
              desc: "No middlemen. Straight from farm to your kitchen."
            },
            {
              icon: "🛡️",
              title: "Immunity Boost",
              desc: "Naturally strengthens digestion & immune system."
            },
            {
              icon: "🌱",
              title: "100% Organic",
              desc: "Grown without harmful chemicals or preservatives."
            }
          ].map((item, i) => (
            <div className="col-md-3" key={i}>
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 text-center">
                <div style={{ fontSize: "2rem" }}>{item.icon}</div>
                <h6 className="fw-bold mt-3">{item.title}</h6>
                <p className="small text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CROPS SECTION ===== */}
      <section className="container pb-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h4 className="fw-bold mb-0">Farmer’s Fresh Picks</h4>
            <p className="small text-muted">
              Nutritional value verified & quality checked
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-grow text-success" />
          </div>
        ) : (
          <div className="row g-4">
            {crops.map((crop) => {
              const health = getHealthBenefit(crop);
              return (
                <div className="col-lg-3 col-md-6" key={crop._id}>
                  <div className="health-card shadow-sm h-100">
                    <div className="position-relative">
                      <img
                        src={
                          crop.image
                            ? `https://saakav1.onrender.com/uploads/${crop.image}`
                            : "https://via.placeholder.com/300x200"
                        }
                        alt={crop.name}
                        className="w-100"
                        style={{ height: 200, objectFit: "cover" }}
                      />
                      <div className="position-absolute bottom-0 start-0 p-3">
                        <span className="benefit-badge">
                          {health.icon} {health.tag}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h5 className="fw-bold">{crop.name}</h5>
                      <p className="text-muted small">
                        Packed with essential nutrients to support daily energy
                        and overall well-being.
                      </p>

                      <div className="d-flex gap-2 flex-wrap mb-3">
                        <span className="badge bg-success-subtle text-success">
                          High Fiber
                        </span>
                        <span className="badge bg-warning-subtle text-warning">
                          Vitamin Rich
                        </span>
                        <span className="badge bg-primary-subtle text-primary">
                          Low Fat
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted">Fresh Price</small>
                          <div className="fw-bold fs-5">
                            ₹{crop.sellingPrice}
                          </div>
                          <small className="text-success">
                            ✔ No middlemen
                          </small>
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

      {/* ===== HEALTH TIP ===== */}
      <section className="container mb-5">
        <div className="bg-dark text-white p-5 rounded-5 position-relative overflow-hidden">
          <h2 className="fw-bold">Today’s Nutrition Insight</h2>
          <p className="lead opacity-75">
            Nutritionists suggest consuming fresh{" "}
            {crops[0]?.name || "grains"} daily to improve gut health, energy
            levels, and immunity naturally.
          </p>
          <button className="btn btn-light rounded-pill px-4 fw-bold">
            Explore Health Blog
          </button>

          <div
            className="position-absolute end-0 top-0 bg-success opacity-25"
            style={{
              width: 300,
              height: 300,
              borderRadius: "50%",
              marginTop: -100,
              marginRight: -100
            }}
          />
        </div>
      </section>
    </div>
  );
}
