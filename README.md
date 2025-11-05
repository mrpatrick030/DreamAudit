
---

🌌 DreamAudit — AI-Powered Smart Contract Auditor

DreamAudit is a web application that allows developers to instantly audit Solidity smart contracts using AI and securely store audit metadata on-chain. Designed for simplicity, transparency, and blockchain-native workflows, DreamAudit combines AI insights, IPFS storage, and Ethereum-compatible wallets to streamline smart contract verification.


---

🚀 Features

AI-Powered Auditing: Leverages GPT-4.1 to detect vulnerabilities, inefficiencies, and gas optimizations. Provides clear, human-readable summaries.

Smart Security Checks: Detects reentrancy, overflow, access control, and other common smart contract flaws.

Blockchain Native: Connect your wallet to save audit metadata on-chain securely.

IPFS Integration: Full audit reports are stored on IPFS via Filebase for permanent, decentralized access.

Dynamic Stats: Tracks total audits conducted without requiring wallet connection on the landing page.

Responsive UI: Modern, purple-themed interface with Framer Motion animations and syntax-highlighted reports using Prism.



---

🛠️ How It Works

1. Provide Input: Paste Solidity code or enter a verified contract address.


2. Run AI Audit: GPT-4.1 scans the contract for vulnerabilities and provides a summarized report.


3. View Full Report: Optionally view the full audit report with syntax highlighting.


4. Save On-Chain: Connect your wallet to store audit metadata on the blockchain.




---

💻 Usage

1. Clone the repository:

git clone 
cd dreamaudit


2. Install dependencies:

npm install


3. Configure environment variables in .env:

OPENAI_API_KEY=openai_api_key
SOMNIA_RPC_URL=https://shannon-explorer.somnia.network
SYSTEM_PRIVATE_KEY=system_wallet_private_key
FILEBASE_ACCESS_KEY_ID=filebase_key
FILEBASE_SECRET_ACCESS_KEY=filebase_secret


4. Start the development server:

npm run dev


5. Open http://localhost:3000 in your browser.




---

🧩 Tech Stack

Frontend: Next.js, React, Tailwind CSS, Framer Motion, Lucide React Icons

Blockchain: EVM-compatible smart contract interaction using ethers.js

AI: OpenAI GPT-4.1 for auditing and summarization

Storage: IPFS via Filebase for full report persistence

Wallet Integration: Ethereum-compatible wallets (MetaMask)



---

📝 Contract Metadata

Smart Contract Address: <DreamAudit deployed contract>

ABI: Located at /lib/contract.js

Functionality:

storeAudit(bytes32 auditId, string reportURI) — Save audit metadata on-chain

totalAuditCount() — Returns total audits performed




---

🎨 UI & UX

Landing page displays total audits dynamically.

Full audit report is shown in a two-column layout, with syntax highlighting.

Purple-themed UI with smooth animations enhances readability and interactivity.



---

⚡ Submission Notes

AI auditing uses GPT-4.1.

Full reports are permanently stored on IPFS and accessible via URL.

Wallet connection is required only for saving metadata; viewing summary and full report does not require wallet access.



---

🔗 Links

Live Demo: <dream-audit.vercel.app>

GitHub Repository: <https://github.com/mrpatrick030/DreamAudit>



---
