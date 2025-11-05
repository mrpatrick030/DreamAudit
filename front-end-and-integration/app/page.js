"use client";

import Link from "next/link";
import { ShieldCheck, Cpu, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { DREAMAUDIT_ABI, DREAMAUDIT_ADDRESS } from "@/lib/contract";

export default function LandingPage() {
  const [totalAudits, setTotalAudits] = useState(0);
  const [animatedAudits, setAnimatedAudits] = useState(0);

  // Fetch total audits from DreamAudit contract
  useEffect(() => {
    async function fetchTotalAudits() {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.SOMNIA_RPC_URL);
        const contract = new ethers.Contract(DREAMAUDIT_ADDRESS, DREAMAUDIT_ABI, provider);
        const count = await contract.totalAuditCount();
        setTotalAudits(Number(count));
      } catch (err) {
        console.log("Error fetching total audits:", err);
      }
    }
    fetchTotalAudits();
  }, []);

  // Animate counter
  useEffect(() => {
    let start = 0;
    const end = totalAudits;
    if (end === 0) return;
    const duration = 1500; // ms
    const increment = Math.ceil(end / (duration / 30));
    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setAnimatedAudits(start);
    }, 30);
  }, [totalAudits]);

  const featureCards = [
    {
      icon: <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-green-500" />,
      title: "Smart Security",
      description: "Detect vulnerabilities like reentrancy, overflow, and access control flaws.",
    },
    {
      icon: <Cpu className="w-12 h-12 mx-auto mb-4 text-blue-400" />,
      title: "AI Explanations",
      description: "Our AI integration (GPT-4.1 mini) explains issues in simple language, making audits easy to understand.",
    },
    {
      icon: <Wallet className="w-12 h-12 mx-auto mb-4 text-purple-400" />,
      title: "Blockchain Native",
      description: "Connect your wallet and save audited contract's metadata directly on the blockchain and store full report on IPFS for decentralization.",
    },
  ];

  const steps = [
    "Paste your Solidity code or input a contract address.",
    "Our analyzer scans for vulnerabilities and inefficiencies.",
    "AI explains the issues and suggests improvements.",
    "Optionally save audit report to the blockchain."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      
      {/* Logo Section */}
      <div className="flex items-center justify-center py-6">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 10px rgba(128, 0, 255, 0.6)",
              "0 0 20px rgba(128, 0, 255, 0.9)",
              "0 0 10px rgba(128, 0, 255, 0.6)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="flex items-center gap-3 p-4 rounded-full bg-[#1a002a]"
        >
          <ShieldCheck className="w-10 h-10 text-purple-400" />
          <h1 className="text-3xl font-bold text-purple-400">DreamAudit</h1>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold mb-6 text-purple-300"
        >
          AI Contract Auditor
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mb-4"
        >
          Secure your smart contracts instantly with AI-powered auditing.  
          Detect vulnerabilities, optimize gas, and follow best practices.
        </motion.p>

        {/* Dynamic Animated Total Audits */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-green-400 font-semibold mb-6 text-lg md:text-xl"
        >
          Total Audits Performed: {animatedAudits}
        </motion.p>

        <Link
          href="/auditor"
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-lg font-semibold shadow-lg transition"
        >
          🚀 Try It Now
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-purple-300">
          Why Use DreamAudit?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featureCards.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="p-6 bg-gray-800 rounded-2xl shadow-lg text-center"
            >
              {f.icon}
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gray-950">
        <h2 className="text-3xl font-bold text-center mb-12 text-purple-300">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="flex items-start gap-4"
            >
              <span className="text-green-500 text-2xl font-bold">{idx + 1}.</span>
              <p>{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        Copyright &copy; DreamAudit, 2025 ·{" "}
        <a href="#" target="_blank" className="hover:text-purple-400">
          View Documentation
        </a>
      </footer>
    </div>
  );
}