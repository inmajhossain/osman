import Invoice from "@/models/Invoice";

const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });

let invoiceNumber = "INV-00001";

if (lastInvoice) {
  const num = Number(lastInvoice.invoiceNumber.split("-")[1]) + 1;

  invoiceNumber = `INV-${String(num).padStart(5, "0")}`;
}
