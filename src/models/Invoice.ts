import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: String,

  customerName: String,

  items: Array,

  subtotal: Number,
  vatTotal: Number,
  grandTotal: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", InvoiceSchema);
