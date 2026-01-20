// models/Cart.js
const mongoose = require("mongoose"); 

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      crop: { type: mongoose.Schema.Types.ObjectId, ref: "Crop" },
      quantity: { type: Number, default: 1 },
    },
  ],
}, { timestamps: true });

//export default mongoose.model("Cart", cartSchema);
module.exports =
  mongoose.models.Cart || mongoose.model("Cart", cartSchema);
