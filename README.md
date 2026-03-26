# LexChain

A decentralized application (dApp) featuring a decoupled architecture. The client-side handles direct Web3 interactions, while a dedicated Node.js backend indexes and tracks blockchain transaction hashes for optimized querying.

Developed by Anurag Pandey (B.Tech, Computer Science and Engineering).

## 🏗 Project Structure

This project is divided into two specialized environments:

- `/frontend` - The user interface and direct blockchain/Web3 connection layer. Handles user wallet connections and smart contract execution.
- `/backend` - A Node.js service dedicated strictly to listening, indexing, and storing blockchain transaction hashes for fast data retrieval.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm or yarn
- A Web3 wallet browser extension (e.g., MetaMask)

## 🛠 Installation & Setup

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/anuragpandey4/LexChain.git
cd LexChain
\`\`\`

### 2. Backend Setup (The Hash Indexer)
Navigate to the backend directory, install dependencies, and set up your environment variables.

\`\`\`bash
cd backend
npm install
\`\`\`

**Environment Variables:**
Create a `.env` file in the `backend` directory. Do not commit this file to version control. 
\`\`\`env
# backend/.env
PORT=3000
# Add your database URI, RPC endpoints, or indexing API keys here
\`\`\`

To start the indexing server:
\`\`\`bash
npm start 
# or node server.js
\`\`\`

### 3. Frontend Setup (The Web3 Client)
Open a new terminal window, navigate to the frontend directory, and install its dependencies.

\`\`\`bash
cd frontend
npm install
\`\`\`

**Environment Variables:**
Create a `.env` file in the `frontend` directory for your client-side variables (e.g., public RPC URLs or contract addresses).

To start the frontend development server:
\`\`\`bash
npm run dev
# or npm start (depending on your framework)
\`\`\`

## 🔗 Smart Contract Integration

The frontend connects directly to the blockchain to execute transactions. Ensure that your smart contracts are deployed and that the `LexChainABI.json` file is accessible to your frontend components. When a transaction is confirmed on the client side, the backend indexer captures and stores the resulting transaction hashes.

## 🛡️ Security Note

This project strictly ignores `.env` files and `node_modules` to protect sensitive API keys and maintain a clean repository. If you are forking or cloning this project, you must provide your own `.env` files based on the required configuration.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)