import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  productName: String,
  quantity: Number,
  unitPrice: Number,

  vatRate: {
    type: Number,
    default: 15,
  },

  vatAmount: Number,
  total: Number,

  customerName: String,

  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);
