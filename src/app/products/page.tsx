"use client";

import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  sku?: string;
  purchasePrice?: number;
  salePrice?: number;
  minStock: number;
  createdAt: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [minStock, setMinStock] = useState("5");
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  const addProduct = async () => {
    const productData = {
      name,
      sku: sku || undefined,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      salePrice: salePrice ? parseFloat(salePrice) : undefined,
      minStock: minStock ? parseInt(minStock) : 5,
    };

    await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });

    // Reset form
    setName("");
    setSku("");
    setPurchasePrice("");
    setSalePrice("");
    setMinStock("5");

    load();
  };

  const updateProduct = async (id: string) => {
    const productData = {
      name,
      sku: sku || undefined,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      salePrice: salePrice ? parseFloat(salePrice) : undefined,
      minStock: minStock ? parseInt(minStock) : 5,
    };

    await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });

    // Reset form and editing state
    setName("");
    setSku("");
    setPurchasePrice("");
    setSalePrice("");
    setMinStock("5");
    setEditingId(null);

    load();
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      load();
    }
  };

  const editProduct = (product: Product) => {
    setEditingId(product._id);
    setName(product.name);
    setSku(product.sku || "");
    setPurchasePrice(product.purchasePrice?.toString() || "");
    setSalePrice(product.salePrice?.toString() || "");
    setMinStock(product.minStock?.toString() || "5");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setSku("");
    setPurchasePrice("");
    setSalePrice("");
    setMinStock("5");
  };

  return (
    <div className="p-10">
      <h1 className="mb-4 font-bold text-2xl">Products Management</h1>

      {/* Add/Edit Product Form */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="mb-3 font-semibold text-lg">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="gap-4 grid grid-cols-2">
          <div>
            <label className="block mb-1 font-medium text-sm">Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="Product name"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">SKU</label>
            <input
              value={sku}
              onChange={e => setSku(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="Stock Keeping Unit"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Purchase Price
            </label>
            <input
              type="number"
              step="0.01"
              value={purchasePrice}
              onChange={e => setPurchasePrice(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Sale Price</label>
            <input
              type="number"
              step="0.01"
              value={salePrice}
              onChange={e => setSalePrice(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Minimum Stock
            </label>
            <input
              type="number"
              value={minStock}
              onChange={e => setMinStock(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="5"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={editingId ? () => updateProduct(editingId) : addProduct}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>

          {editingId && (
            <button
              onClick={cancelEdit}
              className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="border w-full">
          <thead className="">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">SKU</th>
              <th className="p-2 text-left">Purchase Price</th>
              <th className="p-2 text-left">Sale Price</th>
              <th className="p-2 text-left">Min Stock</th>
              <th className="p-2 text-left">Created At</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border">
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.sku || "-"}</td>
                <td className="p-2">
                  {product.purchasePrice
                    ? `$${product.purchasePrice.toFixed(2)}`
                    : "-"}
                </td>
                <td className="p-2">
                  {product.salePrice ? `$${product.salePrice.toFixed(2)}` : "-"}
                </td>
                <td className="p-2">
                  <span
                    className={
                      product.minStock <= 5 ? "text-red-600 font-semibold" : ""
                    }
                  >
                    {product.minStock}
                  </span>
                </td>
                <td className="p-2">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => editProduct(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="p-8 text-gray-500 text-center">
            No products found. Add your first product above.
          </div>
        )}
      </div>
    </div>
  );
}
