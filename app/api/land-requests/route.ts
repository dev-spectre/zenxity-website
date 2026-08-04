import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const { landSize, preferredLanguage, landAddress, notes, surveyNo, pattaNo, legalInfo } = await request.json();
    if (!landSize || !preferredLanguage || !landAddress) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newRequest = await prisma.farmingRequest.create({
      data: { 
        userId: session.user.id, 
        landSize, 
        preferredLanguage, 
        landAddress, 
        notes,
        surveyNo,
        pattaNo,
        legalInfo
      },
    });

    return NextResponse.json({ message: "Land request submitted successfully", request: newRequest }, { status: 201 });
  } catch (error) {
    console.error("Error submitting land request:", error);
    if (error instanceof Error) {
        console.error(error.message, error.stack);
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const requests = await prisma.farmingRequest.findMany({ where: { userId: session.user.id } });
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching land requests:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
