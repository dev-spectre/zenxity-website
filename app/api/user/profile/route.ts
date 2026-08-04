import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { name, mobileNumber, bankName, accountNumber, ifscCode } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        mobileNumber,
        bankName,
        accountNumber,
        ifscCode
      }
    });

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}
