import { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function MyUploads() {
  const { account } = useWeb3();
  const [myDocuments, setMyDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (account) {
      fetchMyDocuments();
    } else {
      setLoading(false);
      setMyDocuments([]);
    }
  }, [account]);

  const fetchMyDocuments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:5000/api/documents/user/${account}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch from server");
      }
      
      const data = await response.json();
      setMyDocuments(data);
    } catch (err) {
      console.error(err);
      setError("Could not load your documents. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center mt-20 px-4">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Wallet Not Connected</h2>
        <p className="text-slate-600 mt-2 text-center">Please connect your MetaMask wallet to view your upload history.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-10 w-full max-w-4xl mx-auto px-4">
      <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mb-4">
        <FileText size={40} />
      </div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">My Uploads</h2>
      <p className="text-slate-600 mb-8 text-center">
        Track the verification status of your secured documents.
      </p>

      {error && (
        <div className="w-full bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      <div className="w-full bg-white shadow-sm border border-slate-200 rounded-xl p-6">
        {loading ? (
          <p className="text-center text-slate-500 my-10">Loading your history...</p>
        ) : myDocuments.length === 0 ? (
          <p className="text-center text-slate-500 my-10">You haven't uploaded any documents yet.</p>
        ) : (
          <div className="space-y-4">
            {myDocuments.map((doc, index) => (
              <div key={index} className="bg-slate-50 p-5 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-3 mb-2">
                    {doc.isVerified ? (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={14} /> Verified
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Clock size={14} /> Pending Review
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(doc.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-mono text-slate-600 truncate" title={doc.docHash}>
                    <span className="font-semibold text-slate-800">Hash:</span> {doc.docHash}
                  </p>
                </div>

                <a 
                  href={`https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-sm font-medium py-2 px-4 rounded transition text-center whitespace-nowrap"
                >
                  View File ↗
                </a>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}