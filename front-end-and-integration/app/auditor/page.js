"use client";

import { useState } from "react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Contract, ethers } from "ethers";
import { FileText, ArrowUpRight } from "lucide-react";
import { DREAMAUDIT_ABI, DREAMAUDIT_ADDRESS } from "@/lib/contract";

export default function AuditPage({ pushToast }) {
  const { address, isConnected, disconnect } = useAppKitAccount();
  const { connect, walletProvider } = useAppKitProvider("eip155");

  const [code, setCode] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [summary, setSummary] = useState("");
  const [fullReportURI, setFullReportURI] = useState("");
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [savingOnChain, setSavingOnChain] = useState(false);

  const handleAudit = async () => {
    if (!code && !contractAddress) {
      pushToast("Please provide code or a contract address");
      return;
    }
    setLoadingAudit(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, contractAddress, userAddress: address }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSummary(data.summary || data.ipfs?.slice(0, 256) || "No summary returned");
      setFullReportURI(data.ipfs || "");
    } catch (err) {
      console.error("Audit error:", err);
      pushToast("Audit failed: " + (err.message || "Unknown error"));
    }
    setLoadingAudit(false);
  };

  const handleWalletConnect = async () => {
    try {
      await connect();
      pushToast("Wallet connected ✅");
    } catch (err) {
      console.error("Connect wallet error:", err);
      pushToast("Failed to connect wallet");
    }
  };

  const handleSaveOnChain = async () => {
    if (!fullReportURI) {
      pushToast("No report to save on-chain");
      return;
    }
    if (!isConnected || !walletProvider) {
      pushToast("Connect your wallet to save audit on-chain");
      return;
    }

    setSavingOnChain(true);
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contract = new Contract(DREAMAUDIT_ADDRESS, DREAMAUDIT_ABI, signer);

      const tx = await contract.storeAudit(
        ethers.utils.id(contractAddress || code),
        fullReportURI
      );
      await tx.wait();
      pushToast("Audit metadata saved on-chain ✅");

      // Reset for next audit
      setCode("");
      setContractAddress("");
      setSummary("");
      setFullReportURI("");
    } catch (err) {
      console.error("Save on-chain error:", err);
      pushToast("Failed to save on-chain: " + (err.message || "Unknown error"));
    }
    setSavingOnChain(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">AI Contract Auditor</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Inputs */}
        <textarea
          placeholder="Paste Solidity code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-800 text-white h-40 resize-none"
        />
        <input
          type="text"
          placeholder="Or input contract address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-800 text-white"
        />

        <button
          onClick={handleAudit}
          disabled={loadingAudit}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition"
        >
          {loadingAudit ? "Auditing..." : "Run AI Audit"}
        </button>

        {/* Summary Display */}
        {summary && (
          <div className="p-4 bg-gray-800 rounded-2xl shadow-md space-y-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText /> Audit Summary
            </h2>
            <p>{summary}</p>
            {fullReportURI && (
              <a
                href={fullReportURI}
                target="_blank"
                className="flex items-center gap-1 text-purple-400 hover:underline"
              >
                <ArrowUpRight /> View Full Report
              </a>
            )}

            {/* Custom Connect / Save Button */}
            {!isConnected ? (
              <button
                onClick={handleWalletConnect}
                className="mt-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold shadow-lg animate-pulse transition"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={handleSaveOnChain}
                disabled={savingOnChain}
                className="mt-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold shadow-lg transition"
              >
                {savingOnChain ? "Saving..." : "Save Metadata On-Chain"}
              </button>
            )}

            {/* Optional disconnect */}
            {isConnected && (
              <button
                onClick={disconnect}
                className="mt-2 py-1 px-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm transition"
              >
                Disconnect Wallet
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}