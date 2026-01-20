// models/LegalContent.js
const mongoose = require("mongoose");

const legalSchema = new mongoose.Schema({
  title: String,
  content: String,
  order: Number, // to order sections
});

module.exports = mongoose.model("LegalContent", legalSchema);
