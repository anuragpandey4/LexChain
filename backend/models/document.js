
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  docHash: { type: String, required: true, unique: true },
  ipfsHash: { type: String, required: true },
  uploader: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model("Document", documentSchema);