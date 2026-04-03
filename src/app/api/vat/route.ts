import connectDB from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import Sale from "@/models/Sale";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const purchases = await Purchase.find();
  const sales = await Sale.find();

  const inputVAT = purchases.reduce((a, b) => a + b.vatAmount, 0);
  const outputVAT = sales.reduce((a, b) => a + b.vatAmount, 0);

  return NextResponse.json({
    inputVAT,
    outputVAT,
    vatDue: outputVAT - inputVAT,
  });
}
