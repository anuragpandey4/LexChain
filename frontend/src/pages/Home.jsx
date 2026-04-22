import { Link } from "react-router-dom";
import { Shield, FileText, Database, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center mt-12 px-4 animate-fade-in">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mb-16">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-2xl text-4xl font-bold shadow-lg">
            L
          </div>
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Immutable Document Verification on <span className="text-blue-600">LexChain</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
          A Web2.5 hybrid architecture utilizing the Polygon Testnet and IPFS to secure, index, and instantly verify institutional records.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/upload" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition flex items-center justify-center gap-2"
          >
            Secure a Document <ArrowRight size={18} />
          </Link>
          <Link 
            to="/verify" 
            className="bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 font-semibold py-3 px-8 rounded-lg shadow-sm transition flex items-center justify-center"
          >
            Public Verification Portal
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
        
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center hover:shadow-md transition">
          <div className="mx-auto bg-blue-50 text-blue-600 w-14 h-14 flex items-center justify-center rounded-full mb-6">
            <Shield size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Decentralized Trust</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Documents are anchored to the Polygon Amoy blockchain, ensuring mathematical proof of existence and absolute immutability.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center hover:shadow-md transition">
          <div className="mx-auto bg-purple-50 text-purple-600 w-14 h-14 flex items-center justify-center rounded-full mb-6">
            <Database size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Web2.5 Indexer</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            A custom Node.js stateless indexer caches events into MongoDB Atlas to completely bypass Web3 RPC rate limits.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center hover:shadow-md transition">
          <div className="mx-auto bg-green-50 text-green-600 w-14 h-14 flex items-center justify-center rounded-full mb-6">
            <FileText size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">IPFS Storage</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Files are stored off-chain via Pinata, preventing astronomical gas fees while maintaining network decentralization.
          </p>
        </div>

      </div>
    </div>
  );
}