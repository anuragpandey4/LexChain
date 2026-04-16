import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/config";
import { generateFileHash } from "../utils/hash";
import { uploadToIPFS } from "../utils/pinata";
import { UploadCloud, Clock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file first.");

   const toastId = toast.loading("Generating secure hash...");
    setLoading(true);

    try {
      // 1. Generate local SHA-256 hash of the document
      const docHash = await generateFileHash(file);

      // 2. Upload the actual file to IPFS via Pinata
      toast.loading("Uploading encrypted file to IPFS...", { id: toastId });
      const ipfsHash = await uploadToIPFS(file);

      // 3. Connect to MetaMask
      toast.loading("Please sign the transaction in MetaMask...", { id: toastId });
      if (!window.ethereum) throw new Error("Please install MetaMask.");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      // We need the signer because we are WRITING data to the blockchain
      const signer = await provider.getSigner(); 
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // 4. Send transaction to the smart contract
      const tx = await contract.uploadDocument(ipfsHash, docHash, {
        maxPriorityFeePerGas: ethers.parseUnits("30", "gwei"),
        maxFeePerGas: ethers.parseUnits("40", "gwei")
      });
      
      toast.loading("Waiting for blockchain confirmation...", { id: toastId });
      await tx.wait(); // Wait for the transaction to be mined

     toast.success("Document successfully secured on LexChain!", { id: toastId });
     setFile(null);
    } catch (err) {
      console.error(err);
      // Catch duplicate document error from the contract
      if (err.message.includes("Document already exists")) {
         console.error(error);
      toast.error(error.reason || error.message || "Upload failed. Please try again.", { id: toastId });
      } else {
         setError(err.message || "An error occurred during upload.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Upload Document</h2>
      <p className="text-slate-600 mb-8 text-center max-w-md">
        Secure your document on the blockchain. This will generate a unique hash and store the file on decentralized storage.
      </p>

      <form onSubmit={handleUpload} className="w-full max-w-lg">
        <div className="mb-6 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition relative bg-white">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={loading}
          />
          <UploadCloud className="mx-auto text-blue-500 mb-4" size={48} />
          <p className="text-slate-600 font-medium">
            {file ? file.name : "Click or Drag & Drop a file here"}
          </p>
        </div>

        {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4 text-center">{error}</p>}
        
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4 flex items-center justify-center gap-2">
            <CheckCircle size={20} />
            <p className="font-medium">Upload Complete!</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-slate-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <Clock className="animate-spin" size={20} />
              {status}
            </>
          ) : (
            "Secure Document on Blockchain"
          )}
        </button>
      </form>
    </div>
  );
}