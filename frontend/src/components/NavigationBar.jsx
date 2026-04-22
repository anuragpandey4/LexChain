import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom"; // Notice we imported NavLink!
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/config";
import { useWeb3 } from "../context/Web3Context"; // Using your global context!

const NavigationBar = () => {
  const { account, isAdmin } = useWeb3();

  // Function triggered by the "Connect Wallet" button
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      // Web3Context automatically picks up the account change!
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  // Helper to make the wallet address look nice (e.g., 0x1234...5678)
  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // This function dynamically applies Tailwind classes based on whether the route is active
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-700 font-bold border-b-2 border-blue-700 pb-1 transition"
      : "text-slate-500 hover:text-blue-600 font-medium transition pb-1";

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 p-4 mb-8 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-blue-900 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-lg text-lg">L</div>
          LexChain
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {/* We use 'end' on the home route so it doesn't stay highlighted on sub-pages */}
          <NavLink to="/verify" end className={navLinkClass}>
            Verify Document
          </NavLink>
          
          <NavLink to="/upload" className={navLinkClass}>
            Upload Portal
          </NavLink>

          <NavLink to="/my-uploads" className={navLinkClass}>
            My Uploads
          </NavLink>
          
          {/* Only render this link if the user is the Admin */}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Gov Admin
            </NavLink>
          )}

          {/* Connect Wallet Button */}
          <button
            onClick={connectWallet}
            className={`font-semibold py-2 px-4 rounded-lg shadow-sm transition ${
              account
                ? "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {account ? formatAddress(account) : "Connect Wallet"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;