// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ethers } = require("ethers");

const Document = require("./models/document"); // Make sure this matches your exact filename
const LexChainABI = require("./LexChainABI.json");

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 2. Setup Ethers.js and the Stateless Polling Loop
const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, LexChainABI, provider);

console.log("🎧 Setting up robust manual polling for LexChain events...");

let lastBlockChecked = 0;

// Initialize our starting block
provider.getBlockNumber().then((blockNum) => {
  lastBlockChecked = blockNum;
  console.log(`📌 Polling started from block: ${lastBlockChecked}`);
  
  // Run our custom poll function every 5 seconds (5000 milliseconds)
  setInterval(pollForEvents, 5000);
}).catch(err => console.error("Error getting initial block:", err));

// The robust polling function to bypass public RPC load balancers
async function pollForEvents() {
  try {
    const latestBlock = await provider.getBlockNumber();

    // If no new blocks have been mined yet, just wait until next time
    if (latestBlock <= lastBlockChecked) return;

    // Fetch exactly the blocks we haven't checked yet
    const uploadEvents = await contract.queryFilter("DocumentUploaded", lastBlockChecked + 1, latestBlock);
    const verifyEvents = await contract.queryFilter("DocumentVerified", lastBlockChecked + 1, latestBlock);

    // --- Process Uploads ---
    for (let event of uploadEvents) {
      const docHash = event.args[1];
      const uploader = event.args[2];
      console.log(`\n🔥 New Document Detected! Hash: ${docHash}`);
      
      try {
        const docData = await contract.documents(docHash); 
        const newDoc = new Document({
          docHash: docHash,
          ipfsHash: docData.ipfsHash,
          uploader: uploader,
          isVerified: false
        });
        await newDoc.save();
        console.log("💾 Successfully saved to MongoDB!");
      } catch (error) {
        // Ignore duplicate key errors (code 11000) if the DB already has it
        if (error.code !== 11000) console.error("Error saving DB:", error.message);
      }
    }

    // --- Process Verifications ---
    for (let event of verifyEvents) {
      const docHash = event.args[1];
      console.log(`\n✅ Document Verified by Admin! Hash: ${docHash}`);
      try {
        await Document.findOneAndUpdate({ docHash: docHash }, { isVerified: true });
        console.log("💾 Updated status in MongoDB!");
      } catch (error) {
        console.error("Error updating DB:", error.message);
      }
    }

    // Update our tracker so we don't check these blocks again
    lastBlockChecked = latestBlock;

  } catch (error) {
    // If a single network request fails, we log it and try again in 5 seconds
    console.warn("⚠️ Network hiccup during polling (safe to ignore):", error.message);
  }
}

// 3. Create the API Endpoint for your React Admin Panel
app.get("/api/documents/pending", async (req, res) => {
  try {
    // Instantly fetch all unverified documents from MongoDB
    const pendingDocs = await Document.find({ isVerified: false }).sort({ timestamp: -1 });
    res.json(pendingDocs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// 4. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 LexChain Indexer running on port ${PORT}`);
});