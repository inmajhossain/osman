"use client";

import { useState } from "react";

export default function SalesReport() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [data, setData] = useState<any[]>([]);

  const search = async () => {
    const res = await fetch("/api/reports/sales", {
      method: "POST",
      body: JSON.stringify({
        startDate: start,
        endDate: end,
      }),
    });

    const result = await res.json();

    setData(result);
  };

  return (
    <div className="p-10">
      <h1 className="mb-4 font-bold text-2xl">Sales Report</h1>

      <div className="flex gap-3 mb-5">
        <input
          type="date"
          onChange={e => setStart(e.target.value)}
          className="p-2 border"
        />

        <input
          type="date"
          onChange={e => setEnd(e.target.value)}
          className="p-2 border"
        />

        <button onClick={search} className="bg-blue-600 px-4 text-white">
          Search
        </button>
      </div>

      <table className="border w-full">
        <thead className="bg-gray-200">
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>VAT</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {data.map((s: any, i) => (
            <tr key={i} className="border text-center">
              <td>{s.productName}</td>
              <td>{s.quantity}</td>
              <td>{s.unitPrice}</td>
              <td>{s.vatAmount}</td>
              <td>{s.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
