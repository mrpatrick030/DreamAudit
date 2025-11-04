"use client";
import Link from "next/link";
import { ShieldCheck, Cpu, Wallet } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          AI Contract Auditor
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
          Secure your smart contracts instantly with AI-powered auditing.  
          Detect vulnerabilities, optimize gas, and follow best practices.
        </p>
        <Link
          href="/audit"
          className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-lg font-semibold shadow-lg transition"
        >
          🚀 Try It Now
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Use AI Contract Auditor?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg text-center">
            <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold mb-2">Smart Security</h3>
            <p className="text-gray-400">
              Detect vulnerabilities like reentrancy, overflow, and access control flaws.
            </p>
          </div>

          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg text-center">
            <Cpu className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <h3 className="text-xl font-semibold mb-2">AI Explanations</h3>
            <p className="text-gray-400">
              Our AI explains issues in simple language, making audits easy to understand.
            </p>
          </div>

          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg text-center">
            <Wallet className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-semibold mb-2">Blockchain Native</h3>
            <p className="text-gray-400">
              Connect your wallet and audit deployed contracts directly from the blockchain.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gray-950">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-start gap-4">
            <span className="text-green-500 text-2xl font-bold">1.</span>
            <p>Paste your Solidity code or input a contract address.</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-green-500 text-2xl font-bold">2.</span>
            <p>Our analyzer scans for vulnerabilities and inefficiencies.</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-green-500 text-2xl font-bold">3.</span>
            <p>AI explains the issues and suggests improvements.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        Built for Somnia Hackathon 2025 ·{" "}
        <a
          href="https://github.com/your-repo"
          target="_blank"
          className="hover:text-green-400"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  );
}
