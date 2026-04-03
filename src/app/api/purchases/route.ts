// লাইন 1 পরিবর্তন করুন
import connectDB from "@/lib/mongodb"; // default import ব্যবহার করুন
// আগে ছিল: import connectDB from "@/lib/mongodb";

import Purchase from "@/models/Purchase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    let query = {};
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query = {
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      };
    }

    const purchases = await Purchase.find(query).sort({ date: -1 });
    return NextResponse.json(purchases);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.productName || !data.quantity || !data.unitPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const purchase = await Purchase.create(data);
    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create purchase" },
      { status: 500 }
    );
  }
}
