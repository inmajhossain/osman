import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    sku: String,

    purchasePrice: Number,

    salePrice: Number,

    minStock: {
      type: Number,
      default: 5,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "products", // Explicitly set collection name
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
