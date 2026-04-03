import connectDB from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import { NextResponse } from "next/server";

// Next.js 13+ এর সঠিক সিনট্যাক্স
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // params কে await করতে হবে (Next.js 15+ এর জন্য)
    const { id } = await params;
    console.log("PUT Request - Received ID:", id);

    if (!id) {
      return NextResponse.json(
        { error: "No purchase ID provided" },
        { status: 400 }
      );
    }

    await connectDB();
    const data = await request.json();

    const purchase = await Purchase.findByIdAndUpdate(
      id,
      {
        productName: data.productName,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        vatRate: data.vatRate,
        vatAmount: data.vatAmount,
        total: data.total,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!purchase) {
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Purchase updated successfully",
      purchase,
    });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update purchase", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // params কে await করতে হবে (Next.js 15+ এর জন্য)
    const { id } = await params;
    console.log("DELETE Request - Received ID:", id);

    if (!id) {
      return NextResponse.json(
        { error: "No purchase ID provided" },
        { status: 400 }
      );
    }

    await connectDB();

    const purchase = await Purchase.findByIdAndDelete(id);

    if (!purchase) {
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Purchase deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete purchase", details: error.message },
      { status: 500 }
    );
  }
}
