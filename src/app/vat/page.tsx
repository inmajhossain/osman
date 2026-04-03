"use client";

import { useEffect, useState } from "react";

export default function VAT() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/vat")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="gap-6 grid grid-cols-3 p-10">
      <div className="bg-white shadow p-6">
        <h2 className="text-xl">Input VAT</h2>
        <p className="text-3xl">{data.inputVAT}</p>
      </div>

      <div className="bg-white shadow p-6">
        <h2 className="text-xl">Output VAT</h2>
        <p className="text-3xl">{data.outputVAT}</p>
      </div>

      <div className="bg-white shadow p-6">
        <h2 className="text-xl">VAT Due</h2>
        <p className="text-red-600 text-3xl">{data.vatDue}</p>
      </div>
    </div>
  );
}
