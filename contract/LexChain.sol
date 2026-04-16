// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LexChain {
    
    struct Document {
        uint256 id;
        string ipfsHash;      // The link to the file on IPFS
        string docHash;       // The SHA-256 hash of the file content (for verification)
        address uploader;
        address verifier;
        uint256 timestamp;
        bool isVerified;
    }

    // Mapping to store documents by their unique content hash
    mapping(string => Document) public documents; 
    // To keep track of IDs
    uint256 public docCount = 0;
    
    // The Government/Agency address
    address public admin;

    event DocumentUploaded(uint256 id, string docHash, address uploader);
    event DocumentVerified(uint256 id, string docHash, address verifier);

    constructor() {
        admin = msg.sender; // The deployer is the initial Admin
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the Government Agency can verify documents");
        _;
    }

    // 1. USER: Uploads document metadata
    function uploadDocument(string memory _ipfsHash, string memory _docHash) public {
        require(bytes(documents[_docHash].docHash).length == 0, "Document already exists");

        docCount++;
        documents[_docHash] = Document(
            docCount,
            _ipfsHash,
            _docHash,
            msg.sender,
            address(0), // No verifier yet
            block.timestamp,
            false // Not verified yet
        );

        emit DocumentUploaded(docCount, _docHash, msg.sender);
    }

    // 2. ADMIN: Verifies the document
    function verifyDocument(string memory _docHash) public onlyAdmin {
        require(bytes(documents[_docHash].docHash).length != 0, "Document does not exist");
        require(!documents[_docHash].isVerified, "Document already verified");

        documents[_docHash].isVerified = true;
        documents[_docHash].verifier = msg.sender;

        emit DocumentVerified(documents[_docHash].id, _docHash, msg.sender);
    }

    // 3. PUBLIC: Checks if a document is valid (View function)
    function verify(string memory _docHash) public view returns (bool, string memory, uint256) {
        if (bytes(documents[_docHash].docHash).length == 0) {
            return (false, "", 0);
        }
        return (
            documents[_docHash].isVerified, 
            documents[_docHash].ipfsHash, 
            documents[_docHash].timestamp
        );
    }
}