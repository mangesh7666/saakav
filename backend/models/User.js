const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    address: String,
    state: String,
    city: String,
    bankDetails: {
  bankName: String,
  accountNumber: String,
  ifsc: String,
  upiId: String,
},
    role: {
      type: String,
      enum: ["farmer", "user", "admin", "organization"],
      default: "user",
    },
  },
  { timestamps: true }
);

/* ✅ PREVENT OVERWRITE ERROR */
module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
