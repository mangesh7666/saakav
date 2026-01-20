import { useEffect, useState } from "react";
import axios from "axios";

export default function MyProfile() {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= FETCH USER PROFILE ================= */
  useEffect(() => {
    axios
      .get("https://saakav1.onrender.com/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => alert("Failed to load profile"));
  }, []);

  /* ================= HANDLE INPUT CHANGE ================= */
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    try {
      await axios.put(
        "https://saakav1.onrender.com/api/user/profile",
        {
          name: user.name,
          phone: user.phone,
          city: user.city,
          address: user.address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated successfully ✅");
      setEdit(false);
    } catch (err) {
      alert("Profile update failed ❌");
    }
  };

  if (!user)
    return <p className="text-center mt-5 fw-bold">Loading profile...</p>;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f9fcfa" }}>
      <style>{`
        :root {
          --agri: #2d5a27;
          --glass: rgba(255,255,255,0.78);
        }

        .profile-card {
          background: var(--glass);
          backdrop-filter: blur(16px);
          border-radius: 28px;
          padding: 32px;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 22px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          text-align: center;
        }

        .profile-img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .btn-agri {
          background: linear-gradient(135deg, #2d5a27, #1e3d1a);
          color: white;
          border-radius: 14px;
          padding: 12px 28px;
          border: none;
          font-weight: 700;
        }

        .form-control {
          border-radius: 12px;
        }

        .text-agri {
          color: var(--agri);
        }
      `}</style>

      {/* ================= PROFILE HEADER ================= */}
      <section className="container py-5">
        <div className="profile-card mb-5">
          <div className="row align-items-center g-4">
            <div className="col-md-3 text-center">
              <img
                src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
                alt="User"
                className="profile-img mb-3"
              />
              <span className="badge bg-success">Verified User</span>
            </div>

            <div className="col-md-6">
              <h3 className="fw-bold mb-1">{user.name}</h3>
              <p className="text-muted mb-2">
                {user.role?.toUpperCase()} • {user.city || "India"}
              </p>
              <p className="small text-muted">
                Connected with verified farmers and organizations.
              </p>
            </div>

            <div className="col-md-3 text-md-end">
              <button
                className="btn-agri"
                onClick={() => {
                  if (edit) saveProfile();
                  else setEdit(true);
                }}
              >
                {edit ? "Save Profile" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* ================= STATS ================= */}
       {/* <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="stat-card">
              <h4 className="fw-bold text-agri">28</h4>
              <p className="small text-muted mb-0">Trades Completed</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <h4 className="fw-bold text-agri">₹4.2Cr</h4>
              <p className="small text-muted mb-0">Total Volume</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <h4 className="fw-bold text-agri">4.9★</h4>
              <p className="small text-muted mb-0">Rating</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <h4 className="fw-bold text-agri">Active</h4>
              <p className="small text-muted mb-0">Account Status</p>
            </div>
          </div>
        </div>*/}

        {/* ================= PERSONAL INFO ================= */}
        <div className="profile-card mb-5">
          <h5 className="fw-bold mb-4">Personal Information</h5>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="small text-muted">Email</label>
              <input className="form-control" value={user.email} disabled />
            </div>

            <div className="col-md-6">
              <label className="small text-muted">Phone</label>
              <input
                className="form-control"
                name="phone"
                disabled={!edit}
                value={user.phone || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="small text-muted">City</label>
              <input
                className="form-control"
                name="city"
                disabled={!edit}
                value={user.city || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="small text-muted">Role</label>
              <input
                className="form-control"
                value={user.role}
                disabled
              />
            </div>

            <div className="col-md-12">
              <label className="small text-muted">Address</label>
              <input
                className="form-control"
                name="address"
                disabled={!edit}
                value={user.address || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ================= SECURITY ================= */}
        {/*<div className="profile-card">
          <h5 className="fw-bold mb-4">Verification & Security</h5>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="stat-card">
                <h6 className="fw-bold">KYC Status</h6>
                <span className="badge bg-success">Approved</span>
              </div>
            </div>

            <div className="col-md-4">
              <div className="stat-card">
                <h6 className="fw-bold">Bank Account</h6>
                <span className="badge bg-success">Linked</span>
              </div>
            </div>

            <div className="col-md-4">
              <div className="stat-card">
                <h6 className="fw-bold">Security</h6>
                <span className="badge bg-warning text-dark">
                  2FA Disabled
                </span>
              </div>
            </div>
          </div>
        </div>*/}
      </section>
    </div>
  );
}
