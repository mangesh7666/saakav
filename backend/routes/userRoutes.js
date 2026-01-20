const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Help = require("../models/help");
//const Payment = require("../models/Payment");
const auth = require("../middleware/authMiddleware");
const Crop = require("../models/Crop");
const multer = require("multer");
const path = require("path");
const LegalContent = require("../models/LegalContent");
const Wishlist = require("../models/Wishlist");
const Cart = require("../models/cart");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");


/* ================= GET LOGGED-IN USER PROFILE ================= */
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
});

/* ================= UPDATE USER PROFILE ================= */
router.put("/profile", auth, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        phone: req.body.phone,
        city: req.body.city,
        address: req.body.address,
        bankDetails: req.body.bankDetails,
      },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
});

//user help query submit route
router.post("/userhelp", auth, async (req, res) => {
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

//get help data
router.get("/help", auth, async (req, res) => {
  try {
    const queries = await Help.find({ farmer: req.user.id })
      .sort({ createdAt: -1 });

    res.json(queries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch queries" });
  }
});

//change password
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

//update profile settings
// routes/user.js
router.put("/update-profile", auth, async (req, res) => {
  try {
    const { name, phone, address, state, city } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // update only allowed fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.state = state || user.state;
    user.city = city || user.city;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
});


// ===============================
// USER – VIEW CROPS FOR PURCHASE
// ===============================
router.get("/user/crops", async (req, res) => {
  try {
    const crops = await Crop.find({
      status: "Approved",
      isVisibleToUsers: true,
    }).select(
      "name category image quantity sellingPrice marketPrice discountPercent description"
    );

    res.json(crops);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch crops",
      error: err.message,
    });
  }
});

//wishlist
router.post("/wishlist/:cropId", auth, async (req, res) => {
  const { cropId } = req.params;
  const userId = req.user.id;

  const existing = await Wishlist.findOne({ user: userId, crop: cropId });

  if (existing) {
    await Wishlist.deleteOne({ _id: existing._id });
    return res.json({ message: "Removed from wishlist", wishlisted: false });
  }

  await Wishlist.create({ user: userId, crop: cropId });
  res.json({ message: "Added to wishlist", wishlisted: true });
});


//fetch data of wishlist 
// GET wishlist with crop details
router.get("/wishlist", auth, async (req, res) => {
  const wishlist = await Wishlist.find({ user: req.user.id })
    .populate("crop", "name image sellingPrice category");

  res.json(wishlist.map(item => item.crop));
});


// --- ADD TO CART (Fixed for Crop.quantity) ---
router.post("/cart/add/:cropId", auth, async (req, res) => {
  const { cropId } = req.params;
  const { type } = req.body; 

  try {
    // Use the imported Crop model. 
    // In your model, the field is 'quantity', NOT 'stock'.
    const crop = await Crop.findById(cropId);
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      // Check available quantity from Crop model
      if (crop.quantity < 1) return res.status(400).json({ message: "Out of stock" });
      
      cart = new Cart({
        user: req.user.id,
        items: [{ crop: cropId, quantity: 1 }],
      });
    } else {
      const item = cart.items.find(i => i.crop.toString() === cropId);
      
      if (item) {
        if (type === "dec") {
          item.quantity = Math.max(1, item.quantity - 1);
        } else {
          // CHECK AGAINST crop.quantity
          if (item.quantity + 1 > crop.quantity) {
            return res.status(400).json({ message: `Only ${crop.quantity} units available` });
          }
          item.quantity += 1;
        }
      } else {
        if (crop.quantity < 1) return res.status(400).json({ message: "Out of stock" });
        cart.items.push({ crop: cropId, quantity: 1 });
      }
    }
    
    await cart.save();

    // Populate using the correct fields from your model
    const populatedCart = await Cart.findById(cart._id).populate("items.crop", "name sellingPrice image quantity");
    res.json(populatedCart);
    
  } catch (err) {
    console.error("Backend Error:", err); // This helps you see the error in terminal
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// --- UPDATE QUANTITY (Fixed for Crop.quantity) ---
router.put("/cart/update/:cropId", auth, async (req, res) => {
  const { cropId } = req.params;
  const { quantity } = req.body; // New quantity requested from frontend

  try {
    const crop = await Crop.findById(cropId);
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    // Validate against available quantity
    if (quantity > crop.quantity) {
      return res.status(400).json({ message: `Cannot exceed available quantity of ${crop.quantity}` });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.crop.toString() === cropId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.crop", "name sellingPrice image quantity");
    res.json(populatedCart);
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// --- REMOVE ITEM ---
router.delete("/cart/remove/:cropId", auth, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(item => item.crop.toString() !== req.params.cropId);
  await cart.save();

  // FIX: Populate before sending
  const populatedCart = await cart.populate("items.crop", "name sellingPrice image");
  res.json(populatedCart);
});

//get cart
// --- GET USER CART ---
router.get("/cart", auth, async (req, res) => {
  try {
    // 1. Find the cart and populate crop details immediately
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.crop", "name sellingPrice image");

    // 2. If no cart exists, return a default empty cart structure
    if (!cart) {
      return res.json({ items: [] });
    }

    // 3. Return the populated cart
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error fetching cart" });
  }
});



//payments data 
const razorpay = new Razorpay({
  key_id: "rzp_test_eO8U4v2rB4xQx0", 
  key_secret: "1LS7707HRjmhmJWVjeqo5Zf0",
});

// 1. CREATE ORDER
router.post("/create-order", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // Amount in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Order creation failed" });
  }
});

// 2. VERIFY & SAVE TO DB
// 2. VERIFY & SAVE TO DB
router.post("/verify-payment", auth, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderDetails 
    } = req.body;

    // 1. SECURITY CHECK: Verify the signature
    // The signature is a hash of (order_id + "|" + payment_id) using your Secret Key
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", "1LS7707HRjmhmJWVjeqo5Zf0") // Use your actual secret key
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      console.error("Payment Verification Failed: Signature Mismatch");
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // 2. FETCH CART: Get the user's current items
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.crop");
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 3. CREATE ORDER: Save the purchase history to the database
    const newOrder = new Order({
      user: req.user.id,
      items: cart.items.map(item => ({
        crop: item.crop._id,
        name: item.crop.name,
        quantity: item.quantity,
        price: item.crop.sellingPrice
      })),
      totalAmount: cart.items.reduce((acc, item) => acc + (item.crop.sellingPrice * item.quantity), 0),
      shippingAddress: orderDetails.address, // Contains the object {address, city, phone}
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id
    });

    const savedOrder = await newOrder.save();

    // 4. INVENTORY MANAGEMENT: Reduce stock from the Crops collection
    for (const item of cart.items) {
      await Crop.findByIdAndUpdate(item.crop._id, {
        $inc: { quantity: -item.quantity } // Subtract purchased quantity from stock
      });
    }

    // 5. CLEANUP: Delete the user's cart now that the order is placed
    await Cart.findOneAndDelete({ user: req.user.id });

    // Success response
    res.status(200).json({ 
      success: true,
      message: "Order placed successfully!", 
      orderId: savedOrder._id 
    });

  } catch (err) {
    console.error("CRITICAL ERROR IN PAYMENT VERIFICATION:", err);
    res.status(500).json({ message: "Server error during verification", error: err.message });
  }
});


// GET USER ORDERS
router.get("/my-orders", auth, async (req, res) => {
  try {
    // Find orders for the user, sorted by newest first
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
module.exports = router;
