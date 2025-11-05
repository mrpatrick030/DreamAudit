"use client";

import { useState, useEffect } from "react";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, Contract, ethers } from "ethers";
import { DreamAuditABI, DREAM_AUDIT_ADDRESS } from "@/lib/dreamAudit";

export default function AuditInterface({ pushToast }) {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  const [contract, setContract] = useState(null);
  const [code, setCode] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [auditURI, setAuditURI] = useState("");
  const [fee, setFee] = useState(null);

  // === Init Contract + Fetch Fee ===
  useEffect(() => {
    if (!walletProvider) return;
    (async () => {
      try {
        const provider = new BrowserProvider(walletProvider);
        const signer = await provider.getSigner();
        const c = new Contract(DREAM_AUDIT_ADDRESS, DreamAuditABI, signer);
        setContract(c);

        const f = await c.fee();
        setFee(f);
        console.log("Audit fee:", ethers.formatEther(f), "ETH");
      } catch (err) {
        console.log("Contract init or fee read error:", err);
      }
    })();
  }, [walletProvider]);

  // === Step 1: Run AI Audit ===
  const handleAudit = async () => {
    setLoading(true);
    setAuditResult(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code || null,
          contractAddress: contractAddress || null,
          userAddress: address || null,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAuditResult(data.summary);
      setAuditURI(data.ipfs);
      pushToast("Audit completed successfully!", "success");
    } catch (err) {
      console.error("Audit error:", err);
      pushToast(err.message || "Audit failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // === Step 2: Save Audit Onchain ===
  const saveOnchain = async () => {
    if (!contract || !isConnected)
      return pushToast("Connect your wallet first", "error");

    try {
      const tx = await contract.storeAudit(
        ethers.id(contractAddress || code),
        auditURI,
        { value: fee }
      );
      await tx.wait();
      pushToast("Audit saved onchain successfully!", "success");
    } catch (err) {
      console.error("Save onchain error:", err);
      pushToast("Transaction failed", "error");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">DreamAudit — Smart Contract Auditor</h2>

      <textarea
        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800"
        rows={6}
        placeholder="Paste your smart contract code here (optional)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800"
        placeholder="Or enter contract address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      />

      <button
        onClick={handleAudit}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Auditing..." : "Run AI Audit"}
      </button>

      {auditResult && (
        <div className="mt-4 p-3 border rounded bg-gray-50 dark:bg-gray-800">
          <h3 className="font-semibold">AI Summary:</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-line">
            {auditResult}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            <a
              href={auditURI}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Full Report
            </a>

            <button
              onClick={saveOnchain}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Onchain ({fee ? `${ethers.formatEther(fee)} ETH` : "Loading fee..."})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}