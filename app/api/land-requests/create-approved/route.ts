import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Not authenticated as admin" }, { status: 401 });
  }

  try {
    const { userId, landSize, landAddress, notes } = await request.json();
    if (!userId || !landSize || !landAddress) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const farmingRequest = await prisma.farmingRequest.create({
      data: {
        userId,
        landSize,
        landAddress,
        notes,
        preferredLanguage: "en",
        status: "APPROVED",
      },
      include: {
        user: true
      }
    });

    return NextResponse.json({ message: "Project created successfully", farmingRequest }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error creating project" }, { status: 500 });
  }
}
