const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* REGISTER (Farmer/User/Org) */
router.post("/register", async (req, res) => {
  const {name, email, password, role, phone, address, state, city} = req.body;
  if (role === "admin") return res.status(403).json({ message: "Not allowed" });

  const hashed = await bcrypt.hash(password, 12);
  await User.create({ name, email, password: hashed, role, phone, address, state, city });

  res.json({ message: "Registered Successfully" });
});

/* COMMON LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.role === "admin")
    return res.status(400).json({ message: "Invalid Login" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong Password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, role: user.role });
});

/* ADMIN LOGIN */
router.post("/admin-login", async (req, res) => {
  const admin = await User.findOne({ email: req.body.email, role: "admin" });
  if (!admin) return res.status(400).json({ message: "Admin not found" });

  const match = await bcrypt.compare(req.body.password, admin.password);
  if (!match) return res.status(400).json({ message: "Wrong Password" });

  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, role: "admin" });
});

module.exports = router;
