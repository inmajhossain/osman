import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();

  const { username, password } = await req.json();

  const user = await User.findOne({ username });

  if (!user) return NextResponse.json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return NextResponse.json({ error: "Invalid password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return NextResponse.json({ token });
}
