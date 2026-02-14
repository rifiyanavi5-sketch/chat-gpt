"use client";

import { useRef, useState } from "react";

export default function OperatorPage() {
  const [warehouseCode, setWarehouseCode] = useState("");
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const lockRef = useRef(false);

  async function submitScan() {
    if (lockRef.current) return;
    lockRef.current = true;
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/operator/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode, warehouseCode, quantity })
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error ?? "Failed to process scan");
      } else {
        setMessage(`OK. Qty now: ${data.stock.quantity}`);
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        lockRef.current = false;
      }, 700);
    }
  }

  return (
    <section className="space-y-3 rounded-xl border bg-white p-4 dark:bg-slate-900">
      <h1 className="text-xl font-semibold">Operator Scan-Only Workflow</h1>
      <p className="text-sm">No manual variant selection is allowed. Scan barcode / QR only.</p>
      <input
        className="w-full rounded-lg border px-3 py-2"
        placeholder="Warehouse code"
        value={warehouseCode}
        onChange={(e) => setWarehouseCode(e.target.value)}
      />
      <input
        className="w-full rounded-lg border px-3 py-2"
        placeholder="Scan barcode or QR"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
      />
      <input
        className="w-full rounded-lg border px-3 py-2"
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value) || 1)}
      />
      <button onClick={submitScan} disabled={loading} className="rounded-lg bg-indigo-600 px-4 py-2 text-white">
        {loading ? "Processing..." : "Submit Scan"}
      </button>
      {message ? <p className="text-sm">{message}</p> : null}
    </section>
  );
}
