const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    crop: { type: mongoose.Schema.Types.ObjectId, ref: "Crop" },
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    address: String,
    city: String,
    phone: String
  },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  orderDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);