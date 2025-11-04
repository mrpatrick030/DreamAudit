import { useState } from "react";

export default function AuditForm({ onAudit, loading }) {
  const [contractCode, setContractCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contractCode.trim() === "") return alert("Please paste contract code");
    onAudit(contractCode);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl bg-gray-800 p-6 rounded-2xl shadow-md"
    >
      <textarea
        rows="10"
        className="w-full p-3 bg-gray-900 rounded-lg text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Paste your Solidity contract code here..."
        value={contractCode}
        onChange={(e) => setContractCode(e.target.value)}
      ></textarea>

      <button
        type="submit"
        disabled={loading}
        className={`mt-4 w-full py-3 rounded-lg font-semibold transition 
          ${loading ? "bg-green-700 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
      >
        {loading ? "Auditing..." : "Run AI Audit"}
      </button>
    </form>
  );
}