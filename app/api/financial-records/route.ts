import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Not authenticated as admin" }, { status: 401 });
  }

  try {
    const { userId, description, amount } = await request.json();

    if (!userId || !description || amount === undefined) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const record = await prisma.financialRecord.create({
      data: {
        userId,
        description,
        amount: parseFloat(amount),
      },
    });

    return NextResponse.json({ message: "Financial record created successfully", record }, { status: 201 });
  } catch (error) {
    console.error("Error creating financial record:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const records = await prisma.financialRecord.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ records }, { status: 200 });
  } catch (error) {
    console.error("Error fetching financial records:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
