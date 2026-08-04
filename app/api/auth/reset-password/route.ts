import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, validatePassword } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();
    if (!token || !newPassword) return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });

    const pwValid = validatePassword(newPassword);
    if (!pwValid.valid) return NextResponse.json({ error: pwValid.message }, { status: 400 });

    const user = await prisma.user.findFirst({ where: { resetPasswordToken: token, resetPasswordExpires: { gt: new Date() } } });
    if (!user) return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null } });

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
