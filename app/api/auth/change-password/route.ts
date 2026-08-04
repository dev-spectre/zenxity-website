import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { comparePassword, hashPassword, validatePassword } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 });

    const pwValid = validatePassword(newPassword);
    if (!pwValid.valid) return NextResponse.json({ error: pwValid.message }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (!user.password) return NextResponse.json({ error: "Cannot change password for OAuth-only accounts" }, { status: 400 });

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
