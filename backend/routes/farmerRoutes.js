const express = require("express");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Help = require("../models/help");
const Payment = require("../models/Payment");
const auth = require("../middleware/authMiddleware");
const Crop = require("../models/Crop");
const multer = require("multer");
const path = require("path");
const LegalContent = require("../models/LegalContent");

cloudinary.config({ 
  cloudinary_url: process.env.CLOUDINARY_URL,
  secure: true
});



const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "saakav/crops",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });



/* ================= GET LOGGED-IN FARMER PROFILE ================= */
router.get("/profile", auth, async (req, res) => {
  try {
    const farmer = await User.findById(req.user.id).select("-password");
    res.json(farmer);
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
});

/* ================= UPDATE FARMER PROFILE ================= */
router.put("/profile", auth, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
});

/* ================= SUBMIT HELP QUERY ================= */
router.post("/help", auth, async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const help = new Help({
      farmer: req.user.id,
      subject,
      message,
    });

    await help.save();

    res.json({ message: "Query submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit query" });
  }
});

/* ================= FARMER HELP HISTORY (OPTIONAL) ================= */
router.get("/help", auth, async (req, res) => {
  try {
    const queries = await Help.find({ farmer: req.user.id })
      .sort({ createdAt: -1 });

    res.json(queries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch queries" });
  }
});

/* ================= CHANGE FARMER PASSWORD ================= */
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    console.log("Request Body:", req.body);
    console.log("User ID:", req.user.id);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.user.id);
    console.log("User Found:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: "Password update failed" });
  }
});

/* ================= GET BANK / UPI DETAILS ================= */
router.get("/bank-details", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("bankDetails");
    res.json(user.bankDetails || {});
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bank details" });
  }
});

/* ================= UPDATE BANK / UPI DETAILS ================= */
router.put("/bank-details", auth, async (req, res) => {
  try {
    const { bankName, accountNumber, ifsc, upiId } = req.body;

    if (!bankName && !upiId) {
      return res.status(400).json({
        message: "Please provide bank details or UPI ID",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        bankDetails: { bankName, accountNumber, ifsc, upiId },
      },
      { new: true }
    );

    res.json({
      message: "Bank / UPI details saved successfully",
      bankDetails: user.bankDetails,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to save bank details" });
  }
});

/* ================= UPLOAD CROP ================= */
/* ================= UPLOAD CROP ================= */
router.post("/upload-crop", auth, upload.single("image"), async (req, res) => {
  try {
    console.log("UPLOAD CROP REQUEST BODY:", req.body);
    console.log("UPLOAD CROP FILE INFO:", req.file);

    const { name, category, quantity, expectedPrice } = req.body;

    // Cloudinary URL
    const image = req.file?.path;

    // Validation
    if (!name || !category || !quantity || !expectedPrice || !image) {
      console.warn("Validation failed: Missing fields or image");
      return res.status(400).json({ message: "All fields are required, including image" });
    }

    // Save to database
    const newCrop = new Crop({
      farmer: req.user.id,
      name,
      category,
      quantity: Number(quantity),
      expectedPrice: Number(expectedPrice),
      image,
    });

    await newCrop.save();

    console.log("CROP SAVED SUCCESSFULLY:", newCrop);

    res.json({ message: "Crop uploaded successfully", crop: newCrop });
  } catch (err) {
    console.error("UPLOAD CROP ERROR:", err.message);
    console.error(err.stack);

    // Cloudinary-specific error hint
    if (err.name === "MulterError") {
      return res.status(500).json({ message: "Image upload failed. Check file size and format." });
    }

    res.status(500).json({ message: "Failed to upload crop. See server logs for details." });
  }
});


// GET pending crops for logged-in farmer
router.get("/pending-crops", auth, async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user.id, status: "Pending" }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pending crops" });
  }
});

// DELETE a crop (cancel)
router.delete("/crop/:id", auth, async (req, res) => {
  try {
    // Combine finding and deleting into one step for efficiency
    const crop = await Crop.findOneAndDelete({ 
      _id: req.params.id, 
      farmer: req.user.id 
    });

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.json({ message: "Crop cancelled successfully" });
  } catch (err) {
    console.error(err); // Check your terminal/console for the specific error message
    res.status(500).json({ message: "Failed to cancel crop" });
  }
});

// GET approved crops for logged-in farmer
router.get("/approved-crops", auth, async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user.id, status: "Approved" }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch approved crops" });
  }
});

// GET cancelled crops for logged-in farmer
router.get("/cancelled-crops", auth, async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user.id, status: "Rejected" }).sort({ updatedAt: -1 });
    res.json(crops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cancelled crops" });
  }
});

// GET legal & policies
router.get("/legal", async (req, res) => {
  try {
    const sections = await LegalContent.find().sort({ order: 1 });
    res.json(sections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load legal content" });
  }
});

// GET farmer history
router.get("/history", auth, async (req, res) => {
  try {
    const farmerId = req.user.id;

    // Fetch crops uploaded by the farmer
    const crops = await Crop.find({ farmer: farmerId }).sort({ createdAt: -1 });
    
    // Fetch payments received by the farmer
    const payments = await Payment.find({ farmer: farmerId }).sort({ createdAt: -1 });

    // Merge into a single history array
    const history = [];

    crops.forEach(crop => {
      history.push({
        type: crop.status === "Cancelled" ? "Cancelled Crop" : "Uploaded Crop",
        name: crop.name,
        quantity: crop.quantity,
        expectedPrice: crop.expectedPrice,
        date: crop.updatedAt || crop.createdAt,
        status: crop.status,
      });
    });

    payments.forEach(pay => {
      history.push({
        type: pay.type, // "Payment Received" or "Refund"
        amount: pay.amount,
        date: pay.date,
        status: pay.status,
      });
    });

    // Sort by date descending
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});


// GET farmer dashboard stats
router.get("/dashboard", auth, async (req, res) => {
  try {
    const farmerId = req.user.id;

    // Fetch all crops of the farmer
    const crops = await Crop.find({ farmer: farmerId }).sort({ createdAt: -1 });

    // Separate crops by status
    const uploadedCount = crops.length;
    const uploadedQty = crops.reduce((sum, c) => sum + c.quantity, 0);

    const approvedCrops = crops.filter(c => c.status === "Approved");
    const pendingCrops = crops.filter(c => c.status === "Pending");
    const cancelledCrops = crops.filter(c => c.status === "Rejected");

    // Payments: crops with paymentStatus === "Paid"
    const payments = crops.filter(c => c.paymentStatus === "Paid");

    // Prepare recent activities
    const recentActivities = [
      ...crops.map(c => ({
        type: c.status === "Rejected" ? "Cancelled Crop" : "Uploaded Crop",
        crop: c.name,
        quantity: c.quantity,
        status: c.status,
        date: c.updatedAt || c.createdAt,
      })),
      ...payments.map(p => ({
        type: "Payment Received",
        crop: p.name,
        quantity: p.expectedPrice,
        status: p.paymentStatus,
        paymentMode: p.paymentMode,
        transactionId: p.transactionId,
        date: p.paymentDate || p.updatedAt || p.createdAt,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      uploadedCount,
      uploadedQty,
      pendingCount: pendingCrops.length,
      pendingQty: pendingCrops.reduce((sum, c) => sum + c.quantity, 0),
      approvedCount: approvedCrops.length,
      approvedQty: approvedCrops.reduce((sum, c) => sum + c.quantity, 0),
      cancelledCount: cancelledCrops.length,
      cancelledQty: cancelledCrops.reduce((sum, c) => sum + c.quantity, 0),
      payments: payments.map(p => ({
        crop: p.name,
        amount: p.expectedPrice,
        paymentStatus: p.paymentStatus,
        paymentMode: p.paymentMode,
        transactionId: p.transactionId,
        paymentDate: p.paymentDate,
      })),
      recentActivities,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});


//dashboard analysis
// Chart analytics for dashboard
router.get("/dashboard-charts", auth, async (req, res) => {
  try {
    const farmerId = req.user.id;

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const uploaded = Array(12).fill(0);
    const approved = Array(12).fill(0);
    const payments = Array(12).fill(0);

    // Fetch all crops of the farmer
    const crops = await Crop.find({ farmer: farmerId });

    crops.forEach(c => {
      const monthIndex = new Date(c.createdAt).getMonth();

      // Total uploaded quantity
      uploaded[monthIndex] += c.quantity;

      // Approved crops quantity
      if (c.status === "Approved") approved[monthIndex] += c.quantity;

      // Payments received
      if (c.paymentStatus === "Paid" && c.paymentDate) {
        const payMonth = new Date(c.paymentDate).getMonth();
        payments[payMonth] += c.expectedPrice; // or actual amount if you have
      }
    });

    res.json({ months, uploaded, approved, payments });
  } catch (err) {
    console.error("Dashboard Charts Error:", err);
    res.status(500).json({ message: "Failed to fetch chart data" });
  }
});





// ===============================
// GET PAYMENTS FOR LOGGED-IN FARMER
// ===============================
// GET payments for approved crops of logged-in farmer
router.get("/payments", auth, async (req, res) => {
  try {
    const crops = await Crop.find({
      farmer: req.user.id,          // ✅ let mongoose auto-cast
      status: "Approved",
    }).sort({ createdAt: -1 });

    const payments = crops.map((c) => ({
      _id: c._id,
      crop: c.name,
      quantity: c.quantity,
      amount: c.expectedPrice,
      paymentStatus: c.paymentStatus,
      paymentMode: c.paymentMode,
      transactionId: c.transactionId,
      paymentDate: c.paymentDate,
    }));

    res.status(200).json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch payments",
    });
  }
});


module.exports = router;
