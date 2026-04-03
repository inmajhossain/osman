//@ts-nocheck
"use client";

import { useEffect, useState } from "react";

interface Purchase {
  _id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  date: string;
}

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [vatRate, setVatRate] = useState("7.5");
  const [vatAmount, setVatAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate vat amount and total
  useEffect(() => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(unitPrice) || 0;
    const vat = parseFloat(vatRate) || 0;

    const subtotal = qty * price;
    const vatAmt = (subtotal * vat) / 100;
    const totalAmt = subtotal + vatAmt;

    setVatAmount(vatAmt);
    setTotal(totalAmt);
  }, [quantity, unitPrice, vatRate]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const url = filterDate
        ? `/api/purchases?date=${filterDate}`
        : "/api/purchases";

      console.log("Loading purchases from:", url);
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Loaded purchases:", data);
      setPurchases(data);
    } catch (error) {
      console.error("Load error:", error);
      setError("Failed to load purchases: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filterDate]);

  const addPurchase = async () => {
    console.log("Add purchase button clicked");

    if (!productName || !quantity || !unitPrice) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const purchaseData = {
        productName: productName.trim(),
        quantity: parseFloat(quantity),
        unitPrice: parseFloat(unitPrice),
        vatRate: parseFloat(vatRate),
        vatAmount,
        total,
      };

      console.log("Sending purchase data:", purchaseData);

      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });

      console.log("Response status:", res.status);
      const responseData = await res.json();
      console.log("Response data:", responseData);

      if (!res.ok) {
        throw new Error(
          responseData.error || `HTTP error! status: ${res.status}`
        );
      }

      // Reset form
      setProductName("");
      setQuantity("");
      setUnitPrice("");
      setVatRate("7.5");
      setVatAmount(0);
      setTotal(0);

      await load();

      alert("Purchase added successfully!");
    } catch (error) {
      console.error("Add error:", error);
      setError(error.message || "Failed to add purchase");
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePurchase = async (id: string) => {
    console.log("Update function called with ID:", id);

    if (!productName || !quantity || !unitPrice) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const purchaseData = {
        productName: productName.trim(),
        quantity: parseFloat(quantity),
        unitPrice: parseFloat(unitPrice),
        vatRate: parseFloat(vatRate),
        vatAmount,
        total,
      };

      console.log("Sending update request to:", `/api/purchases/${id}`);
      console.log("Update data:", purchaseData);

      const res = await fetch(`/api/purchases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });

      console.log("Response status:", res.status);

      const responseData = await res.json();
      console.log("Response data:", responseData);

      if (!res.ok) {
        throw new Error(
          responseData.error || `HTTP error! status: ${res.status}`
        );
      }

      // Reset form
      setProductName("");
      setQuantity("");
      setUnitPrice("");
      setVatRate("7.5");
      setVatAmount(0);
      setTotal(0);
      setEditingId(null);

      // Reload purchases
      await load();

      alert("Purchase updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      setError(error.message || "Failed to update purchase");
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePurchase = async (id: string) => {
    console.log("Delete function called with ID:", id);

    if (confirm("Are you sure you want to delete this purchase?")) {
      setLoading(true);
      setError("");

      try {
        console.log("Sending delete request to:", `/api/purchases/${id}`);

        const res = await fetch(`/api/purchases/${id}`, {
          method: "DELETE",
        });

        console.log("Response status:", res.status);

        const responseData = await res.json();
        console.log("Response data:", responseData);

        if (!res.ok) {
          throw new Error(
            responseData.error || `HTTP error! status: ${res.status}`
          );
        }

        // Reload purchases
        await load();

        alert("Purchase deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        setError(error.message || "Failed to delete purchase");
        alert("Error: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const editPurchase = (purchase: Purchase) => {
    setEditingId(purchase._id);
    setProductName(purchase.productName);
    setQuantity(purchase.quantity.toString());
    setUnitPrice(purchase.unitPrice.toString());
    setVatRate(purchase.vatRate.toString());
    setVatAmount(purchase.vatAmount);
    setTotal(purchase.total);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setProductName("");
    setQuantity("");
    setUnitPrice("");
    setVatRate("7.5");
    setVatAmount(0);
    setTotal(0);
  };

  const getTotalSummary = () => {
    const totalAmount = purchases.reduce(
      (sum, purchase) => sum + purchase.total,
      0
    );
    const totalVat = purchases.reduce(
      (sum, purchase) => sum + purchase.vatAmount,
      0
    );
    const totalQuantity = purchases.reduce(
      (sum, purchase) => sum + purchase.quantity,
      0
    );
    return { totalAmount, totalVat, totalQuantity };
  };

  const { totalAmount, totalVat, totalQuantity } = getTotalSummary();

  return (
    <div className="p-10">
      <h1 className="mb-4 font-bold text-2xl">Purchase Management</h1>

      {error && (
        <div className="mb-4 p-3 border border-red-400 rounded text-red-700">
          {error}
        </div>
      )}

      {/* Add/Edit Purchase Form */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="mb-3 font-semibold text-lg">
          {editingId ? "Edit Purchase" : "Add New Purchase"}
        </h2>

        <div className="gap-4 grid grid-cols-2">
          <div className="col-span-2">
            <label className="block mb-1 font-medium text-sm">
              Product Name *
            </label>
            <input
              value={productName}
              onChange={e => setProductName(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="Enter product name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Quantity *</label>
            <input
              type="number"
              step="1"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="0"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Unit Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={unitPrice}
              onChange={e => setUnitPrice(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="0.00"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              VAT Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={vatRate}
              onChange={e => setVatRate(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="7.5"
              disabled={loading}
            />
          </div>

          <div className="p-3 rounded">
            <label className="block mb-1 font-medium text-sm">VAT Amount</label>
            <div className="font-bold text-blue-700 text-xl">
              ৳{vatAmount.toFixed(2)}
            </div>
          </div>

          <div className="p-3 rounded">
            <label className="block mb-1 font-medium text-sm">
              Total Amount
            </label>
            <div className="font-bold text-green-700 text-xl">
              ৳{total.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {!editingId ? (
            <button
              onClick={addPurchase}
              disabled={loading || !productName || !quantity || !unitPrice}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 px-4 py-2 rounded text-white"
            >
              {loading ? "Processing..." : "Add Purchase"}
            </button>
          ) : (
            <>
              <button
                onClick={() => updatePurchase(editingId)}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
              >
                Update
              </button>
              <button
                onClick={cancelEdit}
                disabled={loading}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters and Summary */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm">Filter by Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="p-2 border rounded"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-6 bg-gray-100 p-3 rounded-lg">
          <div>
            <span className="text-gray-600 text-sm">Total Quantity:</span>
            <span className="ml-2 font-semibold">{totalQuantity}</span>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Total VAT:</span>
            <span className="ml-2 font-semibold text-blue-600">
              ৳{totalVat.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Total Amount:</span>
            <span className="ml-2 font-semibold text-green-600">
              ৳{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="overflow-x-auto">
        <table className="border w-full">
          <thead className="">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Product Name</th>
              <th className="p-2 text-right">Quantity</th>
              <th className="p-2 text-right">Unit Price</th>
              <th className="p-2 text-right">Subtotal</th>
              <th className="p-2 text-right">VAT Rate</th>
              <th className="p-2 text-right">VAT Amount</th>
              <th className="p-2 text-right">Total</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {purchases.map(purchase => {
              const subtotal = purchase.quantity * purchase.unitPrice;
              return (
                <tr key={purchase._id} className="border">
                  <td className="p-2">
                    {new Date(purchase.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 font-medium">{purchase.productName}</td>
                  <td className="p-2 text-right">{purchase.quantity}</td>
                  <td className="p-2 text-right">
                    ৳{purchase.unitPrice.toFixed(2)}
                  </td>
                  <td className="p-2 text-right">৳{subtotal.toFixed(2)}</td>
                  <td className="p-2 text-right">{purchase.vatRate}%</td>
                  <td className="p-2 text-right">
                    ৳{purchase.vatAmount.toFixed(2)}
                  </td>
                  <td className="p-2 font-semibold text-right">
                    ৳{purchase.total.toFixed(2)}
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => editPurchase(purchase)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePurchase(purchase._id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && purchases.length === 0 && (
          <div className="p-8 text-gray-500 text-center">
            No purchases found. Add your first purchase above.
          </div>
        )}

        {loading && (
          <div className="p-8 text-gray-500 text-center">Loading...</div>
        )}
      </div>
    </div>
  );
}
