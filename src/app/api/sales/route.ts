import connectDB from "@/lib/mongodb";
import Sale from "@/models/Sale";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const data = await req.json();

  const vat = data.unitPrice * data.quantity * 0.15;

  const total = data.unitPrice * data.quantity + vat;

  const sale = await Sale.create({
    ...data,
    vatAmount: vat,
    total,
  });

  return NextResponse.json(sale);
}
