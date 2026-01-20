// models/Wishlist.js
const mongoose = require("mongoose"); 

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  crop: { type: mongoose.Schema.Types.ObjectId, ref: "Crop", required: true },
}, { timestamps: true });

wishlistSchema.index({ user: 1, crop: 1 }, { unique: true });

//export default mongoose.model("Wishlist", wishlistSchema);
/* ✅ PREVENT OVERWRITE ERROR */
module.exports =
  mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
