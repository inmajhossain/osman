"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Invoice() {
  const { id } = useParams();

  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/invoice/${id}`)
      .then(res => res.json())
      .then(setInvoice);
  }, []);

  const print = () => window.print();

  if (!invoice) return <p>Loading...</p>;

  return (
    <div className="bg-white mx-auto p-10 max-w-4xl">
      <div className="print:hidden flex justify-between mb-6">
        <h1 className="font-bold text-2xl">Invoice</h1>

        <button
          onClick={print}
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          Print
        </button>
      </div>

      <div className="mb-8">
        <h2 className="font-bold text-xl">My Company Ltd</h2>

        <p>Dhaka Bangladesh</p>
      </div>

      <div className="grid grid-cols-2 mb-6">
        <div>
          <p>
            <b>Invoice No:</b> {invoice._id}
          </p>
          <p>
            <b>Date:</b> {new Date(invoice.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="text-right">
          <p>
            <b>Customer:</b> {invoice.customerName}
          </p>
        </div>
      </div>

      <table className="border w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>VAT</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {invoice.items.map((i: any, index: number) => (
            <tr key={index} className="border text-center">
              <td>{i.productName}</td>
              <td>{i.quantity}</td>
              <td>{i.unitPrice}</td>
              <td>{i.vatAmount}</td>
              <td>{i.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 text-right">
        <p>Subtotal: {invoice.subtotal}</p>
        <p>VAT: {invoice.vatTotal}</p>

        <p className="font-bold text-2xl">Total: {invoice.grandTotal}</p>
      </div>

      <div className="mt-10 text-sm text-center">
        Thank you for your business
      </div>
    </div>
  );
}
