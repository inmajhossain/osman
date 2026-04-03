import connectDB from "@/lib/mongodb";
import Sale from "@/models/Sale";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { startDate, endDate } = await req.json();

  const data = await Sale.find({
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  });

  return NextResponse.json(data);
}
