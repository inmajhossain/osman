import connectDB from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import Sale from "@/models/Sale";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { month, year } = await req.json();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  const purchases = await Purchase.find({
    date: { $gte: start, $lte: end },
  });

  const sales = await Sale.find({
    date: { $gte: start, $lte: end },
  });

  const inputVAT = purchases.reduce((a, b) => a + b.vatAmount, 0);
  const outputVAT = sales.reduce((a, b) => a + b.vatAmount, 0);

  return NextResponse.json({
    inputVAT,
    outputVAT,
    vatDue: outputVAT - inputVAT,
  });
}
