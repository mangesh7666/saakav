/*const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    expectedPrice: { type: Number, required: true },
    image: { type: String, required: true },
    reason: { type: String, default: null },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // 💰 PAYMENT TRACKING
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },

    transactionId: {
      type: String,
      default: null, // optional
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    paymentMode: {
      type: String,
      enum: ["Manual", "UPI", "Cash", "Bank"],
      default: "Manual",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crop", cropSchema);*/


const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },

    // Farmer expected price (what farmer wants)
    expectedPrice: { type: Number, required: true },

    // Admin controlled prices
    marketPrice: { type: Number },        // e.g. 500
    sellingPrice: { type: Number },       // e.g. 300

    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    description: {
      type: String,
      maxlength: 1000,
    },

    image: { type: String, required: true },
    reason: { type: String, default: null },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // 👀 User visibility
    isVisibleToUsers: {
      type: Boolean,
      default: false,
    },

    // 💰 PAYMENT TRACKING
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },

    transactionId: {
      type: String,
      default: null,
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    paymentMode: {
      type: String,
      enum: ["Manual", "UPI", "Cash", "Bank"],
      default: "Manual",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crop", cropSchema);


