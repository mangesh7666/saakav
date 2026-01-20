const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Help = require("../models/Help");
//const Payment = require("../models/Payment");
const auth = require("../middleware/authMiddleware");
const Crop = require("../models/Crop");
const multer = require("multer");
const path = require("path");
const LegalContent = require("../models/LegalContent");
const Order = require("../models/Order");

/* ================= GET LOGGED-IN Admin PROFILE ================= */
router.get("/adminprofile", auth, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
});

//update profile
router.put("/adminprofileupdate", auth, async (req, res) => {
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

//get help details 
router.get("/all-help",auth, async (req, res) => {
  try {
    const helpRequests = await Help.find()
      .populate("farmer", "name email phone role") 
      .sort({ createdAt: -1 });        

    res.status(200).json(helpRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});

//update help status
router.patch("/help/status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["open", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'open' or 'resolved'" });
    }

    const updatedRequest = await Help.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true, runValidators: true } // returns the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Help request not found" });
    }

    res.status(200).json({ message: "Status updated successfully", updatedRequest });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
});

// Fetch all farmers bank & UPI details (ADMIN)
router.get("/bank-upi-details", auth, async (req, res) => {
  try {
    // Optional: ensure only admin can access
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const farmers = await User.find({ role: "farmer" }).select(
      "name email phone bankDetails"
    );

    const response = farmers.map((f) => ({
      _id: f._id,
      name: f.name,
      email: f.email,
      phone: f.phone,
      bankName: f.bankDetails?.bankName || "",
      accountNumber: f.bankDetails?.accountNumber || "",
      ifsc: f.bankDetails?.ifsc || "",
      upiId: f.bankDetails?.upiId || "",
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bank details" });
  }
});


// ===============================
// UPDATE CROP PAYMENT STATUS (ADMIN)
// ===============================
router.put("/crop/payment/:cropId", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const { paymentStatus, transactionId, paymentMode } = req.body;

    if (!["Paid", "Unpaid"].includes(paymentStatus)) {
      return res.status(400).json({
        message: "Payment status must be Paid or Unpaid",
      });
    }

    const crop = await Crop.findByIdAndUpdate(
      req.params.cropId,
      {
        paymentStatus,
        transactionId: transactionId || null,
        paymentMode: paymentMode || "Manual",
        paymentDate: paymentStatus === "Paid" ? new Date() : null,
      },
      { new: true }
    ).populate("farmer", "name email phone");

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.status(200).json({
      message: "Payment status updated successfully",
      crop,
    });
  } catch (error) {
    res.status(500).json({
      message: "Payment update failed",
      error: error.message,
    });
  }
});


// ===============================
// GET UNPAID CROPS (ADMIN)
// ===============================
router.get("/unpaid-crops", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const crops = await Crop.find({ paymentStatus: "unpaid" })
      .populate("farmer", "name phone bankDetails")
      .sort({ createdAt: -1 });

    res.status(200).json(crops);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch unpaid crops",
      error: error.message,
    });
  }
});


// ===============================
// GET ALL CROPS (ADMIN)
// ===============================
router.get("/all-crops", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // ✅ Filter: status = Approved AND paymentStatus = Unpaid
    const crops = await Crop.find({
      status: "Approved",
      paymentStatus: "Unpaid",
    })
      .populate("farmer", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(crops);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch crops",
      error: error.message,
    });
  }
});

//get all uploaded crop
router.get("/crops/uploaded", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access only" });

    const crops = await Crop.find()
      .populate("farmer", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(crops);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch uploaded crops", error: err.message });
  }
});

// GET pending crops
router.get("/crops/pending", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access only" });

    const crops = await Crop.find({ status: "Pending" })
      .populate("farmer", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(crops);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending crops", error: err.message });
  }
});

// GET approved crops
router.get("/crops/approved", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access only" });

    const crops = await Crop.find({ status: "Approved" })
      .populate("farmer", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(crops);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch approved crops", error: err.message });
  }
});

// GET cancelled/rejected crops
router.get("/crops/rejected", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access only" });

    const crops = await Crop.find({ status: "Rejected" })
      .populate("farmer", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(crops);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rejected crops", error: err.message });
  }
});

// PUT route to approve or reject a crop
router.put("/crop/status/:cropId", auth, async (req, res) => {
  try {
    // Only admin can approve/reject
    if (req.user.role !== "admin") 
      return res.status(403).json({ message: "Admin access only" });

    const { status, reason } = req.body; // "Approved" or "Rejected"

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'Approved' or 'Rejected'" });
    }

    // Prepare update object
    const updateData = { status };
    if (status === "Rejected" && reason) updateData.reason = reason;

    const crop = await Crop.findByIdAndUpdate(
      req.params.cropId,
      updateData,
      { new: true }
    ).populate("farmer", "name email phone");

    if (!crop) return res.status(404).json({ message: "Crop not found" });

    res.status(200).json({
      message: `Crop ${status.toLowerCase()} successfully`,
      crop,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update crop status", error: err.message });
  }
});


/* =========================
   CREATE LEGAL CONTENT
========================= */
router.post("/legal", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access only" });

    const { title, content, order } = req.body;

    if (!title || !content || order === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSection = new LegalContent({ title, content, order });
    await newSection.save();

    res.status(201).json({
      message: "Legal content created successfully",
      section: newSection,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create legal content", error: err.message });
  }
});

/* =========================
   UPDATE LEGAL CONTENT
========================= */
router.put("/legal/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access only" });

    const { title, content, order } = req.body;
    const updatedData = {};

    if (title) updatedData.title = title;
    if (content) updatedData.content = content;
    if (order !== undefined) updatedData.order = order;

    const updatedSection = await LegalContent.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedSection) return res.status(404).json({ message: "Legal content not found" });

    res.json({
      message: "Legal content updated successfully",
      section: updatedSection,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update legal content", error: err.message });
  }
});

/* =========================
   DELETE LEGAL CONTENT
========================= */
router.delete("/legal/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access only" });

    const deletedSection = await LegalContent.findByIdAndDelete(req.params.id);

    if (!deletedSection) return res.status(404).json({ message: "Legal content not found" });

    res.json({ message: "Legal content deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete legal content", error: err.message });
  }
});

/* =========================
   LIST ALL LEGAL CONTENT
========================= */
router.get("/legal", auth , async (req, res) => {
  try {
    const sections = await LegalContent.find().sort({ order: 1 });
    res.json(sections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch legal content", error: err.message });
  }
});

// ===============================
// GET ADMIN SETTINGS
// ===============================
router.get("/settings", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const admin = await User.findById(req.user.id).select("name email");
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

// ===============================
// UPDATE ADMIN PROFILE
// ===============================
router.put("/settings/profile", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const { name } = req.body;

    const updatedAdmin = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select("name email");

    res.json({
      message: "Profile updated successfully",
      user: updatedAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
});

// ===============================
// CHANGE ADMIN PASSWORD
// ===============================
router.put("/settings/password", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const { currentPassword, newPassword } = req.body;

    const admin = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Password update failed" });
  }
});

// ===============================
// SET USER SELLING PRICE & PUBLISH CROP (ADMIN)
// ===============================
router.put("/crop/publish/:cropId", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const {
      marketPrice,
      sellingPrice,
      description,
    } = req.body;

    if (!marketPrice || !sellingPrice) {
      return res.status(400).json({ message: "Prices are required" });
    }

    const discountPercent = Math.round(
      ((marketPrice - sellingPrice) / marketPrice) * 100
    );

    const crop = await Crop.findByIdAndUpdate(
      req.params.cropId,
      {
        marketPrice,
        sellingPrice,
        discountPercent,
        description,
        status: "Approved",
        isVisibleToUsers: true,
      },
      { new: true }
    );

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.json({
      message: "Crop published successfully for users",
      crop,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to publish crop",
      error: err.message,
    });
  }
});

//get crops 
router.get("/crops", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const crops = await Crop.find()
      .populate("farmer", "name email")
      .sort({ createdAt: -1 });

    res.json(crops);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch crops",
      error: err.message,
    });
  }
});

// ===============================
// GET ALL CUSTOMER ORDERS (ADMIN)
// ===============================
router.get("/all-orders", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const orders = await Order.find()
      .populate("user", "name email phone") // Get customer details
      .populate("items.crop") // Get crop details if needed
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
});

// ===============================
// UPDATE ORDER STATUS (ADMIN)
// ===============================
router.put("/order/status/:orderId", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const { status } = req.body;
    const validStatuses = ["Pending", "Processing", "Ready to Dispatch", "Dispatched", "Delivered", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { orderStatus: status }, // Ensure 'orderStatus' exists in your schema or use 'status'
      { new: true }
    ).populate("user", "name email phone");

    res.json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// ===============================
// GET DASHBOARD ANALYTICS (ADMIN)
// ===============================
router.get("/dashboard-stats", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access only" });

    // 1. Existing Counts
    const stats = {
      totalFarmers: await User.countDocuments({ role: "farmer" }),
      totalUsers: await User.countDocuments({ role: "user" }),
      pendingCrops: await Crop.countDocuments({ status: "Pending" }),
      activeProducts: await Crop.countDocuments({ isVisibleToUsers: true }),
      totalOrders: await Order.countDocuments(),
    };

    // 2. Revenue Data (Last 6 Months)
    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Map month numbers to Names (e.g., 1 -> Jan)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedRevenue = monthlyRevenue.map(item => ({
      month: monthNames[item._id - 1],
      revenue: item.revenue,
      orders: item.orders
    }));

    // 3. Inventory by Category (e.g., Grains, Vegetables, Fruits)
    const categoryData = await Crop.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.json({
      stats,
      revenueData: formattedRevenue,
      categoryData: categoryData.map(c => ({ name: c._id || "Other", value: c.count })),
      cropStatusData: [
        { name: "Pending", value: await Crop.countDocuments({ status: "Pending" }) },
        { name: "Approved", value: await Crop.countDocuments({ status: "Approved" }) },
        { name: "Rejected", value: await Crop.countDocuments({ status: "Rejected" }) }
      ]
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch professional stats", error: err.message });
  }
});


// ===============================
// GET ALL USERS (ADMIN)
// ===============================
router.get("/users/all", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // Fetch all users except the admin themselves
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("-password") // Never send passwords to frontend
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

// ===============================
// DELETE A USER (ADMIN)
// ===============================
router.delete("/users/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access only" });
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});
module.exports = router;