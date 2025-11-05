"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function PurpleWalletButton({ onConnect, onDisconnect }) {
  const [account, setAccount] = useState(null);
  const [connecting, setConnecting] = useState(false);

  // Check if wallet is already connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts.length > 0) setAccount(accounts[0]);
        })
        .catch(console.error);
    }
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert("No Ethereum wallet found!");
    try {
      setConnecting(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      onConnect && onConnect(accounts[0]);
    } catch (err) {
      console.error("Wallet connection error:", err);
      alert("Connection failed: " + (err.message || "Unknown error"));
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect wallet (simply clears local state)
  const disconnectWallet = () => {
    setAccount(null);
    onDisconnect && onDisconnect();
  };

  return (
    <button
      onClick={account ? disconnectWallet : connectWallet}
      className={`px-6 py-3 rounded-xl font-semibold text-white transition
        ${account ? "bg-purple-700 hover:bg-purple-800" : "bg-purple-600 hover:bg-purple-700"}
        ${connecting ? "opacity-70 cursor-wait" : "cursor-pointer"}
      `}
      disabled={connecting}
    >
      {connecting
        ? "Connecting..."
        : account
        ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
        : "Connect Wallet"}
    </button>
  );
}