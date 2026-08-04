import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateEmail, generateRandomToken, sendPasswordResetEmail } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    if (!validateEmail(email)) return NextResponse.json({ error: "Invalid email format" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    const msg = { message: "If a user with that email exists, a password reset link has been sent" };
    if (!user || !user.password) return NextResponse.json(msg);

    const resetToken = generateRandomToken();
    const resetExpires = new Date(Date.now() + 3600000);
    await prisma.user.update({ where: { id: user.id }, data: { resetPasswordToken: resetToken, resetPasswordExpires: resetExpires } });
    await sendPasswordResetEmail(user.email, resetToken);

    return NextResponse.json(msg);
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
