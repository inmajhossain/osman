import connectDB from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { startDate, endDate } = await req.json();

  const data = await Purchase.find({
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  });

  return NextResponse.json(data);
}
