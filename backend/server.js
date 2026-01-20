require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/authRoutes"));      // login/register
app.use("/api/farmer", require("./routes/farmerRoutes")); // farmer profile
app.use("/api/admin" , require("./routes/adminRoutes")); //admin profile
app.use("/api/user" , require("./routes/userRoutes")); //user route
/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
