import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/config";
import { useWeb3 } from "../context/Web3Context";
import { ShieldCheck, Clock, FileText, XCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Admin() {
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [processingId, setProcessingId] = useState(null); // Tracks which specific doc is loading

  const { account } = useWeb3();

  useEffect(() => {
    fetchPendingList();
  }, []);

  const fetchPendingList = async () => {
    setLoadingList(true);
    try {
      const response = await fetch("http://localhost:5000/api/documents/pending");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      
      const formattedData = data.map(doc => ({
        hash: doc.docHash,
        ipfsHash: doc.ipfsHash,
        uploader: doc.uploader,
        date: new Date(doc.timestamp).toLocaleString()
      }));
      
      setPendingDocuments(formattedData);
    } catch (error) {
      console.error("Error fetching list:", error);
      toast.error("Failed to load pending documents.");
    } finally {
      setLoadingList(false);
    }
  };

  const handleVerify = async (hash) => {
    const toastId = toast.loading("Please sign the verification in MetaMask...");
    setProcessingId(hash);
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Assuming your contract function is called verifyDocument
      const tx = await contract.verifyDocument(hash); 
      
      toast.loading("Waiting for blockchain confirmation...", { id: toastId });
      await tx.wait();

      toast.success("Document Officially Verified on LexChain!", { id: toastId });
      
      // THE BUG FIX: Remove the document from the UI immediately after success
      setPendingDocuments(prev => prev.filter(doc => doc.hash !== hash));
      
    } catch (err) {
      console.error(err);
      toast.error(err.reason || "Verification failed or was canceled.", { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (hash) => {
    // Safety check so the admin doesn't click it by accident
    if (!window.confirm("Are you sure you want to REJECT and permanently delete this document?")) return;

    const toastId = toast.loading("Rejecting document...");
    setProcessingId(hash);

    try {
      const response = await fetch(`http://localhost:5000/api/documents/${hash}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete from server");

      toast.success("Document rejected and removed.", { id: toastId });
      
      // Remove from the UI immediately
      setPendingDocuments(prev => prev.filter(doc => doc.hash !== hash));

    } catch (err) {
      console.error(err);
      toast.error("Failed to reject the document.", { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 w-full max-w-5xl mx-auto px-4">
      <div className="bg-green-100 text-green-600 p-3 rounded-full mb-4">
        <ShieldCheck size={40} />
      </div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Government Admin Portal</h2>
      <p className="text-slate-600 mb-10 text-center">
        Review pending IPFS documents and authorize their cryptographic verification on the blockchain.
      </p>

      <div className="w-full bg-white shadow-sm border border-slate-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-800 border-b pb-4 mb-4 flex items-center gap-2">
          <Clock className="text-slate-400" /> Pending Review Queue
        </h3>

        {loadingList ? (
          <p className="text-center text-slate-500 my-10 animate-pulse">Fetching records from database...</p>
        ) : pendingDocuments.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <ShieldCheck size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No pending documents to verify!</p>
            <p className="text-sm text-slate-400 mt-1">All queues are clear.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingDocuments.map((doc, index) => (
              <div key={index} className="bg-slate-50 p-5 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Clock size={14} /> Pending
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{doc.date}</span>
                  </div>
                  <p className="text-sm font-mono text-slate-600 truncate mb-1" title={doc.hash}>
                    <span className="font-semibold text-slate-800">Hash:</span> {doc.hash}
                  </p>
                  <p className="text-xs text-slate-500 truncate" title={doc.uploader}>
                    <span className="font-semibold text-slate-600">Uploader:</span> {doc.uploader}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a 
                    href={`https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded transition"
                  >
                    <FileText size={16} /> Review File
                  </a>
                  
                  {/* Approve Button */}
                  <button
                    onClick={() => handleVerify(doc.hash)}
                    disabled={processingId !== null}
                    className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-6 rounded shadow-sm transition disabled:bg-slate-400 w-full sm:w-auto"
                  >
                    {processingId === doc.hash ? "Processing..." : "Approve"}
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => handleReject(doc.hash)}
                    disabled={processingId !== null}
                    className="flex items-center justify-center p-2 text-red-500 hover:text-white hover:bg-red-500 rounded transition border border-transparent hover:border-red-600 disabled:opacity-50"
                    title="Reject Document"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}