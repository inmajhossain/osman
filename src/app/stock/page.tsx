"use client";

import { useEffect, useState } from "react";

export default function Stock() {
  const [stock, setStock] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/stock")
      .then(res => res.json())
      .then(data => setStock(data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="mb-5 font-bold text-2xl">Current Stock</h1>

      <table className="border w-full">
        <thead className="">
          <tr>
            <th>Product</th>
            <th>Purchased</th>
            <th>Sold</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {stock.map((s: any, i) => (
            <tr key={i} className="border text-center">
              <td>{s.product}</td>
              <td>{s.purchased}</td>
              <td>{s.sold}</td>
              <td>{s.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
