// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DreamAudit {
    struct Audit {
        bytes32 contractHash;
        string auditResult; // URI or empty string if system wallet
        address auditor;
        uint256 timestamp;
    }

    struct AuditSummary {
        bytes32 contractHash;
        address auditor;
        uint256 timestamp;
    }

    address public systemWallet;
    address public treasury;
    uint256 public fee; // in native token (STT)
    
    Audit[] public totalAudits;

    mapping(address => Audit[]) private userAudits;

    // Events
    event AuditStored(bytes32 indexed contractHash, address indexed auditor, uint256 timestamp, bool paid);
    event AuditMetadataStored(bytes32 indexed contractHash, address indexed user, string auditURI, uint256 timestamp);
    event FeeUpdated(uint256 newFee);
    event TreasuryUpdated(address newTreasury);
    event SystemWalletUpdated(address newSystemWallet);

    constructor(address _systemWallet, address _treasury, uint256 _fee) {
        require(_systemWallet != address(0), "System wallet cannot be zero");
        require(_treasury != address(0), "Treasury cannot be zero");
        systemWallet = _systemWallet;
        treasury = _treasury;
        fee = _fee;
    }

    modifier checkFee() {
        if (msg.sender != systemWallet) {
            require(msg.value >= fee, "Insufficient fee sent");
            (bool sent, ) = treasury.call{value: msg.value}("");
            require(sent, "Failed to transfer fee to treasury");
        }
        _;
    }

    function storeAudit(bytes32 contractHash, string calldata auditResult) external payable checkFee returns (bool) {
        // System wallet stores empty result, users store full URI
        string memory finalAuditResult = msg.sender == systemWallet ? "" : auditResult;

        Audit memory newAudit = Audit({
            contractHash: contractHash,
            auditResult: finalAuditResult,
            auditor: msg.sender,
            timestamp: block.timestamp
        });

        totalAudits.push(newAudit);

        if (msg.sender != systemWallet) {
            userAudits[msg.sender].push(newAudit);
            emit AuditMetadataStored(contractHash, msg.sender, auditResult, block.timestamp);
        }

        emit AuditStored(contractHash, msg.sender, block.timestamp, msg.sender != systemWallet);
        return true;
    }

    function totalAuditCount() external view returns (uint256) {
        return totalAudits.length;
    }

    function userAuditCount(address user) external view returns (uint256) {
        return userAudits[user].length;
    }

    function getUserAudits(address user) external view returns (Audit[] memory) {
        return userAudits[user];
    }

    // ✅ Summaries (public view)
    function getAllAuditSummaries() external view returns (AuditSummary[] memory) {
        uint256 count = totalAudits.length;
        AuditSummary[] memory summaries = new AuditSummary[](count);

        for (uint256 i = 0; i < count; i++) {
            summaries[i] = AuditSummary({
                contractHash: totalAudits[i].contractHash,
                auditor: totalAudits[i].auditor,
                timestamp: totalAudits[i].timestamp
            });
        }

        return summaries;
    }

    // ✅ Only the user or system wallet can view a specific audit by index
    function getUserAuditByIndex(address user, uint256 index) external view returns (Audit memory) {
        require(
            msg.sender == user || msg.sender == systemWallet,
            "Not authorized to view this user's audits"
        );
        require(index < userAudits[user].length, "Invalid index");
        return userAudits[user][index];
    }

    // ✅ Only the auditor or system wallet can view full audit by hash
    function getAuditByContractHash(bytes32 hash) external view returns (Audit memory) {
        for (uint256 i = 0; i < totalAudits.length; i++) {
            if (totalAudits[i].contractHash == hash) {
                require(
                    msg.sender == totalAudits[i].auditor || msg.sender == systemWallet,
                    "Not authorized to view this audit"
                );
                return totalAudits[i];
            }
        }
        revert("Audit not found");
    }

    // Admin-specific functions
    function updateFee(uint256 newFee) external {
        require(msg.sender == systemWallet, "Only system wallet can update fee");
        fee = newFee;
        emit FeeUpdated(newFee);
    }

    function updateTreasury(address newTreasury) external {
        require(msg.sender == systemWallet, "Only system wallet can update treasury");
        require(newTreasury != address(0), "Treasury cannot be zero");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function updateSystemWallet(address newSystemWallet) external {
        require(msg.sender == systemWallet, "Only system wallet can update system wallet");
        require(newSystemWallet != address(0), "System wallet cannot be zero");
        systemWallet = newSystemWallet;
        emit SystemWalletUpdated(newSystemWallet);
    }

    receive() external payable {}
    fallback() external payable {}
}