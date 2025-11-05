"use client";

import { useState } from "react";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";

export default function ConnectWalletButton({ onConnect }) {
  const { address, isConnected, disconnect } = useAppKitAccount();
  const { connectWallet } = useAppKitProvider("eip155");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connectWallet(); // prompts wallet connection
      if (onConnect) onConnect();
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
    setLoading(false);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div>
      {!isConnected ? (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-purple-700 rounded-xl font-semibold">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-200"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}