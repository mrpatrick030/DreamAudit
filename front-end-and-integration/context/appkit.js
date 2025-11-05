"use client";

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, somnia } from "@reown/appkit/networks";

// 1. Get projectId at https://dashboard.reown.com
const projectId = "412e456b43a4f3d99609ac9f620ecfd3";

// 2. Create a metadata object
const metadata = {
  name: 'DreamAudit',
  description: 'AI-Powered Smart Contract Auditor on Somnia',
  url: 'https://dreamaudit.vercel.app',
  icons: ['https://supposed-emerald-snake.myfilebase.com/ipfs/QmSLjiFWyvXTfExpYBXohvH7h7AEDrZuR38Qs5yEFPTEGS']
}

// 3. Create the AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: [mainnet, somnia],
  projectId,
  features: {
    analytics: true,
  },
  themeMode: "dark",
      themeVariables: {
    "--w3m-accent":"#fff",
    "--w3m-font-family":"sans-serif",
    "--w3m-z-index": 9999,
    "--w3m-color-mix": "#234",
    "--w3m-color-mix-strength": 20,
    "--w3m-border-radius-master": "10px"
  },
    chainImages: {
    50312: 'https://supposed-emerald-snake.myfilebase.com/ipfs/QmXKuMKLnxnXhHqmiRBEx9Yu6eG6Mj7G1dxHFu7MVXufAL'
  }
});

export function AppKit({children}) {
  return (
    children
  );
}