import connectDB from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import Sale from "@/models/Sale";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const purchases = await Purchase.find();
  const sales = await Sale.find();

  const stock: any = {};

  purchases.forEach((p: any) => {
    if (!stock[p.productName]) {
      stock[p.productName] = { purchased: 0, sold: 0 };
    }
    stock[p.productName].purchased += p.quantity;
  });

  sales.forEach((s: any) => {
    if (!stock[s.productName]) {
      stock[s.productName] = { purchased: 0, sold: 0 };
    }
    stock[s.productName].sold += s.quantity;
  });

  const result = Object.keys(stock).map(name => ({
    product: name,
    purchased: stock[name].purchased,
    sold: stock[name].sold,
    stock: stock[name].purchased - stock[name].sold,
  }));

  return NextResponse.json(result);
}
