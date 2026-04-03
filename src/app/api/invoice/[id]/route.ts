import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const invoice = await Invoice.findById(params.id);

  return NextResponse.json(invoice);
}
