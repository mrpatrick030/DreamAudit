"use client";

import { useState, useRef, useEffect } from "react";
import { ethers, Contract } from "ethers";
import { Highlight, themes } from "prism-react-renderer";
import { motion } from "framer-motion";
import { FileText, Eye } from "lucide-react";
import { DREAMAUDIT_ABI, DREAMAUDIT_ADDRESS } from "@/lib/contract";

export default function AuditPage({ pushToast }) {
  const [code, setCode] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [summary, setSummary] = useState("");
  const [fullReportURI, setFullReportURI] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);

  const fullReportRef = useRef();

  // Fetch full report content from Filebase URL
  useEffect(() => {
    if (!fullReportURI) return;

    const fetchMetadata = async () => {
      try {
        const res = await fetch(fullReportURI);
        const data = await res.text(); // plain text file
        setMetadata(data);
      } catch (err) {
        console.error("Failed to fetch audit metadata:", err);
        setMetadata(null);
      }
    };

    fetchMetadata();
  }, [fullReportURI]);

  const handleAudit = async () => {
    if (!code && !contractAddress) {
      pushToast("Please provide code or a contract address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, contractAddress }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSummary(data.summary);
      setFullReportURI(data.fullReportIPFS || "");
      setShowFullReport(false); // reset view
    } catch (err) {
      console.error(err);
      pushToast("Audit failed: " + (err.message || "Unknown error"));
    }
    setLoading(false);
  };

  const handleSaveOnChain = async () => {
    if (!metadata) {
      pushToast("No full report to save on-chain");
      return;
    }
    try {
      setSaving(true);
      if (!window.ethereum) throw new Error("Wallet not detected");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletConnected(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new Contract(DREAMAUDIT_ADDRESS, DREAMAUDIT_ABI, signer);

      const tx = await contract.storeAudit(
        ethers.utils.id(contractAddress || code),
        fullReportURI
      );
      await tx.wait();
      pushToast("Audit metadata saved on-chain ✅");
    } catch (err) {
      console.error(err);
      pushToast("Failed to save on-chain: " + (err.message || "Unknown error"));
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-purple-400">
        AI Contract Auditor
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
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
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition"
          >
            {loading ? "Auditing..." : "Run AI Audit"}
          </button>

          {summary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="p-4 bg-gray-800 rounded-2xl shadow-md space-y-2"
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText /> Audit Summary
              </h2>
              <p>{summary}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFullReport((prev) => !prev)}
                  className="flex items-center gap-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition"
                >
                  <Eye className="w-4 h-4" />
                  {showFullReport ? "Hide Full Report" : "View Full Report"}
                </button>

                <button
                  onClick={handleSaveOnChain}
                  disabled={saving}
                  className={`py-2 px-4 rounded-xl font-semibold transition ${
                    walletConnected
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {saving
                    ? "Saving..."
                    : walletConnected
                    ? "Save On-Chain"
                    : "Connect Wallet & Save"}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column */}
        <div className="p-4 bg-gray-800 rounded-2xl h-full overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">
            Full Audit Report
          </h2>
          <div ref={fullReportRef}>
            {showFullReport ? (
              metadata ? (
                <Highlight code={metadata} language="solidity" theme={themes.dracula}>
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                      className={className}
                      style={{ ...style, padding: "1rem", borderRadius: "1rem" }}
                    >
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line, key: i })}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token, key })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              ) : (
                <p className="text-gray-400 italic">Loading full report...</p>
              )
            ) : (
              <p className="text-gray-400 italic">Click View Full Report to see details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}